"use client"

import Radio from "@/components/ui/Radio";
import Texts from "@/components/ui/Texts";
import Dates from "@/components/ui/Dates";
import { useNoticeDraft } from "@/app/notice/NoticeDraftContext";
import { GetNotificationDetailFn, GetNotificationScheduleFn } from "@/app/api/Notice";
import { useEffect, useState } from "react";


export default function AddAlert() {
    const {
        alertDraft,
        setAlertDraft,
        setAlertEditingInfo,
        alertValidationError,
        alertSubmitError,
    } = useNoticeDraft()
    const [loadError, setLoadError] = useState("")
    const showTitleWarning = Boolean(alertValidationError && !alertDraft.title.trim())
    const showTimeWarning = Boolean(alertValidationError && !alertDraft.scheduledAt.trim())
    const list = [
        {title: "전체", val: 'all'},
        {title: "팔로워", val: 'follower'},
        {title: "멤버십", val: "member"}
    ]

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const notificationId = params.get("notification_id")
        const contentIdParam = params.get("content_id")
        const contentId = contentIdParam ? Number(contentIdParam) : null
        let isActive = true

        setLoadError("")
        setAlertDraft({ targetType: "all", title: "", scheduledAt: "" })

        if (!notificationId) {
            setAlertEditingInfo("", Number.isFinite(contentId) ? contentId : null)
            return () => { isActive = false }
        }

        setAlertEditingInfo(notificationId, null)
        Promise.all([
            GetNotificationDetailFn({ id: notificationId }),
            GetNotificationScheduleFn({ id: notificationId }).catch(() => null),
        ])
            .then(([detailResult, scheduleResult]) => {
                const detail = detailResult?.data?.notification
                    ?? detailResult?.notification
                    ?? detailResult?.data
                    ?? detailResult
                const schedule = scheduleResult?.data?.schedule
                    ?? scheduleResult?.schedule
                    ?? scheduleResult?.data
                    ?? scheduleResult
                const resolvedContentId = Number(detail?.content_id ?? detail?.content?.id)
                const scheduledAt = schedule?.scheduled_at
                    ?? schedule?.published_at
                    ?? detail?.scheduled_at
                    ?? ""

                if (!isActive) return
                setAlertDraft({
                    targetType: String(detail?.target_type ?? "all"),
                    title: String(detail?.title ?? ""),
                    scheduledAt: String(scheduledAt),
                })
                setAlertEditingInfo(
                    notificationId,
                    Number.isFinite(resolvedContentId) && resolvedContentId > 0 ? resolvedContentId : null
                )
            })
            .catch((error) => {
                if (isActive) {
                    setLoadError(error instanceof Error ? error.message : "알람 상세 정보를 불러오지 못했습니다.")
                }
            })

        return () => { isActive = false }
    }, [setAlertDraft, setAlertEditingInfo])


    return(
        <div className="w-150 mx-auto space-y-4">
            {loadError && <p role="alert" className="text-sm text-rose-600">{loadError}</p>}
            {alertSubmitError && <p role="alert" className="text-sm text-rose-600">{alertSubmitError}</p>}
            <div>
                <Radio
                    title="대상자"
                    tag="alert-target"
                    checked={alertDraft.targetType}
                    lists={list}
                    onChange={(targetType) => setAlertDraft((current) => ({ ...current, targetType }))}
                />
            </div>
            <div>
                <Texts 
                    type={"text"} 
                    title={"제목"} 
                    placeholder={"알람 제목을 입력해 주세요"}
                    val={alertDraft.title}
                    warning={showTitleWarning ? "필수 정보입니다.." : undefined}
                    onTextHandler={(title) => setAlertDraft((current) => ({ ...current, title }))}
                />
            </div>
            <div>
                <Dates
                    title={"시간"}
                    date={alertDraft.scheduledAt}
                    placeholder={"알람 발송 시간을 선택해 주세요"}
                    warning={showTimeWarning ? "필수 정보입니다." : undefined}
                    onDateHandler={(scheduledAt: string) => setAlertDraft((current) => ({ ...current, scheduledAt }))}
                />
            </div>
        </div>
    )
}
