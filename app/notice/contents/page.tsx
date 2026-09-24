"use client"

import Border from "@/components/common/Boarder"
import { useState, useEffect } from "react";


export default function Contents() {

    const columns = [
        '번호', '제목', '공개일자', '상태'
    ];

    const [rows, setRows] = useState<object[]>([
        { id: 1, title: '공지사항 제목 1', date: '2023-01-01', status: '공개' },
        { id: 2, title: '공지사항 제목 2', date: '2023-01-02', status: '비공개' },
        { id: 3, title: '공지사항 제목 3', date: '2023-01-03', status: '공개' }
    ]);

    useEffect(() => {
        
    }, [])
    return (
        <div>
            <div>콘텐츠</div>
            <div>
                <Border columns={columns} rows={rows} />
            </div>
        </div>
    )
}