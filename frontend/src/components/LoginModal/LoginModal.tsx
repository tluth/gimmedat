import { withAuthenticator, WithAuthenticatorOptions } from "@aws-amplify/ui-react"
import React from "react"

type LoginModalProps = {
  open: boolean
  onClose: () => void
}

// Options for Authenticator
const authenticatorOptions: WithAuthenticatorOptions = {
  hideSignUp: true, // Disable sign-up option
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
          <AuthenticatorWithModal />
        </div>
      </div>
    </div>
  )
}

const AuthenticatorWithModal = withAuthenticator(
  () => <div className="text-center">Welcome! Please sign in.</div>,
  authenticatorOptions
)

export default LoginModal
