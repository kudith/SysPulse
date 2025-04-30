"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={60} // Refresh every minute
      refetchOnWindowFocus={true} // Refresh when window gets focus
    >
      {children}
    </SessionProvider>
  )
} 