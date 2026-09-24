
import Header from "@/components/common/Header"
import Modal from "@/components/common/Modal"
import React from "react"



export default function NoticeLayout({children} : {children : React.ReactNode}) {

    return (
        <div className=" px-10">
            <Header/>
            {children}
            <Modal/>
        </div>
    )
}