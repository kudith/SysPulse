"use client"

import { forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { TerminalOutput, TerminalCommand } from "@/lib/terminal-types"

interface TerminalWindowProps {
  history: (TerminalOutput | TerminalCommand)[]
}

export const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(({ history }, ref) => {
  // Function to determine text color based on output type
  const getOutputColor = (outputType: string) => {
    switch (outputType) {
      case "success":
        return "text-[#00ff99]"
      case "error":
        return "text-[#ff6f00]"
      case "info":
        return "text-[#3399ff]"
      case "system":
        return "text-white/70"
      case "welcome":
        return "text-[#00ff99]"
      default:
        return "text-white"
    }
  }

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto p-4 font-mono text-white text-sm"
      style={{ scrollBehavior: "smooth" }}
    >
      <AnimatePresence initial={false}>
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-2"
          >
            {item.type === "command" ? (
              <div className="flex items-start">
                <span className="text-[#00ff99] mr-2">{item.directory === "~" ? "~" : item.directory}$</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-white"
                >
                  {item.content}
                </motion.span>
              </div>
            ) : (
              <motion.div
                className={`pl-4 whitespace-pre-wrap ${getOutputColor(item.outputType)}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {item.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})

TerminalWindow.displayName = "TerminalWindow"
