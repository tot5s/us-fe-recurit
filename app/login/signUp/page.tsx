"use client"

import Texts from "@/components/ui/Texts"
import Button from "@/components/ui/Button"

import { SignUpFn } from "@/app/api/Admin"
import { useState } from "react"


export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    // const [emailError, setEmailError] = useState('')
    // const [pwError, setPwError] = useState('')

    const signUpHandler = async () => {
      await SignUpFn({email, password}).then((res) => {
        if(res.status == 201) {
            alert('회원 가입 완료')
            
            
        } else if (res.status == 400) {
            alert('이메일 혹은 패스워드가 잘못 입력 되었습니다. 확인해주세요.')
        } else{
            alert('이미 가입이 된 이메일입니다.')
        }
    })
    }
    return (
         <div className="space-y-4">
                    <div>
                        <Texts type={'text'} title={'이메일'} placeholder={'이메일을 입력해 주세요'} onTextHandler={
                            (str: string) => {
                                setEmail(str)
                            }
                        }/>
                    </div>
                    <div>
                         <Texts type={'password'} title={'비밀번호'} placeholder={'비밀번호를 입력해 주세요'} onTextHandler={(str: string) => {
                            setPassword(str)
                         }}/>
                    </div>
                    <div className="py-6">
                        <Button text={'회원가입'} onClick={signUpHandler}/>
                    </div>
                </div>
    )
}