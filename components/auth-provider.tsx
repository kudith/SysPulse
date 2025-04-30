"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"

interface AuthContextType {
  user: any | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
    } else {
      setUser(session?.user || null)
      setIsLoading(false)
    }
  }, [session, status])

  const signOut = async () => {
    await nextAuthSignOut()
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
