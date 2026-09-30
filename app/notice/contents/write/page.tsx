"use client"

import category from '@/public/common/category.json'

import Texts from "@/components/ui/Texts"
import TextBox from "@/components/ui/TextBox"
import TextinputBtn from "@/components/ui/TextinputBtn"
import { useEffect, useState } from "react"
import Checkbox from "@/components/ui/Checkbox"
import Modal from "@/components/common/Modal"
import { NOTICE_CONTENT_DRAFT_KEY, type StoredNoticeDraft, useNoticeDraft } from "@/app/notice/NoticeDraftContext"
import { GetContentsDetailFn } from "@/app/api/Notice"

const categories = category.category

export default function Write() {

    const [urlStr, setUrlStr] = useState('')
    const [urlText, setUrlText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState('')
    const [isNewContentPage, setIsNewContentPage] = useState(false)
    const [isDraftChoiceResolved, setIsDraftChoiceResolved] = useState(false)
    const [isDraftChoiceOpen, setIsDraftChoiceOpen] = useState(false)
    const [storedDraft, setStoredDraft] = useState<StoredNoticeDraft | null>(null)

    const [categoryVal, setCategoryVal] = useState<string[]>([])
    const { draft, setDraft, setEditingContentId, saveContentDraft, clearContentDraft } = useNoticeDraft()

    const startNewDraft = () => {
        clearContentDraft()
        setDraft({ category: [], title: '', description: '', link: '' })
        setCategoryVal([])
        setUrlStr('')
        setUrlText('')
        setIsDraftChoiceOpen(false)
        setIsDraftChoiceResolved(true)
    }

    const restoreSavedDraft = () => {
        if (!storedDraft) return
        const restoredDraft = {
            category: storedDraft.draft.category.filter((value) => categories.some((item) => item.val === value)),
            title: storedDraft.draft.title,
            description: storedDraft.draft.description,
            link: storedDraft.draft.link,
        }
        setDraft(restoredDraft)
        setCategoryVal(restoredDraft.category)
        setUrlStr(restoredDraft.link)
        setUrlText('')
        setIsDraftChoiceOpen(false)
        setIsDraftChoiceResolved(true)
    }

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id')
        const emptyDraft = { category: [], title: '', description: '', link: '' }

        setDraft(emptyDraft)
        setEditingContentId(0)
        setCategoryVal([])
        setUrlStr('')
        setUrlText('')
        setLoadError('')
        setStoredDraft(null)
        setIsDraftChoiceOpen(false)

        if (!id) {
            setIsNewContentPage(true)
            setIsDraftChoiceResolved(false)
            try {
                const savedValue = window.localStorage.getItem(NOTICE_CONTENT_DRAFT_KEY)
                const parsed = savedValue ? JSON.parse(savedValue) as StoredNoticeDraft : null
                const saved = parsed?.draft
                if (
                    saved &&
                    Array.isArray(saved.category) &&
                    typeof saved.title === 'string' &&
                    typeof saved.description === 'string' &&
                    typeof saved.link === 'string'
                ) {
                    setStoredDraft(parsed)
                    setIsDraftChoiceOpen(true)
                } else {
                    window.localStorage.removeItem(NOTICE_CONTENT_DRAFT_KEY)
                    setIsDraftChoiceResolved(true)
                }
            } catch {
                window.localStorage.removeItem(NOTICE_CONTENT_DRAFT_KEY)
                setIsDraftChoiceResolved(true)
            }
            return
        }

        setIsNewContentPage(false)
        setIsDraftChoiceResolved(true)

        let isActive = true
        setIsLoading(true)

        GetContentsDetailFn({ id })
            .then((result) => {
                const responseData = result?.data ?? result
                const content = responseData?.content
                    ?? (Array.isArray(responseData?.contents)
                        ? responseData.contents.find((item: { id?: number | string }) => String(item.id) === id)
                        : null)
                    ?? responseData

                if (!content || content.id === undefined) {
                    throw new Error('해당 콘텐츠를 찾을 수 없습니다.')
                }

                const rawCategories = content.categories ?? content.category ?? []
                const contentCategories = (Array.isArray(rawCategories)
                    ? rawCategories
                    : String(rawCategories).split(','))
                    .map((item: unknown) => {
                        if (typeof item === 'string') return item
                        if (item && typeof item === 'object' && 'val' in item) return String(item.val)
                        return ''
                    })
                    .filter((value: string) => categories.some((item) => item.val === value))
                const contentTitle = String(content.title ?? '')
                const contentBody = String(content.body ?? content.description ?? '')
                const contentLink = String(content.link_url ?? content.link ?? '')

                if (!isActive) return
                setCategoryVal(contentCategories)
                setUrlStr(contentLink)
                setDraft({
                    category: contentCategories,
                    title: contentTitle,
                    description: contentBody,
                    link: contentLink,
                })
                setEditingContentId(
                    Number(id),
                    String(content.status ?? content.content_status ?? "")
                )
            })
            .catch((error) => {
                if (isActive) {
                    setLoadError(error instanceof Error ? error.message : '콘텐츠를 불러오지 못했습니다.')
                }
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [categories, setDraft, setEditingContentId])

    useEffect(() => {
        if (!isNewContentPage || !isDraftChoiceResolved) return
        const intervalId = window.setInterval(saveContentDraft, 30 * 60 * 1000)
        return () => window.clearInterval(intervalId)
    }, [isNewContentPage, isDraftChoiceResolved, saveContentDraft])
    
    return (
        <div className="space-y-4 w-150 mx-auto">
            <Modal
                isOpen={isDraftChoiceOpen}
                onClose={startNewDraft}
                ariaLabel="임시 저장 글 선택"
                width={400}
            >
                <div>
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <h2 className="text-lg font-semibold">새글 쓰기</h2>
                        <button
                            type="button"
                            onClick={startNewDraft}
                            aria-label="닫기"
                            className="text-xl leading-none text-gray-500"
                        >
                            ×
                        </button>
                    </div>
                    <div className="px-5">
                        <button
                            type="button"
                            onClick={restoreSavedDraft}
                            className="flex w-full items-center gap-3 border-b border-gray-200 py-5 text-left hover:bg-gray-50"
                        >
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-gray-600" fill="none">
                                <path d="m12 3 7.5 7.5L12 21l-7.5-10.5L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                                <path d="M12 3v11m-3-3 3 3 3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="16.5" r="1" fill="currentColor" />
                            </svg>
                            <span>
                                <span className="block font-semibold">임시 저장된 콘텐츠 이어서 쓰기</span>
                                <span className="mt-1 block text-sm text-gray-500">마지막으로 저장한 내용을 불러와 계속 작성합니다.</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={startNewDraft}
                            className="flex w-full items-center gap-3 py-5 text-left hover:bg-gray-50"
                        >
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" fill="none">
                                <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3 2v-5.1a7.5 7.5 0 1 1 16-4.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>
                                <span className="block font-semibold">콘텐츠 쓰기</span>
                                <span className="mt-1 block text-sm text-gray-500">커뮤니티, 소통이 가능한 기본 포스트</span>
                            </span>
                        </button>
                    </div>
                </div>
            </Modal>
            {isLoading && <p role="status" className="text-sm text-gray-500">콘텐츠를 불러오는 중...</p>}
            {loadError && <p role="alert" className="text-sm text-rose-600">{loadError}</p>}
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
                    val={draft.title}
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
                        val={draft.description}
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
