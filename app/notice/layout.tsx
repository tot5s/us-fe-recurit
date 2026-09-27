"use client"
import Header from "@/components/common/Header"
import Modal from "@/components/common/Modal"
import React from "react"

import { usePathname } from "next/navigation"



export default function NoticeLayout({children} : {children : React.ReactNode}) {

    const pathName = usePathname()
    return (
        <div className="p-4 space-y-4">
            <Header/>
            <div className="mx-auto max-w-300 space-y-4">
                <div className="text-[38px] font-bold ">
                {
                    pathName?.includes('/contents') ? "콘텐츠" : "알람"
                }
                </div>
                {children}
            </div>
            <Modal/>
        </div>
    )
}