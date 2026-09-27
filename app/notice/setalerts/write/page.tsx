"use client"

import Radio from "@/components/ui/Radio";
import Texts from "@/components/ui/Texts";
import Dates from "@/components/ui/Dates";


export default function AddAlert() {
    const list = [
        {title: "전체", val: 'all'},
        {title: "팔로워", val: 'follow'},
        {title: "멤버쉽", val: "memrbership"}
    ]
    return(
        <div className="w-150 mx-auto space-y-4">
            <div>
                <Radio
                    title="대상자"
                    lists={list}
                    onChange={() => {
                        
                    }}
                />
            </div>
            <div>
                <Texts 
                    type={"text"} 
                    title={"제목"} 
                    placeholder={"알람 제목을 입력해 주세요"}
                    onTextHandler={() => {

                    }}
                />
            </div>
            <div>
                <Dates
                    title={"시간"}
                    date={""}
                    placeholder={"알람 발송 시간을 선택해 주세요"}
                    onDateHandler={(date: string) => {
                        
                    }}
                />
            </div>
        </div>
    )
}