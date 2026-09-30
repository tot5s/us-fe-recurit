"use client"

import Pagenation from "@/components/ui/pagenation";
import { GetNotificationFn } from "@/app/api/Notice";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

type AlertRow = {
    id: number | string
    title: string
    success: number | string
    fail: number | string
    sendDate: string
    date: string
    state: string
}

const formatDate = (value?: string | null) => {
    if (!value) return "-"
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format("YY.MM.DD HH:mm") : "-"
}

const formatCount = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-"
    const count = Number(value)
    return Number.isFinite(count) ? count : "-"
}

const getSendState = (value?: string) => {
    switch (value?.toLowerCase()) {
        case "sent":
        case "success":
        case "completed":
            return "발송"
        case "failed":
        case "failure":
            return "실패"
        case "pending":
        case "scheduled":
            return "예약"
        default:
            return value || "-"
    }
}


export default function SetAlerts() {
    const router = useRouter()

    // pagination 값
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isQueryInitialized, setIsQueryInitialized] = useState(false)
    const [rows, setRows] = useState<AlertRow[]>([])
    const [total, setTotal] = useState(0)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const pageParam = Number(params.get("page"))
        const limitParam = Number(params.get("limit"))

        setCurrentPage(Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1)
        setLimit(Number.isInteger(limitParam) && limitParam > 0 ? limitParam : 10)
        setIsQueryInitialized(true)
    }, [])

    useEffect(() => {
        if (!isQueryInitialized) return

        const params = new URLSearchParams(window.location.search)
        params.set("page", String(currentPage))
        params.set("limit", String(limit))
        const query = params.toString()
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
        window.history.replaceState(null, "", nextUrl)
    }, [isQueryInitialized, currentPage, limit])

    useEffect(() => {
        if (!isQueryInitialized) return

        let isActive = true
        setIsLoading(true)
        setError("")

        GetNotificationFn({ page: currentPage, limit })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`알람 목록 조회에 실패했습니다. (HTTP ${response.status})`)
                }

                const result = await response.json()
                const data = result?.data ?? result
                const notifications = Array.isArray(data)
                    ? data
                    : data?.notifications ?? data?.items ?? []

                if (!isActive) return
                setRows(notifications.map((item: any) => ({
                    id: item.id,
                    title: item.title ?? "",
                    success: formatCount(item.stats?.success_count ?? item.success_count ?? item.success ?? item.sent_count),
                    fail: formatCount(item.stats?.failure_count ?? item.failure_count ?? item.failed_count ?? item.fail),
                    sendDate: formatDate(item.sent_at ?? item.send_at ),
                    date: formatDate(item.content_published_at ?? item.published_at ?? item.content?.published_at ?? item.content?.created_at),
                    state: getSendState(item.send_status ?? item.status),
                })))
                setTotal(Number(data?.total ?? result?.total ?? notifications.length))
                setError("")
            })
            .catch((fetchError) => {
                if (!isActive) return
                setRows([])
                setTotal(0)
                setError(fetchError instanceof Error ? fetchError.message : "알람 목록을 불러오지 못했습니다.")
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [isQueryInitialized, currentPage, limit])

     const changePage = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div className="">
            <div className="text-[38px] font-bold ">
                알람
            </div>
            <div className="py-4">
                 <table className="w-full">
                    <thead className="text-gray-500 border-b border-gray-300 text-center">
                        <tr className="text-sm">
                            <th className="py-2">번호</th>
                            <th className="py-2 w-[60%] text-center">제목</th>
                            <th className="py-2">발송 성공</th>
                            <th className="py-2">발송 실패</th>
                            <th className="py-2">발송 날짜</th>
                            <th className="py-2">공개일자</th>
                            <th className="py-2">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.length > 0 ? rows.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    tabIndex={0}
                                    aria-label={`${row.title} 알람 설정 수정`}
                                    onClick={() => router.push(`/notice/setalerts/write?notification_id=${encodeURIComponent(String(row.id))}`)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault()
                                            router.push(`/notice/setalerts/write?notification_id=${encodeURIComponent(String(row.id))}`)
                                        }
                                    }}
                                    className="text-center cursor-pointer hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#17A48A]"
                                >
                                    <td className="py-4">
                                        {total - ((currentPage - 1) * limit + idx)}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div>
                                            {row.title}
                                        </div>
                                    </td>
                                    <td>
                                        {row.success}
                                    </td>
                                    <td>
                                        {row.fail}
                                    </td>
                                    <td>
                                        {row.sendDate}
                                    </td>
                                    <td className="py-4">{row.date}</td>
                                    <td className="py-4">
                                        <div className="badge bg-[#F5FBFA] text-sm text-[#17A48A] rounded-lg">
                                            
                                            {row.state}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center text-gray-500">
                                        {isLoading ? "알람을 불러오는 중..." : error || "등록된 알람이 없습니다."}
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

                <div>
                    <Pagenation totalCount={total} perPage={limit} currentPage={currentPage} onPageChange={changePage}/>
                </div>
            </div>
        </div>
    )
}
