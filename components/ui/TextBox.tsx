import { useState } from "react";


type TextBoxProps = {
    
    placeholder?: string;
    title?: string;
    limit?: number
    onTextBoxHandler: (str: string) => void
}

export default function TextBox({placeholder, title, limit, onTextBoxHandler}: TextBoxProps) {

    const [str, setStr] = useState(0)
    return (
        <div className="space-y-3">
           <div>
                <span className="font-bold">
                    {title}
                </span>
           </div>
            <div className="relative">
                <textarea 
                className="border border-gray-300 rounded-xl p-2 w-full placeholder:text-gray-300 resize-none h-20"
                placeholder={placeholder} 
                maxLength={limit}
                onChange={(e) => {
                    setStr(e.target.value.length)
                    onTextBoxHandler(e.target.value)
                }}
                />
                <div className="text-gray-300 absolute bottom-2.5 right-5">
                    {str}/{limit}
                </div>
            </div>
        </div>
    )
}