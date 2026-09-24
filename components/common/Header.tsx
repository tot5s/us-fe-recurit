"use client"

import Button from "../ui/Button"

export default function Header () {

    
    const addNote = () => {
        console.log('add note')
    }


    return (
        <div className="h-20">
            <div className="flex items-center justify-between py-4 border-b border-gray-300">
                 <div className="flex items-center gap-4">
                    <div>logo</div>
                    <div>
                        콘텐츠 | 알림
                    </div>
                </div>
                <div>
                    <Button text={'새 글쓰기'} onClick={addNote}/>
                </div>
            </div>
        </div>
    )
}