import { useState } from "react";

type TextsProps = {
    type?: string;
    placeholder?: string;
    title?: string;
    limit?: number;
    val?: string;
    warning?: string;
    warningPosition?: "title" | "below";
    warningBorderClass?: string;
    onTextHandler: (str:string) => void
}

export default function Texts({type, placeholder, title, val, limit, warning, warningPosition = "title", warningBorderClass, onTextHandler}: TextsProps) {

    const [str, setStr] = useState(0)

    return (
        <div className="space-y-3">
           <div>
                <span className="font-bold">
                    {title}
                </span>
                {warning && warningPosition === "title" && <span role="alert" className="ml-2 text-sm text-rose-600">{warning}</span>}
           </div>
            <div className="relative">
                <input 
                    className={`border rounded-xl p-2 w-full placeholder:text-gray-300 ${warning ? warningBorderClass ?? "border-rose-600" : "border-gray-300"}`}
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
                            {val !== undefined ? val.length : str}/{limit}
                        </div>
                    )
                }
            </div>
            {warning && warningPosition === "below" && (
                <p role="alert" className="mt-1 text-sm text-rose-600">{warning}</p>
            )}
        </div>
    )
}
