
type TextsProps = {
    type: string,
    placeholder: string,
    title: string
}

export default function Texts({type, placeholder, title}: TextsProps) {

    return (
        <div className="space-y-3">
           <div>
                <span className="font-bold">
                    {title}
                </span>
           </div>
            <div>
                <input className="border border-gray-300 rounded-xl p-2 w-full placeholder:text-gray-300" type={type} placeholder={placeholder}/>
            </div>
        </div>
    )
}