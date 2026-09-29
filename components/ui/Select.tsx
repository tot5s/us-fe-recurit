

type OptionProps = {
    list: {
        title: string,
        val: string
    }[],
    val: string,
    placehorderStr: string
    optOnChange: (val: string) => void
}

export default function Select({list, val, placehorderStr,optOnChange} : OptionProps) {

    return (
        <div>
            <select className="border border-gray-200 p-4 rounded-xl disabled:text-gray-500 first-of-type:text-gray-400" name="" id="" value={val} onChange={(e) => {
                optOnChange(e.target.value)
            }}>
                <option value={''} className="text-gray-400" hidden disabled>
                    {placehorderStr}
                </option>
                {
                    list.map((opt) => (
                        <option key={opt.val} value={opt.val}>
                            {opt.title}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}