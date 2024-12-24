import { Amplify } from "aws-amplify"

import { signIn, signOut, getCurrentUser, SignInOutput } from "aws-amplify/auth";

import React, { createContext, useContext, useEffect, useState } from "react"
import { AwsConfigAuth } from "@/config/auth"

Amplify.configure(AwsConfigAuth)

interface UseAuth {
  isLoading: boolean
  isAuthenticated: boolean
  username: string
  handleSignIn: (username: string, password: string) => Promise<SignInOutput>
  handleSignOut: () => void
}

type Props = {
  children?: React.ReactNode
}

const authContext = createContext({} as UseAuth)

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

const useProvideAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    getCurrentUser()
      .then((result) => {
        setUsername(result.username)
        setIsAuthenticated(true)
        setIsLoading(false)
      })
      .catch(() => {
        setUsername("")
        setIsAuthenticated(false)
        setIsLoading(false)
      })
  }, [])

  const handleSignIn = async (username: string, password: string) => {
    const result = await signIn({ username, password })
    // setUsername(result.userId)
    setIsAuthenticated(result.isSignedIn)
    return result
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUsername("")
      setIsAuthenticated(false)
      return { success: true, message: "" }
    } catch (error) {
      return {
        success: false,
        message: "LOGOUT FAIL",
      }
    }
  }

  return {
    isLoading,
    isAuthenticated,
    username,
    handleSignIn,
    handleSignOut,
  }
}
