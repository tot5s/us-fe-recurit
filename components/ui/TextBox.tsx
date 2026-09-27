

type TextBoxProps = {
    type: string,
    placeholder?: string,
    title?: string,

}

export default function TextBox({type, placeholder, title}: TextBoxProps) {

    return (
        <div>
            <span>
                {title}
            </span>
            <input type={type} placeholder={placeholder}/>
        </div>
    )
}