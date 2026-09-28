"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import Texts from "@/components/ui/Texts"

import { SignInFn } from "../api/Admin"


export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [signInError, setSigninError] = useState(false)

    const signInHandler = async () => {
        await SignInFn({email, password}).then((res) => {
            if(res.status == 200) {
                location.href="/notice/contents"
            } else if (res.status == 400) {
                setSigninError(true)
            } else {
                setSigninError(true)
            }
        })  
    }

    return(
        <div className="space-y-4">
            <div>
                <Texts type={'text'} title={'이메일'} placeholder={'이메일을 입력해 주세요'} onTextHandler={(str) => {
                    setEmail(str)
                }}/>
            </div>
            <div>
                 <Texts type={'password'} title={'비밀번호'} placeholder={'비밀번호를 입력해 주세요'} onTextHandler={(str) => {
                    setPassword(str)
                 }}/>
            </div>
            {
                signInError && (
                    <div className="text-rose-600">
                        이메일 혹은 비밀번호를 잘못 입력 하였습니다.
                    </div>
                )
            }

            <div className="py-6">
                <Button text={'로그인'} onClick={signInHandler}/>
            </div>
        </div>
    )
}
