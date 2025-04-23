"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface TerminalPromptProps {
  connected: boolean
  username: string
  hostname: string
  currentDirectory: string
  onExecute: (command: string) => void
}

export function TerminalPrompt({ connected, username, hostname, currentDirectory, onExecute }: TerminalPromptProps) {
  const [command, setCommand] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  // Focus input when connected
  useEffect(() => {
    if (connected && inputRef.current) {
      inputRef.current.focus()
    }
  }, [connected])

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    onExecute(command)
    setCommand("")
  }

  // Focus input when clicking anywhere in the terminal
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <motion.div
      className="p-4 border-t border-[#333] bg-[#121212]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      onClick={handleContainerClick}
    >
      <form onSubmit={handleSubmit} className="flex items-center">
        <motion.span
          className="text-[#00ff99] mr-2 font-mono"
          animate={{
            opacity: connected ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        >
          {username}@{hostname}:{currentDirectory}$
        </motion.span>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={!connected}
            className="w-full bg-transparent border-none outline-none text-white font-mono"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Fake cursor */}
          {cursorVisible && command.length === 0 && (
            <motion.span
              className="absolute left-0 top-0 h-full w-2 bg-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
      </form>
    </motion.div>
  )
}
