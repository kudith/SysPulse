"use client"

import { motion } from "framer-motion"
import { Cpu, HardDrive, MemoryStick, Clock, Activity, Globe } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface TerminalFooterProps {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export function TerminalFooter({ 
  cpuUsage, 
  memoryUsage, 
  diskUsage 
}: TerminalFooterProps) {
  // Format date and time with a live clock
  const [dateTime, setDateTime] = useState({
    formattedDate: '',
    formattedTime: ''
  });
  
  // For ping simulation
  const [ping, setPing] = useState(0);
  
  // Update ping randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 100) + 10);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime({
        formattedDate: now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        formattedTime: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      });
    };
    
    // Update immediately and then every second
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get color based on usage percentage
  const getUsageColor = (percentage: number) => {
    if (percentage > 80) return "text-[#ec6a88]"; // Red pastel
    if (percentage > 60) return "text-[#fbc3a7]"; // Peach
    if (percentage > 40) return "text-[#70e1e8]"; // Teal pastel
    return "text-[#3fdaa4]"; // Mint green
  };

  return (
    <motion.div
      className="mt-2 px-4 py-2 bg-[#0c0c0c] rounded-lg border border-zinc-800/50 text-xs font-mono"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex items-center space-x-3 w-full md:w-auto flex-wrap justify-center md:justify-start">
          {/* CPU Usage */}
          <motion.div 
            className="flex items-center space-x-2 bg-[#1e1e1e] px-2 py-1 rounded-md shadow-sm" 
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              animate={{ 
                rotate: cpuUsage > 70 ? [0, 5, 0, -5, 0] : 0
              }}
              transition={{ repeat: cpuUsage > 70 ? Infinity : 0, duration: 0.3 }}
            >
              <Cpu size={14} className="text-[#6be5fd]" />
            </motion.div>
            <div className="w-20 md:w-24">
              <Progress
                value={cpuUsage}
                className="h-1.5 bg-zinc-800"
                indicatorClassName={`${
                  cpuUsage > 80 ? "bg-[#ec6a88]" : cpuUsage > 50 ? "bg-[#fbc3a7]" : "bg-[#6be5fd]"
                }`}
              />
            </div>
            <span className={getUsageColor(cpuUsage)}>
              {cpuUsage.toFixed(1)}%
            </span>
          </motion.div>

          {/* Memory Usage */}
          <motion.div 
            className="flex items-center space-x-2 bg-[#1e1e1e] px-2 py-1 rounded-md shadow-sm" 
            whileHover={{ scale: 1.05 }}
          >
            <MemoryStick size={14} className="text-[#c792ea]" />
            <div className="w-20 md:w-24">
              <Progress
                value={memoryUsage}
                className="h-1.5 bg-zinc-800"
                indicatorClassName={`${
                  memoryUsage > 80 ? "bg-[#ec6a88]" : memoryUsage > 50 ? "bg-[#fbc3a7]" : "bg-[#c792ea]"
                }`}
              />
            </div>
            <span className={getUsageColor(memoryUsage)}>
              {memoryUsage.toFixed(1)}%
            </span>
          </motion.div>

          {/* Disk Usage */}
          <motion.div 
            className="flex items-center space-x-2 bg-[#1e1e1e] px-2 py-1 rounded-md shadow-sm" 
            whileHover={{ scale: 1.05 }}
          >
            <HardDrive size={14} className="text-[#3fdaa4]" />
            <div className="w-20 md:w-24">
              <Progress
                value={diskUsage}
                className="h-1.5 bg-zinc-800"
                indicatorClassName={`${
                  diskUsage > 80 ? "bg-[#ec6a88]" : diskUsage > 50 ? "bg-[#fbc3a7]" : "bg-[#3fdaa4]"
                }`}
              />
            </div>
            <span className={getUsageColor(diskUsage)}>
              {diskUsage.toFixed(1)}%
            </span>
          </motion.div>
          
          {/* Network Activity */}
          <motion.div 
            className="hidden md:flex items-center space-x-2 bg-[#1e1e1e] px-2 py-1 rounded-md shadow-sm" 
            whileHover={{ scale: 1.05 }}
          >
            <Globe size={14} className="text-[#70e1e8]" />
            <Activity size={14} className="text-[#70e1e8]" />
            <span className="text-[#d8dee9]">{ping}<span className="text-[#6272a4]">ms</span></span>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center space-x-2 bg-[#1e1e1e] px-3 py-1 rounded-md shadow-sm"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
        >
          <Clock size={14} className="text-[#6be5fd]" />
          <span className="text-[#d8dee9]">{dateTime.formattedTime}</span>
          <span className="text-[#4c566a]">|</span>
          <span className="text-[#d8dee9]">{dateTime.formattedDate}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}