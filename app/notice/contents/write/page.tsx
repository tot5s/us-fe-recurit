"use client"

import category from '@/public/common/category.json'

import Texts from "@/components/ui/Texts"
import TextBox from "@/components/ui/TextBox"
import TextinputBtn from "@/components/ui/TextinputBtn"
import { useState } from "react"
import Checkbox from "@/components/ui/Checkbox"
import { useNoticeDraft } from "@/app/notice/NoticeDraftContext"


export default function Write() {

    const [urlStr, setUrlStr] = useState('')
    const [urlText, setUrlText] = useState('')

    const categories = category.category

    const [categoryVal, setCategoryVal] = useState<string[]>([])
    const { setDraft } = useNoticeDraft()
    
    return (
        <div className="space-y-4 w-150 mx-auto">
            <div>
                <Checkbox
                    title={"카테고리"}
                    discription={
                        "카테고리를 선택하여 발행할 커뮤니티 글 분야를 선택해 보세요(최대 3개)"
                    }
                    list={categories}
                    categoryVal={categoryVal}
                    onChange={(val) => {
                        const next = categoryVal.includes(val)
                            ? categoryVal.filter((item) => item !== val)
                            : categoryVal.length >= 3
                                ? categoryVal
                                : [...categoryVal, val]
                        setCategoryVal(next)
                        setDraft((draft) => ({
                            ...draft,
                            category: next.map((selected) =>
                                categories.find((item) => item.val === selected)?.val ?? selected
                            ),
                        }))
                    }}
                />

            </div>
            <div className="border-b border-gray-300"></div>
            <div className="space-y-4">
                <div>
                    <Texts title={"제목"} type={"text"} placeholder={"제목을 입력해주세요 (최대 50자)"} limit={50}
                    onTextHandler={(str) => {
                        setDraft((draft) => ({ ...draft, title: str }))
                    }}
                    />
                </div>
                <div>
                    <TextBox 
                        title={"내용"}
                        placeholder={"내용을 입력해주세요 (최대 500자)"}
                        limit={500}
                        onTextBoxHandler={(str) => {
                            setDraft((draft) => ({ ...draft, description: str }))
                        }}
                    />
                </div>
            </div>
            <div className="border-b border-gray-300"></div>
            <div>
                <TextinputBtn 
                    title={'링크'} 
                    urlStr={urlStr}
                    urlText={urlText}
                    onAdd={() => {
                        if (!urlText) return
                        setUrlStr(urlText)
                        setDraft((draft) => ({ ...draft, link: urlText }))
                    }}
                    onRemove={() => {
                        setUrlStr('')
                        setUrlText('')
                        setDraft((draft) => ({ ...draft, link: '' }))
                    }}
                    onUrlChange={(val) => {
                        setUrlText(val)
                    }}
                />
            </div>
        </div>
    )
}
