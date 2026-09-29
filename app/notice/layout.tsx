"use client"
import Header from "@/components/common/Header"
import React from "react"
import { NoticeDraftProvider } from "@/app/notice/NoticeDraftContext"

export default function NoticeLayout({children} : {children : React.ReactNode}) {

    return (
        <NoticeDraftProvider>
            <div className="p-4 space-y-4">
                <Header/>
                <div className="mx-auto max-w-300 space-y-4">
                    {children}
                </div>
            </div>
        </NoticeDraftProvider>
    )
}
