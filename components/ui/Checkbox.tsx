
type CheckboxProps = {
    title: string,
    discription: string,
    list: {
        title: string;
        val: string;
    }[],
    categoryVal: string[];
    onChange: (list: string) => void
}
export default function Checkbox ({title, discription, list, categoryVal, onChange} : CheckboxProps) {

    return (
        <div className="space-y-3">
            <div>
                <div>
                    <span className="font-bold">
                        {title}
                    </span>
                </div>
                <div className="text-gray-500">
                    {discription}
                </div>
            </div>
           <div className="flex items-center gap-2 flex-wrap">
               {list.map((list) => (
                    <label key={list.val} className="border border-gray-300 px-2 rounded-xl ">
                    <input
                        type="checkbox"
                        name="tags"
                        value={list.val}
                        checked={categoryVal.includes(list.val)}
                        disabled={
                        categoryVal.length >= 3 &&
                        !categoryVal.includes(list.val)
                        }
                        onChange={() => onChange(list.val)}
                        className="mr-2"
                    />
                    {list.title}
                    </label>
                ))}
           </div>
        </div>
    )
}