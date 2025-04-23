"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Server, User, Key, Hash } from "lucide-react"

export function SSHForm() {
  const router = useRouter()
  const [host, setHost] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [port, setPort] = useState("22")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!host || !username || !password) {
      toast({
        title: "Connection failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    // Simulate connection attempt with dummy data
    setTimeout(() => {
      setIsConnecting(false)
      toast({
        title: "Connection successful",
        description: `Connected to ${username}@${host}`,
      })

      // Navigate to terminal page
      router.push("/terminal")
    }, 1500)
  }

  return (
    <form onSubmit={handleConnect} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="host" className="text-terminal-green">
          Host
        </Label>
        <div className="relative">
          <Server className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
          <Input
            id="host"
            placeholder="hostname or IP address"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="pl-10 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-terminal-green">
            Username
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="port" className="text-terminal-green">
            Port
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
            <Input
              id="port"
              placeholder="22"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="pl-10 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-terminal-green">
          Password
        </Label>
        <div className="relative">
          <Key className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
          <Input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
          />
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={isConnecting}
          className="w-full bg-terminal-dark hover:bg-terminal-green/20 text-terminal-green border border-terminal-green"
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>
      </motion.div>
    </form>
  )
}
