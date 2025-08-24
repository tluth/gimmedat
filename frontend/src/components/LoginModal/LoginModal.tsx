import React from "react"
import { Authenticator } from "@aws-amplify/ui-react"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { useNavigate } from "react-router-dom"

type LoginModalProps = {
  open: boolean
  onClose: () => void
}

const AuthSuccessHandler: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { route } = useAuthenticator((context) => [context.route])
  const navigate = useNavigate()

  React.useEffect(() => {
    if (route === "authenticated") {
      onClose()
      navigate("/dashboard") // Change to your protected route
    }
  }, [route, onClose, navigate])

  return null
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-night bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-offWhite w-[400px] lg:w-[500px] rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-main-700 hover:text-main-600 text-xl font-bold"
        >
          ✕
        </button>
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-main-900 text-center mb-4">
            Welcome Back
          </h2>
          <p className="text-asparagus-600 text-center mb-6">
            Please sign in to continue
          </p>
          <div className="border-t border-main-200 mb-6"></div>
          <Authenticator
            className="mb-6"
            hideSignUp={true}
            components={{
              Header: () => null,
              Footer: () => null,
            }}
          >
            <AuthSuccessHandler onClose={onClose} />
          </Authenticator>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
