"use client"

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import Modal from "@/components/common/Modal"
import Radio from "@/components/ui/Radio"
import Texts from "@/components/ui/Texts"
import Dates from "@/components/ui/Dates"
import { CreateContentsFn, DelNotificationDetailFn, GetContentsNoticeFn, PathContentSceduleFn, SetContentsSceduleFn, SetNotificationFn } from "../api/Notice"
import dayjs from "dayjs"

export type NoticeDraft = {
    category: string[]
    title: string
    description: string
    link: string
}

type NoticeDraftContextValue = {
    draft: NoticeDraft
    setDraft: Dispatch<SetStateAction<NoticeDraft>>
    isPublishable: boolean
    publishContents: () => Promise<void>
}

const NoticeDraftContext = createContext<NoticeDraftContextValue | null>(null)

export function useNoticeDraft() {
    const context = useContext(NoticeDraftContext)
    if (!context) {
        throw new Error("useNoticeDraft는 NoticeDraftProvider 안에서 사용해야 합니다.")
    }
    return context
}

export function NoticeDraftProvider({ children }: { children: ReactNode }) {
    const [draft, setDraft] = useState<NoticeDraft>({
        category: [],
        title: "",
        description: "",
        link: "",
    })
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const isPublishable =
        draft.category.length > 0 &&
        draft.title.trim().length > 0 &&
        draft.description.trim().length > 0


    const publish_opt = [
        {title: "공개", val: "published"},
        {title: "비공개", val: "draft"},
        {title: "예약", val: "scheduled"},
    ]

    const [published, setPublished] = useState('')

    const send_opt = [
        {title: "발송", val: "send"},
        {title: "미발송", val: "pandding"}
    ]

    const [sended, setSended] = useState(send_opt[0].val)


    const follow_opt = [
        {title: "전체", val: "all"},
        {title: "팔로워", val: "follower"},
        {title: "멤버십", val: "member"}
    ]

    const [follow, setFollow] = useState(follow_opt[0].val)

    const [useTitle, setUseTitle] = useState(false)
    const [alertTitle, setAlertTitle] = useState('')

    const [date, setDate] = useState('')

    const [contentsId, setContentsId] = useState(0)
    const [notifyId, setNotifyId] = useState(0)
    const [isSubmittingNotification, setIsSubmittingNotification] = useState(false)
    const [notificationError, setNotificationError] = useState('')


    const notificationTitle = useTitle ? draft.title : alertTitle
    const isPublishStatusValid =
        published === "scheduled"
            ? Boolean(date)
            : published === "published" || published === "draft"
    const isSavingNotification =
        isPublishStatusValid &&
        (sended !== "send" || notificationTitle.trim().length > 0)

    const publishContents = async () => {
        if (!isPublishable) return
        setNotificationError("")
        setIsPreviewOpen(true)
    }

    const saveNotificationSettings = async () => {
        if (!isPublishable || !isSavingNotification || isSubmittingNotification) return

        setIsSubmittingNotification(true)
        setNotificationError('')

        try {
            let contentId = contentsId
            if (!contentId) {
                const result = await CreateContentsFn({
                    categories: draft.category,
                    title: draft.title,
                    body: draft.description,
                    link_url: draft.link,
                })
                const createdId = result?.data?.id ?? result?.id
                if (createdId === undefined || createdId === null) {
                    throw new Error("생성된 콘텐츠 ID를 응답에서 찾을 수 없습니다.")
                }
                contentId = Number(createdId)
                setContentsId(contentId)
            }

            const statusResponse = await PathContentSceduleFn({
                id: String(contentId),
                status: published === "published" ? "public" : "private",
            })
            if (!statusResponse.ok) {
                throw new Error(`공개 상태 저장에 실패했습니다. (HTTP ${statusResponse.status})`)
            }

            if (published === "scheduled") {
                const scheduleResponse = await SetContentsSceduleFn({
                    id: String(contentId),
                    published_at: date,
                })
                if (!scheduleResponse.ok) {
                    throw new Error(`예약 발행 설정에 실패했습니다. (HTTP ${scheduleResponse.status})`)
                }
            }

            if (sended === 'send') {
                const response = await SetNotificationFn({
                    content_id: contentId,
                    scheduled_at: published === "scheduled"
                        ? date
                        : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                    target_type: follow,
                    title: notificationTitle,
                })
                if (!response.ok) {
                    throw new Error(`알람 설정에 실패했습니다. (HTTP ${response.status})`)
                }

                const result = await response.json().catch(() => null)
                const id = result?.data?.id ?? result?.id
                if (id) setNotifyId(Number(id))
            } else {
                let id = notifyId
                if (!id) {
                    const response = await GetContentsNoticeFn({ id: String(contentId) })
                    if (response.ok) {
                        const result = await response.json()
                        id = Number(result?.data?.id ?? result?.id ?? 0)
                    }
                }

                if (id > 0) {
                    const response = await DelNotificationDetailFn({ id })
                    if (!response.ok) {
                        throw new Error(`알람 삭제에 실패했습니다. (HTTP ${response.status})`)
                    }
                }
                setNotifyId(0)
            }

            setContentsId(0)
            setNotifyId(0)
            setIsPreviewOpen(false)
        } catch (error) {
            setNotificationError(
                error instanceof Error ? error.message : "발행 설정을 저장하지 못했습니다."
            )
        } finally {
            setIsSubmittingNotification(false)
        }
    }

    return (
        <NoticeDraftContext.Provider
            value={{ draft, setDraft, isPublishable, publishContents }}
        >
            {children}
            <Modal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                ariaLabel=""
            >
                <div className="space-y-5">
                    <div className="w-full flex items-center justify-between p-6 border-b border-gray-300">
                        <div>
                            <h2 className="text-lg font-bold ">발행 하기</h2>
                        </div>
                        <div>
                            <button className="text-xl" onClick={()=> {
                                setIsPreviewOpen(false)
                            }}>
                                X
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4 p-6">
                        {notificationError && (
                            <p role="alert" className="text-sm text-rose-600">{notificationError}</p>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="font-semibold">
                                공개하기
                            </div>
                            <div>
                                <Radio checked={published} lists={publish_opt} tag={"publish"} onChange={(val) => {
                                    setPublished(val)
                                    setSended(val === "draft" ? "pandding" : "send")
                                }} />
                            </div>
                        </div>
                        {
                            published.includes('scheduled') && (
                                <div>
                                    <div className="flex w-full items-center gap-2">
                                        <div className="font-semibold">예약 발행</div>
                                        <div className="flex-1">
                                           <Dates date={date} 
                                           placeholder="발행 예약 시간을 선택해주세요"
                                           onDateHandler={(val) => {
                                                const time = dayjs(val).format('YYYY-MM-DDTHH:mm:ss+09:00')
                                                setDate(time)
                                           }}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div>
                            <div className="font-semibold">알람 설정</div>
                            <div className="mt-1 whitespace-pre-wrap text-gray-500 border-b border-gray-300">
                                비공개 상태로  발행시 알람 설정은 자동으로 미발송으로 처리됩니다.
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">발송 여부</div>
                            <div>
                                <Radio disabled={published == 'draft'} checked={sended} lists={send_opt} tag={"sended"} onChange={(val) => {
                                    setSended(val)
                                }}></Radio>
                            </div>
                        </div>
                        {
                            sended.includes('send') && (
                                <div className="space-y-4">
                                     <div className="flex items-center gap-2">
                                        <div className="font-semibold">대상자</div>
                                        <div>
                                            <Radio checked={follow} lists={follow_opt} tag={"follow"} onChange={(val) => {
                                                setFollow(val)
                                            }}></Radio>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <div className="font-semibold">알람 내용</div>
                                        <div className="flex-1">
                                            <label htmlFor="alertTitle">
                                            <input type="checkbox" name="" id="alertTitle" className="mr-1"
                                            onChange={(e) => {
                                                setUseTitle(e.target.checked)
                                                if(e.target.checked) {
                                                    setAlertTitle(draft.title)
                                                }
                                            }}
                                            />
                                                콘텐츠 제목 사용
                                            </label>
                                            <div className="w-full">    
                                                <Texts
                                                    placeholder={"알림 제목을 입력해 주세요"}
                                                    val={useTitle ? draft.title : alertTitle}
                                                    onTextHandler={(str) => {
                                                        setAlertTitle(str)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex justify-end p-6 gap-2">
                        <button type="button" className="rounded-lg bg-gray-200 font-semibold px-4 py-2"
                        onClick={() => {
                            setIsPreviewOpen(false)
                        }}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={saveNotificationSettings}
                            disabled={!isPublishable || !isSavingNotification || isSubmittingNotification}
                            className="rounded-lg bg-[#17A48A] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmittingNotification ? "발행 중..." : "발행하기"}
                        </button>
                    </div>
                </div>
            </Modal>
        </NoticeDraftContext.Provider>
    )
}
