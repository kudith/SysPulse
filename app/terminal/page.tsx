"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { TerminalHeader } from "@/components/terminal/terminal-header"
import { TerminalWindow } from "@/components/terminal/terminal-window"
import { TerminalPrompt } from "@/components/terminal/terminal-prompt"
import { TerminalFooter } from "@/components/terminal/terminal-footer"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { commands } from "@/lib/terminal-commands"
import type { TerminalOutput, TerminalCommand } from "@/lib/terminal-types"

export default function TerminalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [connected, setConnected] = useState(false)
  const [hostname, setHostname] = useState("server")
  const [username, setUsername] = useState("user")
  const [currentDirectory, setCurrentDirectory] = useState("~")
  const [history, setHistory] = useState<(TerminalOutput | TerminalCommand)[]>([])
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [diskUsage, setDiskUsage] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Simulate connection
  useEffect(() => {
    const connectionSequence = async () => {
      // Add connection messages
      addOutput("Establishing SSH connection to server...", "info")
      await sleep(800)
      addOutput("SSH connection established", "success")
      await sleep(400)
      addOutput("Authenticating...", "info")
      await sleep(600)
      addOutput("Authentication successful", "success")
      await sleep(300)
      addOutput("Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)", "system")
      await sleep(200)
      addOutput("Last login: Wed Apr 23 2025 16:14:03 GMT+0000 (Coordinated Universal Time)", "system")
      await sleep(200)

      // Show welcome message
      addOutput(
        [
          "┌─────────────────────────────────────────────────┐",
          "│                                                 │",
          "│   Welcome to the Modern Terminal Emulator       │",
          "│                                                 │",
          "│   Type 'help' to see available commands         │",
          "│                                                 │",
          "└─────────────────────────────────────────────────┘",
        ].join("\n"),
        "welcome",
      )

      setConnected(true)
    }

    connectionSequence()

    // Start system stats simulation
    const statsInterval = setInterval(() => {
      setCpuUsage(Math.random() * 100)
      setMemoryUsage(Math.random() * 100)
      setDiskUsage(Math.random() * 100)
    }, 2000)

    return () => clearInterval(statsInterval)
  }, [])

  // Auto scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Helper function to add command to history
  const addCommand = (command: string) => {
    setHistory((prev) => [
      ...prev,
      {
        type: "command",
        content: command,
        timestamp: new Date(),
        directory: currentDirectory,
      },
    ])
  }

  // Helper function to add output to history
  const addOutput = (content: string, outputType: "success" | "error" | "info" | "system" | "welcome" = "info") => {
    setHistory((prev) => [
      ...prev,
      {
        type: "output",
        content,
        outputType,
        timestamp: new Date(),
      },
    ])
  }

  // Helper function for sleep
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Handle command execution
  const executeCommand = async (command: string) => {
    if (!command.trim()) return

    // Add command to history
    addCommand(command)

    // Process command
    const parts = command.trim().split(" ")
    const cmd = parts[0]
    const args = parts.slice(1)

    // Wait a bit to simulate processing
    await sleep(300)

    // Handle built-in commands
    if (cmd === "clear") {
      setHistory([])
      return
    }

    if (cmd === "exit") {
      addOutput("Closing SSH connection...", "info")
      await sleep(800)
      addOutput("Connection closed", "success")
      await sleep(500)
      router.push("/dashboard")
      return
    }

    if (cmd === "help") {
      addOutput(
        [
          "Available commands:",
          "  help     - Show this help message",
          "  clear    - Clear the terminal",
          "  ls       - List directory contents",
          "  cd       - Change directory",
          "  cat      - Show file contents",
          "  ps       - Show running processes",
          "  top      - Monitor system processes",
          "  neofetch - Show system information",
          "  exit     - Close SSH connection",
        ].join("\n"),
        "info",
      )
      return
    }

    // Handle other commands from our predefined list
    const commandHandler = commands[cmd]
    if (commandHandler) {
      try {
        const output = await commandHandler(args)
        addOutput(output, "success")
      } catch (error) {
        if (error instanceof Error) {
          addOutput(error.message, "error")
        } else {
          addOutput("An unknown error occurred", "error")
        }
      }
    } else {
      addOutput(`Command not found: ${cmd}. Type 'help' to see available commands.`, "error")
    }
  }

  // Handle disconnect
  const handleDisconnect = async () => {
    toast({
      title: "Disconnecting",
      description: "Closing SSH connection...",
    })

    await sleep(1000)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 space-y-4">
        <motion.div
          className="flex-1 flex flex-col max-w-6xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalHeader
            connected={connected}
            hostname={hostname}
            username={username}
            onDisconnect={handleDisconnect}
          />

          <div className="flex-1 flex flex-col overflow-hidden border border-[#333] rounded-b-lg bg-[#121212]">
            <TerminalWindow history={history} ref={terminalRef} />

            <TerminalPrompt
              connected={connected}
              username={username}
              hostname={hostname}
              currentDirectory={currentDirectory}
              onExecute={executeCommand}
            />
          </div>

          <TerminalFooter cpuUsage={cpuUsage} memoryUsage={memoryUsage} diskUsage={diskUsage} />
        </motion.div>
      </main>
    </div>
  )
}
