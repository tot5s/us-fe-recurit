"use client"

import Link from "next/link"
import Button from "../ui/Button"

export default function Header () {

    
    const addNote = () => {
        console.log('add note')
    }


    const goUrl = (str:string) => {

    }

    return (
        <div className="h-20">
            <div className="flex items-center justify-between py-4 border-b border-gray-300">
                 <div className="flex items-center gap-4">
                    <div >us</div>
                    <div>
                        <button onClick={() => {
                            goUrl('contents')
                        }}
                        className="bg-gray-100 py-2.5 px-4 rounded-2xl font-extrabold"
                        >콘텐츠</button>
                        <Link href="/notice/setalerts"
                        className="text-gray-400 py-2.5 px-4 rounded-2xl font-extrabold"
                        >알람</Link>
                    </div>
                </div>
                <div>
                    <Button text={'새 글쓰기'} onClick={addNote}/>
                </div>
            </div>
        </div>
    )
}