

type RadioProps = {
    title?: string;
    tag: string;
    checked: string;
    disabled?: boolean;
    lists: {
        title: string;
        val: string;
    }[];
    onChange: (val: string) => void
}

export default function Radio({title, tag, disabled, checked, lists, onChange}: RadioProps) {

    return (
        <div className="space-y-3">
            <div>
                <span className="font-bold">
                    {title}
                </span>
           </div>
           <div className="flex items-center gap-3 mb-2">
                {
                    lists.map((list,idx) => (
                        <div key={idx} className="">
                            <input type="radio" value={list.val} name={tag} id={`${list.val}`}
                            className="mr-2"
                            checked={list.val == checked}
                            disabled={disabled}
                            onChange={(e) => {
                                onChange(e.target.value)
                            }}
                            />
                            <label htmlFor={`${list.val}`}>
                                {list.title}
                            </label>
                        </div>
                    ))
                }
           </div>
        </div>
    )
}