"use client"

import { useState } from "react";


type TextInputBtnProps ={
    title: string;
    onClick: (str: string) => void;
    removeClick: (string: string) => void;
    urlStr: string;
}

export default function TextinputBtn({title, onClick, removeClick, urlStr} : TextInputBtnProps) {

    const [urlText, setUrlText] = useState('')
    const addText = () => {
        onClick(urlText)
    }

    const removeHandler = () => {
        setUrlText('')
        removeClick('')
    }
    return (
        <div className="w-full space-y-2">
            <div>
                <span className="font-bold">
                    {title}
                </span>
            </div>
            <div className="flex items-center gap-2">
                
                <input readOnly={urlStr !== '' } className={urlStr == '' ? "w-full border border-gray-300 rounded-xl p-2" : "w-full border border-gray-300 rounded-xl p-2 bg-gray-100 text-gray-300"} type="text" onChange={(e) => {
                    setUrlText(e.target.value)
                }}/>
                <div className="w-15 text-center bg-[#17A48A] text-white rounded-xl p-2 font-semibold">
                    <button className="" onClick={() => {
                        addText()
                    }}>
                        삽입
                </button>
                </div>
            </div>
           {
            urlStr && (
            <div className="relative">
                <div className="border border-gray-300 bg-gray-100 p-2 rounded-xl">
                    {urlStr}
                </div>
                <div className="absolute top-2 right-5">
                    <button onClick={removeHandler}>x</button>
                </div>
            </div>
            )
           }
        </div>
    )

}