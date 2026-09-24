

type ButtonProps = {
    text: string;
    onClick: () => void;
    disabled?: boolean;
};


export default function Button({text, onClick, disabled}: ButtonProps){

    return (
        <button onClick={onClick} disabled={disabled} className="bg-green-600 text-white rounded-2xl">
        {text}
        </button>
    )
}