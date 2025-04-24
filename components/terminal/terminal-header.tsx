"use client"

import { motion } from "framer-motion"
import { X, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TerminalHeaderProps {
  connected: boolean
  hostname: string
  username: string
  onDisconnect: () => void
}

export function TerminalHeader({ connected, hostname, username, onDisconnect }: TerminalHeaderProps) {
  return (
    <motion.div
      className="flex items-center justify-between px-4 py-2 bg-[#0c0c0c] rounded-t-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex space-x-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#ec6a88] shadow-lg shadow-[#ec6a88]/20"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#fbc3a7] shadow-lg shadow-[#fbc3a7]/20"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#3fdaa4] shadow-lg shadow-[#3fdaa4]/20"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <motion.div
          className="text-[#d8dee9] font-mono text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-[#6be5fd]">{username}</span>
          <span className="text-[#4c566a]">@</span>
          <span className="text-[#c792ea]">{hostname}</span>
          <span className="text-[#4c566a]"> — SSH Terminal</span>
        </motion.div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {connected ? (
            <div className="flex items-center text-[#3fdaa4]">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Wifi size={16} className="mr-2 ml-5" />
              </motion.div>
              <span className="text-xs font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-[#ec6a88]">
              <WifiOff size={16} className="mr-2 ml-5" />
              <span className="text-xs font-medium">Disconnected</span>
            </div>
          )}
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDisconnect}
            className="text-[#d8dee9]/70 hover:text-[#d8dee9] hover:bg-[#ec6a88]/20"
          >
            <X size={18} />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
