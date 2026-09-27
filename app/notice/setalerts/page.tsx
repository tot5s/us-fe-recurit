"use client"

import Border from "@/components/common/Border";

import { useState } from "react";


export default function SetAlerts() {

    const columns = [
        '번호', '제목', '발송 성공', '발송 실패', '발송 날짜', '공개일자', '상태'
    ]
    
    const [rows, setRows] = useState<object[]>([
        { id: 1, title: '알림설정 제목 1', success: 10, fail: 2, sendDate: '2023-01-01', date: '2023-01-01', state: '발송' },
        { id: 2, title: '알림설정 제목 2', success: 5, fail: 0, sendDate: '2023-01-02', date: '2023-01-02', state: '실패' },
        { id: 3, title: '알림설정 제목 3', success: 8, fail: 1, sendDate: '2023-01-03', date: '2023-01-03', state: '예약' }
    ]);

    
    return (
        <div className="">
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
                            rows.map((row) => (
                                <tr key={row.id} className="text-center">
                                    <td className="py-4">
                                        {row.id}
                                    </td>
                                    <td className=" py-4 flex items-center justify-between px-4 text-left">
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
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
} 