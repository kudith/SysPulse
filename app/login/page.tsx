"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Terminal, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { signIn, useSession } from "next-auth/react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { status } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(redirectTo)
    }
  }, [status, redirectTo, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Login failed",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Login with NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: redirectTo,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Login successful",
        description: "Redirecting...",
      })

      // Redirect to the requested page or dashboard
      router.push(redirectTo)
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-terminal-green bg-terminal-dark">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Terminal className="h-10 w-10 text-terminal-green" />
            </div>
            <CardTitle className="text-2xl text-center text-terminal-green">Terminal Dashboard</CardTitle>
            <CardDescription className="text-center text-terminal-green/70">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-terminal-green/70 hover:text-terminal-green"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terminal-dark hover:bg-terminal-green/20 text-terminal-green border border-terminal-green"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-terminal-green/70 text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-terminal-green hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
