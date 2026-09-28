

import { setAuthTokens } from "@/lib/auth"

const fe = "https://fe-assignment-api.us-insight.com"

async function SignUpFn ({email, password}: {email: string, password: string;}) {
     
    const res = await fetch(`${fe}/api/v1/auth/register`, {
        method: 'POST', 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            email: email,
            password: password
        })
    })

    return res
}

async function SignInFn({email, password}: {
    email:string, password: string
}) {

    const res = await fetch(`${fe}/api/v1/auth/login`, {
        method: 'POST',
        headers: {"Content-type" : "application/json"},
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    
    if (res.ok) {
        const payload = await res.json()
        setAuthTokens(payload)
    }

    return res
}


export {
    SignUpFn,
    SignInFn
}
