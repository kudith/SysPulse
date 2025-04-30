import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Providers } from "./providers"
import { Footer } from "./components/footer"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "SysPulse",
  description: "A Linux monitoring dashboard that connects via SSH for real-time monitoring and terminal-inspired views.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono bg-[#0c0c0c] text-terminal-green`}>
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
