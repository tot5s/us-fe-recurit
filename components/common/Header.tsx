import Button from "../ui/Button"

export default function Header () {
    const addNote = () => {
        alert("새 글쓰기 버튼 클릭")
    }
    return (
        <div>
            <div>
                <div></div>
                <div></div>
            </div>
            <div>
                <Button text={'새 글쓰기'} onClick={addNote}/>
            </div>
        </div>
    )
}