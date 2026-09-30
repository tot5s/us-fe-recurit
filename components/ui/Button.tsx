

type ButtonProps = {
    type?: string;
    text: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
};


export default function Button({type, text, onClick, disabled, className}: ButtonProps){

    const defaltStyle = "bg-[#17A48A] text-white rounded-xl px-3 py-2 w-full font-semibold disabled:cursor-not-allowed disabled:opacity-50"

    const lightStyle = "bg-[#F5FBFA] text-[#006E5A] rounded-xl px-3 py-2 w-full font-semibold disabled:cursor-not-allowed disabled:opacity-50"

    return (
        <button onClick={onClick} disabled={disabled} className={
            `${type == 'light' ? lightStyle : defaltStyle} ${className ?? ''}`
        }>
        {text}
        </button>
    )
}
