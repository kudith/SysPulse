"use client"

import { motion } from "framer-motion"
import { Cpu, HardDrive, MemoryStickIcon as Memory } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TerminalFooterProps {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

export function TerminalFooter({ cpuUsage, memoryUsage, diskUsage }: TerminalFooterProps) {
  // Format date and time
  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <motion.div
      className="mt-2 px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#333] text-xs font-mono"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Cpu size={14} className="text-[#3399ff]" />
            <div className="w-24 md:w-32">
              <Progress
                value={cpuUsage}
                className="h-2 bg-[#333]"
                indicatorClassName={`${
                  cpuUsage > 80 ? "bg-[#ff6f00]" : cpuUsage > 50 ? "bg-[#ffbd2e]" : "bg-[#3399ff]"
                }`}
              />
            </div>
            <span
              className={`${cpuUsage > 80 ? "text-[#ff6f00]" : cpuUsage > 50 ? "text-[#ffbd2e]" : "text-[#3399ff]"}`}
            >
              {cpuUsage.toFixed(1)}%
            </span>
          </motion.div>

          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Memory size={14} className="text-[#00ff99]" />
            <div className="w-24 md:w-32">
              <Progress
                value={memoryUsage}
                className="h-2 bg-[#333]"
                indicatorClassName={`${
                  memoryUsage > 80 ? "bg-[#ff6f00]" : memoryUsage > 50 ? "bg-[#ffbd2e]" : "bg-[#00ff99]"
                }`}
              />
            </div>
            <span
              className={`${
                memoryUsage > 80 ? "text-[#ff6f00]" : memoryUsage > 50 ? "text-[#ffbd2e]" : "text-[#00ff99]"
              }`}
            >
              {memoryUsage.toFixed(1)}%
            </span>
          </motion.div>

          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <HardDrive size={14} className="text-[#ff6f00]" />
            <div className="w-24 md:w-32">
              <Progress
                value={diskUsage}
                className="h-2 bg-[#333]"
                indicatorClassName={`${
                  diskUsage > 80 ? "bg-[#ff6f00]" : diskUsage > 50 ? "bg-[#ffbd2e]" : "bg-[#ff6f00]"
                }`}
              />
            </div>
            <span
              className={`${diskUsage > 80 ? "text-[#ff6f00]" : diskUsage > 50 ? "text-[#ffbd2e]" : "text-[#ff6f00]"}`}
            >
              {diskUsage.toFixed(1)}%
            </span>
          </motion.div>
        </div>

        <motion.div
          className="text-white/70"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
        >
          {formattedDate} | {formattedTime}
        </motion.div>
      </div>
    </motion.div>
  )
}
