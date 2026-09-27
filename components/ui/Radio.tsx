

type RadioProps = {
    title: string;
    lists: {
        title: string;
        val: string;
    }[];
    onChange: () => void
}

export default function Radio({title, lists, onChange}: RadioProps) {

    return (
        <div className="space-y-3">
            <div>
                <span className="font-bold">
                    {title}
                </span>
           </div>
           <div className="flex items-center gap-3">
                {
                    lists.map((list,idx) => (
                        <div key={idx} className="">
                            <input type="radio" value={list.val} name="radio" id={`radio-${idx}`} className="mr-2"/>
                            <label htmlFor={`radio-${idx}`}>
                                {list.title}
                            </label>
                        </div>
                    ))
                }
           </div>
        </div>
    )
}