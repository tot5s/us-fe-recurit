"use client"


import category from '@/public/common/category.json'
import { GetContentsListFn } from "@/app/api/Notice";
import Pagenation from "@/components/ui/pagenation";
import Select from "@/components/ui/Select";
import { useRouter } from 'next/navigation';

import { useState, useEffect } from "react";
import dayjs from 'dayjs';

const categoryOptions = category.category
const publicStatusOptions = [
    {title: '비공개', val: 'draft'},
    {title: '예약', val: 'scheduled'},
    {title: '공개', val: 'published'}
]

export default function Contents() {

    // pagenation 값
    const [currentPage , setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)

    const router = useRouter()

    const [ categoryVal, setCategoryVal] = useState('')
    const [ statusVal, setStatusVal ] = useState('')
    const [isQueryInitialized, setIsQueryInitialized] = useState(false)

    const [rows, setRows] = useState([])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const pageParam = Number(params.get('page'))
        const categoryParam = params.get('category') ?? ''
        const statusParam = params.get('status') ?? ''

        setCurrentPage(Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1)
        setCategoryVal(categoryOptions.some((item) => item.val === categoryParam) ? categoryParam : '')
        setStatusVal(publicStatusOptions.some((item) => item.val === statusParam) ? statusParam : '')
        setIsQueryInitialized(true)
    }, [])

    useEffect(() => {
        if (!isQueryInitialized) return

        const params = new URLSearchParams(window.location.search)
        params.set('page', String(currentPage))
        if (categoryVal) params.set('category', categoryVal)
        else params.delete('category')
        if (statusVal) params.set('status', statusVal)
        else params.delete('status')

        const query = params.toString()
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
        window.history.replaceState(null, '', nextUrl)
    }, [isQueryInitialized, currentPage, categoryVal, statusVal])

    useEffect(() => {
        if (!isQueryInitialized) return

        GetContentsListFn({
            page: currentPage,
            limit,
            category: categoryVal,
            publish_status: statusVal,
        }).then((res) => {
            setTotal(res.data.total)
            setRows(res.data.contents)
        })
    }, [isQueryInitialized, currentPage, limit, categoryVal, statusVal])

    const statusOnChange = (opt: string) => {
        setStatusVal(opt)
        setCurrentPage(1)
    }


    const changePage = (page: number) => {
        setCurrentPage(page)
    }
    
    return (
        <div>
            
            <div className="text-[38px] font-bold ">
                콘텐츠
            </div>
            <div className="flex items-center justify-end gap-2">
                <div>
                <Select val={categoryVal} list={categoryOptions} optOnChange={(str) => {
                    setCategoryVal(str)
                    setCurrentPage(1)
                }} placehorderStr="카테고리"/>
                </div>
                <div>
                    <Select val={statusVal} list={publicStatusOptions} optOnChange={statusOnChange} placehorderStr="상태"/>
                </div>
            </div>
            <div className="py-4">
                <table className="w-full">
                    <thead className="text-gray-500 border-b border-gray-300 text-center">
                        <tr className="text-sm">
                            <th className="py-2">번호</th>
                            <th className="py-2 w-[80%] text-center">제목</th>
                            <th className="py-2">공개일자</th>
                            <th className="py-2">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.length > 0 ? (
                                rows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    tabIndex={0}
                                    aria-label={`${row.title} 수정 화면 열기`}
                                    onClick={() => router.push(`/notice/contents/write?id=${encodeURIComponent(String(row.id))}`)}
                                    onKeyDown={(event) => {
                                        if (event.target !== event.currentTarget) return
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            router.push(`/notice/contents/write?id=${encodeURIComponent(String(row.id))}`)
                                        }
                                    }}
                                    className="text-center cursor-pointer hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#17A48A]"
                                >
                                    <td className="py-4">
                                        {row?.id}
                                    </td>
                                    <td className=" py-4 flex items-center justify-between px-4 text-left">
                                        <div>
                                            {row?.title}
                                        </div>
                                        {
                                            !row?.notification_status?.has_notification && row.status == 'private' && (
                                             <div className="">
                                                <button onClick={(event) => {
                                                    event.stopPropagation()
                                                    router.push(`/notice/setalerts/write?content_id=${encodeURIComponent(String(row.id))}`)
                                                }} className="text-gray-500 border border-gray-500 px-2 py-2.5 text-sm rounded-lg">
                                                    푸시알림 생성
                                                </button>
                                            </div>
                                            )
                                         }
                                    </td>
                                    <td className="py-4 w-[5%]">{dayjs(row?.created_at).format('YY.MM.DD HH:mm')}</td>
                                    <td className="py-4">
                                        <div className="badge bg-[#F5FBFA] text-sm text-[#17A48A] rounded-lg">
                                            
                                            {
                                                row?.status == 'private' ? '비공개' : '공개'
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='text-center py-4 text-gray-500'>
                                        생성된 콘텐츠가 없습니다.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <Pagenation totalCount={total} perPage={limit} currentPage={currentPage} onPageChange={changePage}/>
            </div>
        </div>
    )
}
