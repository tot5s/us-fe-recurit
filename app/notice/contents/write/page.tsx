"use client"


import Texts from "@/components/ui/Texts"
import TextBox from "@/components/ui/TextBox"
import TextinputBtn from "@/components/ui/TextinputBtn"
import { useEffect, useState } from "react"
import Checkbox from "@/components/ui/Checkbox"


export default function Write() {

    const [urlStr, setUrlStr] = useState('')

    
    
    return (
        <div className="space-y-4 w-150 mx-auto">
            <div>
                <Checkbox
                    title={"카테고리"}
                    discription={
                        "카테고리를 선택하여 발행할 커뮤니티 글 분야를 선택해 보세요(최대 3개)"
                    }
                    list={[
                        {id: 1, title: '선택'}
                    ]}
                />
            </div>
            <div className="border-b border-gray-300"></div>
            <div className="space-y-4">
                <div>
                    <Texts title={"제목"} type={"text"} placeholder={"제목을 입력해주세요 (최대 50자)"} limit={50}
                    onTextHandler={(str) => {

                    }}
                    />
                </div>
                <div>
                    <TextBox 
                        title={"내용"}
                        placeholder={"내용을 입력해주세요 (최대 500자)"}
                        limit={500}
                        onTextBoxHandler={(str) => {

                        }}
                    />
                </div>
            </div>
            <div className="border-b border-gray-300"></div>
            <div>
                <TextinputBtn 
                    title={'링크'} 
                    urlStr={urlStr}
                    onClick={(url:string) => {
                        setUrlStr(url)
                    }} 
                    removeClick={(url: string) => {
                        setUrlStr('')
                    }}
                />
            </div>
        </div>
    )
}