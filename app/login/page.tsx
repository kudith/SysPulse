"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Login failed",
        description: "Please enter both username and password",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md border-terminal-green bg-terminal-dark">
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
              <div className="flex items-center">
                <span className="text-terminal-green mr-2">$</span>
                <Input
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-terminal-green mr-2">$</span>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-terminal-dark hover:bg-terminal-green/20 text-terminal-green border border-terminal-green"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
