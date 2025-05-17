import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

type Props = {
    children?: React.ReactNode
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const { isAuthenticated } = useAuth()
    console.log("yeeeeee")
    console.log(isAuthenticated)
    return isAuthenticated ? <>{children}</> : <Navigate to="/home" />
}

export default PrivateRoute
