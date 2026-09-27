

type DatesProps = {
    title: string;
    date: string;
    placeholder: string;
    onDateHandler: (date:string) => void
}

export default function Dates({title, date, placeholder, onDateHandler} : DatesProps) {
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
                    type="date"
                    onChange={(e) => {
                        onDateHandler(e.target.value)
                    }}
                />
            </div>
        </div>
    )
}