import { useState } from "react";

type TextsProps = {
    type?: string;
    placeholder?: string;
    title?: string;
    limit?: number;
    val?: string;
    onTextHandler: (str:string) => void
}

export default function Texts({type, placeholder, title, val, limit, onTextHandler}: TextsProps) {

    const [str, setStr] = useState(0)

    return (
        <div className="space-y-3">
           <div>
                <span className="font-bold">
                    {title}
                </span>
           </div>
            <div className="relative">
                <input 
                    className="border border-gray-300 rounded-xl p-2 w-full placeholder:text-gray-300" 
                    type={type} 
                    placeholder={placeholder}
                    value={val}
                    onChange={(e) => {
                        setStr(e.target.value.length)
                        onTextHandler(e.target.value)
                    }}
                />
                {
                    limit && (
                        <div className="text-gray-300 absolute top-2.5 right-5">
                            {str}/{limit}
                        </div>
                    )
                }
            </div>
        </div>
    )
}