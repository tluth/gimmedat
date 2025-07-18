import { fetchAuthSession } from "aws-amplify/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import { Amplify } from "aws-amplify"
import { signIn, signOut, getCurrentUser, SignInOutput } from "aws-amplify/auth"
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { defaultStorage } from 'aws-amplify/utils'
import { AwsConfigAuth } from "@/config/auth"


Amplify.configure(AwsConfigAuth)
cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage)

export interface CognitoTokens {
  accessToken: {
    jwtToken: string
    payload: unknown
    toString(): string
  }
  idToken: {
    jwtToken: string
    payload: unknown
    toString(): string
  }
  refreshToken?: {
    token: string
  }
}

export interface AuthSession {
  tokens: CognitoTokens
  user?: {
    username: string
    attributes: Record<string, unknown>
  }
}

interface UseAuth {
  isLoading: boolean
  isAuthenticated: boolean
  username: string
  session: AuthSession | null
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
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser()
        const authSession = await fetchAuthSession()
        setUsername(user.username)
        setSession(authSession)
        setIsAuthenticated(true)
      } catch (error) {
        setUsername("")
        setSession(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthStatus()
  }, [])

  const handleSignIn = async (username: string, password: string) => {
    const result = await signIn({ username, password })
    setIsAuthenticated(result.isSignedIn)
    if (result.isSignedIn) {
      const user = await getCurrentUser()
      const authSession = await fetchAuthSession()
      setUsername(user.username)
      setSession(authSession)
    }
    return result
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUsername("")
      setSession(null)
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
    session,
    handleSignIn,
    handleSignOut,
  }
}
