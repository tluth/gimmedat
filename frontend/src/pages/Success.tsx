import { useEffect } from "react"
import { fetcher } from "@/services"
import PrivateRoute from "@/components/PrivateRoute"
import { useAuth } from "@/hooks"

export function SuccessPage() {
    const auth = useAuth()

    if (auth.isLoading) {
        return <div />
    }

    // useEffect( ()=>{
    //   fetcher(
    //     "testo",
    //     "GET"      )
    // }, [])

    return (
        <PrivateRoute>
            <div>
                <text >Welcome {auth.username}!!</text>
                <text >Login Succeed🎉</text>
                <button
                    onClick={() => auth.handleSignOut()}
                >
                    Log out
                </button>
            </div>
        </PrivateRoute>
    )
}
