
type CheckboxProps = {
    title: string,
    discription: string,
    list: object[]
}
export default function Checkbox ({title, discription, list} : CheckboxProps) {

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
           <div>
                <label htmlFor="tag-1" className="checked:text-green-400 border rounded-xl px-2 py-1.5 ">
                    <input type="checkbox" className="checked:text-green-600 mr-2" name="tags" id={"tag-1"} />
                    test
                </label>
           </div>
        </div>
    )
}