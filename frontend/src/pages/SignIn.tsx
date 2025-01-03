import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks"


export function SignIn() {
    const auth = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const executeSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const result = await auth.handleSignIn(username, password)
        console.log(result)
        if (result.isSignedIn) {
            navigate({ pathname: "/success" })
        } else {
            alert("login failed")
        }
    }

    return (
        <div>
            {/* <VStack h={500} justify="center"> */}
            <form noValidate onSubmit={executeSignIn}>
                <div>
                    <input
                        type="text"
                        placeholder="UserID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" >
                    Login
                </button>
            </form>
            {/* </VStack> */}
        </div>
    )
}