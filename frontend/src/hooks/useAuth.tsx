/* eslint-disable react-refresh/only-export-components */
import { fetchAuthSession } from "aws-amplify/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import { Amplify } from "aws-amplify"
import { Hub } from "aws-amplify/utils"
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

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const user = await getCurrentUser()
      const authSession = await fetchAuthSession()
      setUsername(user.username)
      setSession(authSession as AuthSession)
      setIsAuthenticated(true)
    } catch (error) {
      setUsername("")
      setSession(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial auth check
    checkAuthStatus()

    // Listen for auth events from Amplify Hub
    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'tokenRefresh':
          console.log('Auth event: user signed in or token refreshed')
          checkAuthStatus()
          break
        case 'signedOut':
          console.log('Auth event: user signed out')
          setUsername("")
          setSession(null)
          setIsAuthenticated(false)
          setIsLoading(false)
          break
        case 'signInWithRedirect':
          console.log('Auth event: sign in with redirect')
          checkAuthStatus()
          break
      }
    })

    // Cleanup listener on unmount
    return () => {
      hubListener()
    }
  }, [])

  const handleSignIn = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn({ username, password })
      setIsAuthenticated(result.isSignedIn)
      if (result.isSignedIn) {
        const user = await getCurrentUser()
        const authSession = await fetchAuthSession()
        setUsername(user.username)
        setSession(authSession as AuthSession)
      }
      return result
    } finally {
      setIsLoading(false)
    }
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
