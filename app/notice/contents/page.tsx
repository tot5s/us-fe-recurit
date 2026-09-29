"use client"

import { GetContentsListFn } from "@/app/api/Notice";
import Border from "@/components/common/Border"
import Pagenation from "@/components/ui/pagenation";
import Select from "@/components/ui/Select";

import { useState, useEffect } from "react";


export default function Contents() {

    // pagenation 값
    const [currentPage , setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const [rows, setRows] = useState([
        { id: 1, title: '공지사항 제목 1', date: '2023-01-01', state: '공개' },
        { id: 2, title: '공지사항 제목 2', date: '2023-01-02', state: '비공개' },
        { id: 3, title: '공지사항 제목 3', date: '2023-01-03', state: '공개' }
    ]);

    const status = [
        {title: 'public', val: 'public'},
        {title: 'private', val: 'private'},
    ]
  
    const categorys = [
        {title: '2차 전지', val:'secondaryBattery'},
        {title: '부동산', val: 'realty'},
        {title: '투자기법', val: 'investment'},
        {title: '국내주식', val: 'domesticStock'},
        {title: '경제원론', val: 'economicTheory'},
        {title: '해외주식', val: 'foreignStock'},
        {title: '암호화폐', val: 'cryptoCurrency'},
        {title: '기업분석', val: 'companyAnalysis'},
        {title: '거시경제', val: 'macroEconomics'},
        {title: '재테크', val: 'personalFinance'},
        {title: '안전자산', val: 'safeAsset'}
    ]
    const [ categoryVal, setCategoryVal] = useState('')

    const public_status = [
        {title: '비공개', val: 'draft'},
        {title: '예약', val: 'scheduled'},
        {title: '공개', val: 'published'}
    ]
    const [ statusVal, setStatusVal ] = useState('')

    const getContents = async() => {
        await GetContentsListFn({
            page : currentPage,
            limit: limit,
            status: 'public',
            category: categoryVal,
            publish_status: statusVal
        })
    }
   

    useEffect(() => {
        getContents()
    }, [currentPage, limit, categoryVal, statusVal])


    const statusOnChange = (opt: string) => {
        setStatusVal(opt)
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
                <Select val={categoryVal} list={categorys} optOnChange={(str) => {
                    setCategoryVal(str)
                }} placehorderStr="카테고리"/>
                </div>
                <div>
                    <Select val={statusVal} list={public_status} optOnChange={statusOnChange} placehorderStr="상태"/>
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
                            rows.map((row) => (
                                <tr key={row.id} className="text-center">
                                    <td className="py-4">
                                        {row.id}
                                    </td>
                                    <td className=" py-4 flex items-center justify-between px-4 text-left">
                                        <div>
                                            {row.title}
                                        </div>
                                        <div className="">
                                            <button className="text-gray-500 border border-gray-500 px-2 py-2.5 text-sm rounded-lg">
                                                푸시알림 생성
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4">{row.date}</td>
                                    <td className="py-4">
                                        <div className="badge bg-[#F5FBFA] text-sm text-[#17A48A] rounded-lg">
                                            
                                            {row.state}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Pagenation totalCount={20} perPage={limit} currentPage={currentPage} onPageChange={changePage}/>
            </div>
        </div>
    )
}