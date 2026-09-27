"use client"

import Texts from "@/components/ui/Texts"
import Button from "@/components/ui/Button"


export default function SignUp() {

    const signUpHandler = () => {
        
    }
    return (
         <div className="space-y-4">
                    <div>
                        <Texts type={'text'} title={'이메일'} placeholder={'이메일을 입력해 주세요'}/>
                    </div>
                    <div>
                         <Texts type={'password'} title={'비밀번호'} placeholder={'비밀번호를 입력해 주세요'}/>
                    </div>
                    <div className="py-6">
                        <Button text={'회원가입'} onClick={signUpHandler}/>
                    </div>
                </div>
    )
}