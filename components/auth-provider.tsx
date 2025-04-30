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
    } else if (status === "authenticated" && session?.user) {
      setUser(session.user)
      setIsLoading(false)
    } else {
      setUser(null)
      setIsLoading(false)
      // Check if we're on a protected route
      const path = window.location.pathname
      if (path !== "/" && path !== "/login" && path !== "/register" && !path.startsWith("/docs")) {
        router.push("/login")
      }
    }
  }, [session, status, router])

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: "/login" })
  }

  return <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
