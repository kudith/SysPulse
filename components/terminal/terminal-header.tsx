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
      className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] rounded-t-lg border-t border-l border-r border-[#333]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex space-x-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#ff6057]"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#ffbd2e]"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#27c93f]"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <motion.div
          className="text-white/80 font-mono text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {username}@{hostname} — SSH Terminal
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
            <div className="flex items-center text-[#00ff99]">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Wifi size={16} className="mr-2" />
              </motion.div>
              <span className="text-xs">Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-[#ff6f00]">
              <WifiOff size={16} className="mr-2" />
              <span className="text-xs">Disconnected</span>
            </div>
          )}
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDisconnect}
            className="text-white/70 hover:text-white hover:bg-red-500/20"
          >
            <X size={18} />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
