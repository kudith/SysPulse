"use client"

import { useRouter } from "next/navigation"
import { Terminal, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function Header() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "Redirecting to login page...",
    })
    router.push("/login")
  }

  return (
    <header className="border-b border-terminal-green/30 bg-terminal-dark">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-terminal-green" />
          <h1 className="text-terminal-green text-xl font-bold">Linux Terminal Dashboard</h1>
        </div>

        <div className="flex items-center">
          <span className="text-terminal-green/70 mr-4">user@system:~$</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-green"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
