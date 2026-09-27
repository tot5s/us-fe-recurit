"use client"

import { usePathname } from "next/navigation"
import Button from "../ui/Button"

export default function Header () {

    const pathName = usePathname()
    
    const addNote = () => {
        console.log('add note')
    }


    const goUrl = (str:string) => {
        if(str == 'contents') {
            location.href = '/notice/contents'
        } else if(str == 'alerts') {
            location.href = '/notice/setalerts'
        }
    }

    return (
        <div className="h-20 border-b border-gray-300">
            <div className="flex items-center justify-between py-4  max-w-300 mx-auto">
                 <div className="flex items-center gap-4 space-x-4">
                    <div className="px-1 border rounded-lg text-sm text-[#17A48A]">us</div>
                    <div>
                        <button onClick={() => {
                            goUrl('contents')
                        }}
                        className={
                            pathName.includes('/contents') ? 'bg-gray-100  py-2.5 px-4 rounded-2xl font-extrabold' : 'text-gray-400  py-2.5 px-4 rounded-2xl font-extrabold'
                        }
                        >콘텐츠</button>
                        <button onClick={() => {
                            goUrl('alerts')
                        }}
                        className={
                            pathName.includes('/setalerts') ? "bg-gray-100  py-2.5 px-4 rounded-2xl font-extrabold" : "text-gray-400 py-2.5 px-4 rounded-2xl font-extrabold"
                        }
                        >알람</button>
                    </div>
                </div>
                <div>
                    <Button text={'새 글쓰기'} onClick={addNote}/>
                </div>
            </div>
        </div>
    )
}