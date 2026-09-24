"use client"

import Border from "@/components/common/Border";

import { useState } from "react";


export default function SetAlerts() {

    const columns = [
        '번호', '제목', '발송 성공', '발송 실패', '발송 날짜', '공개일자', '상태'
    ]
    
    const [rows, setRows] = useState<object[]>([
        { id: 1, title: '알림설정 제목 1', success: 10, fail: 2, sendDate: '2023-01-01', date: '2023-01-01', status: '공개' },
        { id: 2, title: '알림설정 제목 2', success: 5, fail: 0, sendDate: '2023-01-02', date: '2023-01-02', status: '비공개' },
        { id: 3, title: '알림설정 제목 3', success: 8, fail: 1, sendDate: '2023-01-03', date: '2023-01-03', status: '공개' }
    ]);

    
    return (
        <div>
            <div>알림설정</div>
            <div>
                <Border columns={columns} rows={rows} />
            </div>
        </div>
    )
} 