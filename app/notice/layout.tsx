
import Header from "@/components/common/Header"
import Modal from "@/components/common/Modal"
import React from "react"



export default function NoticeLayout({children} : {children : React.ReactNode}) {

    return (
        <div className=" px-10 space-y-4">
            <Header/>
            <div className="text-[38px] font-bold ">
              콘텐츠
            </div>
            {children}
            <Modal/>
        </div>
    )
}