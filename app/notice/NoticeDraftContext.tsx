"use client"

import { createContext, useCallback, useContext, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import Modal from "@/components/common/Modal"
import Radio from "@/components/ui/Radio"
import Texts from "@/components/ui/Texts"
import Dates from "@/components/ui/Dates"
import { CreateContentsFn, DelNotificationDetailFn, GetContentsDetailFn, GetContentsNoticeFn, PathContentSceduleFn, PutContentsDetail, PutContentsSceduleFn, PutNotificationDetailFn, PutNotificationScheduleFn, SetContentsSceduleFn, SetNotificationFn, SetNotificationScheduleFn } from "../api/Notice"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"

function getNotificationFromResult(result: any) {
    const data = result && typeof result === "object" && "data" in result
        ? result.data
        : result
    if (data == null) return null
    const payload = data && typeof data === "object" && "notification" in data
        ? data.notification
        : data && typeof data === "object" && "notifications" in data
            ? data.notifications
            : data
    return Array.isArray(payload) ? payload[0] : payload
}

async function assertRequestSucceeded(response: Response, label: string) {
    const result = await response.clone().json().catch(() => null)
    if (!response.ok || result?.success === false || result?.data?.success === false) {
        throw new Error(
            result?.message
                ?? result?.error
                ?? result?.data?.message
                ?? `${label}에 실패했습니다. (HTTP ${response.status})`
        )
    }
    return result
}

export type NoticeDraft = {
    category: string[]
    title: string
    description: string
    link: string
}

export const NOTICE_CONTENT_DRAFT_KEY = "notice-content-draft"

export type StoredNoticeDraft = {
    draft: NoticeDraft
    savedAt: string
}

export type AlertDraft = {
    targetType: string
    title: string
    scheduledAt: string
}

type NoticeDraftContextValue = {
    draft: NoticeDraft
    setDraft: Dispatch<SetStateAction<NoticeDraft>>
    saveContentDraft: () => void
    clearContentDraft: () => void
    canSaveContentDraft: boolean
    draftSaveStatus: string
    setEditingContentId: (id: number, status?: string) => void
    isPublishable: boolean
    publishContents: () => Promise<void>
    alertDraft: AlertDraft
    setAlertDraft: Dispatch<SetStateAction<AlertDraft>>
    setAlertEditingInfo: (notificationId: string, contentId: number | null) => void
    alertValidationError: string
    alertSubmitError: string
    isSubmittingAlert: boolean
    publishAlert: () => Promise<void>
    requestAlertWriteExit: () => void
    cancelAlertWriteExit: () => void
    confirmAlertWriteExit: () => void
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
    const router = useRouter()
    const [draft, setDraft] = useState<NoticeDraft>({
        category: [],
        title: "",
        description: "",
        link: "",
    })
    const draftRef = useRef(draft)
    draftRef.current = draft
    const draftToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [draftSaveStatus, setDraftSaveStatus] = useState("")
    const [alertDraft, setAlertDraft] = useState<AlertDraft>({
        targetType: "all",
        title: "",
        scheduledAt: "",
    })
    const [alertValidationError, setAlertValidationError] = useState("")
    const [alertSubmitError, setAlertSubmitError] = useState("")
    const [alertNotificationId, setAlertNotificationId] = useState("")
    const [alertContentId, setAlertContentId] = useState<number | null>(null)
    const [isSubmittingAlert, setIsSubmittingAlert] = useState(false)
    const [isAlertExitConfirmOpen, setIsAlertExitConfirmOpen] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const isPublishable =
        draft.category.length > 0 &&
        draft.title.trim().length > 0 &&
        draft.description.trim().length > 0
    const isAlertPublishable =
        alertDraft.targetType.trim().length > 0 &&
        alertDraft.title.trim().length > 0 &&
        alertDraft.scheduledAt.trim().length > 0

    const updateAlertDraft = useCallback<Dispatch<SetStateAction<AlertDraft>>>((update) => {
        setAlertDraft(update)
        setAlertValidationError("")
    }, [])

    const updateNoticeDraft = useCallback<Dispatch<SetStateAction<NoticeDraft>>>((update) => {
        setDraft(update)
        setDraftSaveStatus("")
    }, [])

    const clearContentDraft = useCallback(() => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(NOTICE_CONTENT_DRAFT_KEY)
        }
        setDraftSaveStatus("")
    }, [])


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
    const [initialContentStatus, setInitialContentStatus] = useState("")
    const [contentAlreadySaved, setContentAlreadySaved] = useState(false)
    const [notifyId, setNotifyId] = useState(0)
    const [isSubmittingNotification, setIsSubmittingNotification] = useState(false)
    const [notificationError, setNotificationError] = useState('')
    const [showNotificationValidation, setShowNotificationValidation] = useState(false)

    const canSaveContentDraft = contentsId === 0
    const saveContentDraft = useCallback(() => {
        if (typeof window === "undefined" || contentsId > 0) return
        const currentDraft = draftRef.current
        const hasDraftContent = currentDraft.category.length > 0
            || currentDraft.title.trim().length > 0
            || currentDraft.description.trim().length > 0
            || currentDraft.link.trim().length > 0
        if (!hasDraftContent) {
            setDraftSaveStatus("저장할 내용이 없습니다.")
            return
        }
        try {
            const storedDraft: StoredNoticeDraft = {
                draft: currentDraft,
                savedAt: new Date().toISOString(),
            }
            window.localStorage.setItem(NOTICE_CONTENT_DRAFT_KEY, JSON.stringify(storedDraft))
            setDraftSaveStatus("임시 저장이 완료되었습니다.")
            if (draftToastTimerRef.current) clearTimeout(draftToastTimerRef.current)
            draftToastTimerRef.current = setTimeout(() => {
                setDraftSaveStatus("")
                draftToastTimerRef.current = null
            }, 3000)
        } catch {
            setDraftSaveStatus("임시 저장에 실패했습니다.")
        }
    }, [contentsId])


    const notificationTitle = useTitle ? draft.title : alertTitle
    const isPublishStatusValid =
        published === "scheduled"
            ? Boolean(date)
            : published === "published" || published === "draft"
    const isSavingNotification =
        isPublishStatusValid &&
        (sended !== "send" || notificationTitle.trim().length > 0)

    const setEditingContentId = useCallback((id: number, status = "") => {
        setContentsId(id)
        setInitialContentStatus(status)
        setContentAlreadySaved(false)
    }, [])

    const publishAlert = async (): Promise<void> => {
        if (!isAlertPublishable) {
            setAlertValidationError("대상자, 제목, 시간을 모두 입력해 주세요.")
            return
        }
        setAlertValidationError("")
        setAlertSubmitError("")
        if (isSubmittingAlert) return

        setIsSubmittingAlert(true)
        try {
            if (alertContentId === null) {
                throw new Error("알람에 연결된 콘텐츠를 확인할 수 없습니다.")
            }

            const contentId = String(alertContentId)
            const contentResult = await GetContentsDetailFn({ id: contentId })
            const contentData = contentResult?.data ?? contentResult
            const contentList = Array.isArray(contentData?.contents)
                ? contentData.contents
                : Array.isArray(contentData)
                    ? contentData
                    : []
            const content = contentData?.content
                ?? contentList.find((item: any) => String(item?.id) === contentId)
                ?? contentData
            const contentStatus = content?.status ?? content?.content_status

            if (contentStatus !== "public") {
                const statusResponse = await PathContentSceduleFn({
                    id: contentId,
                    status: "private",
                })
                await assertRequestSucceeded(statusResponse, "콘텐츠 상태 변경")

                const contentScheduleResponse = alertNotificationId
                    ? await PutContentsSceduleFn({ id: contentId, published_at: alertDraft.scheduledAt })
                    : await SetContentsSceduleFn({ id: contentId, published_at: alertDraft.scheduledAt })
                if (!contentScheduleResponse) throw new Error("콘텐츠 예약 응답을 받지 못했습니다.")
                try {
                    await assertRequestSucceeded(contentScheduleResponse, "알람 발송 전 콘텐츠 예약 설정")
                } catch (error) {
                    const cannotSchedulePublishedContent = error instanceof Error
                        && /content that has been published once cannot be scheduled/i.test(error.message)
                    if (!cannotSchedulePublishedContent) throw error

                    const publishResponse = await PathContentSceduleFn({
                        id: contentId,
                        status: "public",
                    })
                    await assertRequestSucceeded(publishResponse, "기존 발행 콘텐츠 공개 전환")
                }
            }

            if (alertNotificationId) {
                const scheduleResponse = await SetNotificationScheduleFn({
                    id: alertNotificationId,
                    scheduled_at: alertDraft.scheduledAt,
                })
                await assertRequestSucceeded(scheduleResponse, "알람 예약 변경")

                const detailResponse = await PutNotificationDetailFn({
                    id: alertNotificationId,
                    content_id: alertContentId,
                    target_type: alertDraft.targetType,
                    title: alertDraft.title,
                })
                await assertRequestSucceeded(detailResponse, "알람 수정")
            } else {
                const createResponse = await SetNotificationFn({
                    content_id: alertContentId,
                    scheduled_at: alertDraft.scheduledAt,
                    target_type: alertDraft.targetType,
                    title: alertDraft.title,
                })
                const createdResult = await assertRequestSucceeded(createResponse, "알람 생성")

                const createdNotificationId = createdResult?.data?.id
                    ?? createdResult?.data?.notification?.id
                    ?? createdResult?.data?.notification_id
                    ?? createdResult?.id
                    ?? createdResult?.notification_id
                if (createdNotificationId === undefined || createdNotificationId === null) {
                    throw new Error("생성 응답에서 알람 ID를 찾을 수 없습니다.")
                }
                const scheduleResponse = await SetNotificationScheduleFn({
                    id: String(createdNotificationId),
                    scheduled_at: alertDraft.scheduledAt,
                })
                await assertRequestSucceeded(scheduleResponse, "알람 예약 설정")
            }

            setAlertDraft({ targetType: "all", title: "", scheduledAt: "" })
            setAlertNotificationId("")
            setAlertContentId(null)
            router.push("/notice/setalerts")
        } catch (error) {
            setAlertSubmitError(error instanceof Error ? error.message : "알람을 저장하지 못했습니다.")
        } finally {
            setIsSubmittingAlert(false)
        }
    }

    const setAlertEditingInfo = useCallback((notificationId: string, contentId: number | null) => {
        setAlertNotificationId(notificationId)
        setAlertContentId(contentId)
        setAlertSubmitError("")
        setAlertValidationError("")
    }, [])

    const requestAlertWriteExit = () => setIsAlertExitConfirmOpen(true)
    const cancelAlertWriteExit = () => setIsAlertExitConfirmOpen(false)
    const confirmAlertWriteExit = () => {
        setIsAlertExitConfirmOpen(false)
        setAlertDraft({ targetType: "all", title: "", scheduledAt: "" })
        setAlertNotificationId("")
        setAlertContentId(null)
        setAlertValidationError("")
        setAlertSubmitError("")
        router.push("/notice/setalerts")
    }

    const loadNotificationSettings = async (contentId: number): Promise<boolean> => {
        setNotifyId(0)
        setSended("pandding")
        setFollow(follow_opt[0].val)
        setUseTitle(false)
        setAlertTitle("")
        setPublished("")
        setDate("")
        const result = await GetContentsNoticeFn({ id: String(contentId) })
        if (result == null || result?.data === null) {
            setPublished("draft")
            return false
        }
        const notification = getNotificationFromResult(result)
        const contentStatus = notification?.content_status
            ?? result?.data?.content_status
            ?? result?.content_status
        const sendStatus = notification?.send_status
            ?? result?.data?.send_status
            ?? result?.send_status

        if (contentStatus === "public") {
            setPublished("published")
        } else if (contentStatus === "private" && sendStatus === "pending") {
            setPublished("scheduled")
            const scheduledAt = notification?.published_at
                ?? notification?.scheduled_at
                ?? result?.data?.published_at
                ?? result?.data?.scheduled_at
            if (scheduledAt) setDate(String(scheduledAt))
        } else if (contentStatus === "private") {
            setPublished("draft")
        }

        if (
            result?.status === 404 ||
            result?.success === false ||
            !notification ||
            typeof notification !== "object" ||
            Object.keys(notification).length === 0 ||
            notification.status === 404 ||
            notification.has_notification === false
        ) return contentStatus === "public"

        const notificationId = Number(notification.id ?? notification.notification_id ?? 0)
        const targetType = notification.target_type
        const title = String(notification.title ?? notification.notification_title ?? "")
        setNotifyId(Number.isFinite(notificationId) ? notificationId : 0)
        setSended("send")
        setFollow(follow_opt.some((option) => option.val === targetType) ? targetType : follow_opt[0].val)
        setAlertTitle(title)
        setUseTitle(title === draft.title && title.length > 0)
        return contentStatus === "public"
    }

    const publishContents = async () => {
        if (!isPublishable || isSubmittingNotification) return
        setNotificationError("")
        setShowNotificationValidation(false)

        if (contentsId > 0) {
            setIsSubmittingNotification(true)
            let wasPreviouslyPublic = false
            try {
                const response = await PutContentsDetail({
                    id: String(contentsId),
                    categories: draft.category,
                    title: draft.title,
                    body: draft.description,
                    link_url: draft.link,
                })
                if (!response.ok) {
                    throw new Error(`콘텐츠 수정에 실패했습니다. (HTTP ${response.status})`)
                }
                setContentAlreadySaved(true)
                wasPreviouslyPublic = initialContentStatus === "public"
                if (!wasPreviouslyPublic) {
                    wasPreviouslyPublic = await loadNotificationSettings(contentsId)
                }
            } catch (error) {
                setNotificationError(error instanceof Error ? error.message : "콘텐츠 수정에 실패했습니다.")
            } finally {
                setIsSubmittingNotification(false)
            }
            if (wasPreviouslyPublic) {
                setIsPreviewOpen(false)
                router.push("/notice/contents")
                return
            }
        }
        setIsPreviewOpen(true)
    }

    const saveNotificationSettings = async () => {
        setShowNotificationValidation(true)
        if (!isPublishable || !isSavingNotification || isSubmittingNotification) return

        setIsSubmittingNotification(true)
        setNotificationError('')

        try {
            let contentId = contentsId
            const isEditingContent = contentId > 0
            if (contentId && !contentAlreadySaved) {
                const response = await PutContentsDetail({
                    id: String(contentId),
                    categories: draft.category,
                    title: draft.title,
                    body: draft.description,
                    link_url: draft.link,
                })
                if (!response.ok) {
                    throw new Error(`콘텐츠 수정에 실패했습니다. (HTTP ${response.status})`)
                }
                setContentAlreadySaved(true)
            } else {
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
                    setContentAlreadySaved(true)
                }
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
                const notificationScheduledAt = published === "scheduled"
                    ? date
                    : published === "published"
                        ? dayjs().add(10, "second").format("YYYY-MM-DDTHH:mm:ss+09:00")
                        : dayjs().format("YYYY-MM-DDTHH:mm:ss+09:00")

                let response: Response
                if (notifyId > 0) {
                    response = await PutNotificationDetailFn({
                        id: String(notifyId),
                        content_id: contentId,
                        target_type: follow,
                        title: notificationTitle,
                    })
                    if (response.ok) {
                        response = await PutNotificationScheduleFn({
                            id: String(notifyId),
                            scheduled_at: notificationScheduledAt,
                        })
                    }
                } else {
                    response = await SetNotificationFn({
                        content_id: contentId,
                        scheduled_at: notificationScheduledAt,
                        target_type: follow,
                        title: notificationTitle,
                    })
                }
                if (!response.ok) {
                    throw new Error(`알람 설정에 실패했습니다. (HTTP ${response.status})`)
                }

                const result = await response.json().catch(() => null)
                const id = result?.data?.id ?? result?.id
                if (id) setNotifyId(Number(id))
            } else {
                let id = notifyId
                if (!id) {
                    const result = await GetContentsNoticeFn({ id: String(contentId) })
                    const notification = getNotificationFromResult(result)
                    id = Number(notification?.id ?? notification?.notification_id ?? 0)
                }

                if (id > 0) {
                    const response = await DelNotificationDetailFn({ id })
                    if (!response.ok) {
                        throw new Error(`알람 삭제에 실패했습니다. (HTTP ${response.status})`)
                    }
                }
                setNotifyId(0)
            }

            if (!isEditingContent) {
                setContentsId(0)
                setInitialContentStatus("")
                setContentAlreadySaved(false)
            }
            setNotifyId(0)
            setIsPreviewOpen(false)
            clearContentDraft()
            router.push("/notice/contents")
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
            value={{
                draft,
                setDraft: updateNoticeDraft,
                saveContentDraft,
                clearContentDraft,
                canSaveContentDraft,
                draftSaveStatus,
                setEditingContentId,
                isPublishable,
                publishContents,
                alertDraft,
                setAlertDraft: updateAlertDraft,
                setAlertEditingInfo,
                alertValidationError,
                alertSubmitError,
                isSubmittingAlert,
                publishAlert,
                requestAlertWriteExit,
                cancelAlertWriteExit,
                confirmAlertWriteExit,
            }}
        >
            {children}
            <Modal
                isOpen={isAlertExitConfirmOpen}
                onClose={cancelAlertWriteExit}
                ariaLabel="작성 종료 확인"
                width={350}
            >
                <div className="space-y-5 p-6 text-center">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={cancelAlertWriteExit}
                            aria-label="모달 닫기"
                            className="text-3xl leading-none text-gray-500"
                        >
                            ×
                        </button>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">작성을 종료하시겠습니까?</p>
                        <p className="mt-2 text-sm text-gray-400">작성중인 글은 저장되지 않아요.</p>
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={cancelAlertWriteExit}
                            className="h-10 w-24 rounded-lg border border-[#17A48A] bg-white font-semibold text-[#17A48A]"
                        >
                            아니오
                        </button>
                        <button
                            type="button"
                            onClick={confirmAlertWriteExit}
                            className="h-10 w-24 rounded-lg bg-[#17A48A] font-semibold text-white"
                        >
                            네
                        </button>
                    </div>
                </div>
            </Modal>
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
                                           warning={showNotificationValidation && published === "scheduled" && !date ? "시간을 다시 선택해주세요" : undefined}
                                           warningPosition="below"
                                           warningBorderClass="border-rose-500"
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
                                                    warning={showNotificationValidation && sended === "send" && !notificationTitle.trim() ? "필수 정보입니다" : undefined}
                                                    warningPosition="below"
                                                    warningBorderClass="border-rose-500"
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
                            disabled={!isPublishable || isSubmittingNotification}
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
