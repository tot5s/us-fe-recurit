"use client"

import { useEffect, useState } from "react";

type PagenationProps = {
    totalCount: number;
    perPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}
export default function Pagenation({totalCount, perPage, currentPage, onPageChange}: PagenationProps) {

    const totalPage = Math.ceil(totalCount / perPage);
    const [total, setTotal] = useState<number[]>([])
    const current = currentPage
    
    // useEffect가 로컬에서 두번 호출되는 이슈 발생
    // codex에 그 이유와 방지 할수 있는 방법 제안 요청
    
    useEffect(() => {
        setTotal(Array.from({length: totalPage}, (_, i) => i + 1))
    }, [totalPage])

    return (
        <div className="w-full">
            {totalCount > 0 && (
                <div className="flex items-center justify-center gap-2">
                    {
                        total.map((page, idx) => {
                            return (
                                <button key={`page_${idx}`} onClick={() => {
                                    onPageChange(page)
                                }} className="px-2 py-1 cursor-pointer">{page}</button>
                            )
                        })
                    }
                    <div>
                        
                    </div>
                </div>
            )
            }
        </div>
    )
}