"use client"

import { usePathname, useRouter } from "next/navigation"
import Button from "../ui/Button"
import { useNoticeDraft } from "@/app/notice/NoticeDraftContext"

function LeftArrowIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function Header () {

    const pathName = usePathname()
    const router = useRouter()
    const {
        isPublishable,
        publishContents,
        saveContentDraft,
        canSaveContentDraft,
        draftSaveStatus,
        publishAlert,
        isSubmittingAlert,
        requestAlertWriteExit,
    } = useNoticeDraft()


    const goUrl = (str:string) => {
        if(str == 'contents') {
            location.href = '/notice/contents'
        } else if(str == 'alerts') {
            location.href = '/notice/setalerts'
        }
    }

    return (
        <div className="h-20 border-b border-gray-300">
            {
                !pathName.includes('write') ? (
                    <div className="flex items-center justify-between py-4  max-w-300 mx-auto">
                 <div className="flex items-center gap-4 space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/notice/contents?page=1"
                        }}
                        className="cursor-pointer rounded-lg border px-1 text-sm text-[#17A48A]"
                        aria-label="콘텐츠 목록 첫 페이지로 이동"
                    >
                        us
                    </button>
                    <div>
                        <button onClick={() => {
                            goUrl('contents')
                        }}
                        className={
                            pathName.includes('/contents') ? 'bg-gray-100  py-2.5 px-4 rounded-2xl font-extrabold' : 'text-gray-400  py-2.5 px-4 rounded-2xl font-extrabold'
                        }
                        >콘텐츠</button>
                        <button onClick={() => {
                            goUrl('alerts')
                        }}
                        className={
                            pathName.includes('/setalerts') ? "bg-gray-100  py-2.5 px-4 rounded-2xl font-extrabold" : "text-gray-400 py-2.5 px-4 rounded-2xl font-extrabold"
                        }
                        >알람</button>
                    </div>
                </div>
                <div>
                    <Button text={'새 글쓰기'} onClick={() => {
                        router.push('/notice/contents/write')
                    }}/>
                </div>
            </div>
                ) : (
                    <div>
                        {pathName.includes('contents') ? (
                            <div className="flex items-center justify-between py-4  max-w-300 mx-auto">
                            <div className="flex items-center gap-4 space-x-4">
                                <div>
                                    <button onClick={() => router.push('/notice/contents')} className="flex items-center gap-2 font-bold">
                                        <LeftArrowIcon />
                                        콘텐츠 쓰기
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    text={'임시저장'}
                                    onClick={saveContentDraft}
                                    type={'light'}
                                    disabled={!canSaveContentDraft}
                                    className="cursor-pointer"
                                />
                                <Button
                                    text={'발행하기'}
                                    onClick={publishContents}
                                    disabled={!isPublishable}
                                />
                            </div>
                        </div>
                        ) : (
                            <div className="flex items-center justify-between py-4  max-w-300 mx-auto">
                            <div className="flex items-center gap-4 space-x-4">
                                <div>
                                    <button onClick={requestAlertWriteExit} className="flex items-center gap-2 font-bold">
                                        <LeftArrowIcon />
                                        알람 발송
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    text={isSubmittingAlert ? '저장 중...' : '발행하기'}
                                    onClick={publishAlert}
                                    disabled={isSubmittingAlert}
                                />
                            </div>
                        </div>
                        )}
                    </div>
                )
            }
            {draftSaveStatus && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed right-6 top-24 z-[100] rounded-lg bg-[#17A48A] px-4 py-3 text-sm font-medium text-white shadow-lg"
                >
                    {draftSaveStatus}
                </div>
            )}
        </div>
    )
}
