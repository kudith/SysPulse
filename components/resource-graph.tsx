"use client"

import { useEffect, useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { motion } from "framer-motion"
import sshService from "@/lib/ssh-service"
import systemMonitoring from "@/lib/system-monitoring/system-stats"
import type { ResourceData } from "@/lib/types"

export function ResourceGraph() {
  const [cpuHistory, setCpuHistory] = useState<ResourceData[]>([])
  const [memoryHistory, setMemoryHistory] = useState<ResourceData[]>([])
  const [activeTab, setActiveTab] = useState("cpu")
  const [connected, setConnected] = useState(false)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null)

  // Set up polling and real-time updates for system monitoring
  useEffect(() => {
    // Check initial connection status
    const initialConnected = sshService.isSSHConnected()
    setConnected(initialConnected)
    
    // Start polling immediately if initially connected
    if (initialConnected) {
      fetchInitialData()
      startPolling()
    }
    
    // Set up event listeners for SSH connection changes
    const handleConnected = () => {
      console.log("[ResourceGraph] Connection detected")
      setConnected(true)
      fetchInitialData()
      startPolling()
    }
    
    const handleDisconnected = () => {
      console.log("[ResourceGraph] Disconnection detected")
      setConnected(false)
      stopPolling()
    }
    
    // Fixed type errors by type assertion
    sshService.onConnected(handleConnected as (message: string) => void)
    sshService.onDisconnected(handleDisconnected as (message: string) => void)
    
    // Subscribe to system monitoring updates
    const unsubscribe = systemMonitoring.subscribe((stats) => {
      setCpuHistory(prev => {
        // Check if data is different before updating
        if (prev.length === 0 || stats.cpu.length === 0) return stats.cpu
        if (prev[prev.length - 1]?.value !== stats.cpu[stats.cpu.length - 1]?.value) {
          return stats.cpu
        }
        return prev
      })
      
      setMemoryHistory(prev => {
        // Check if data is different before updating
        if (prev.length === 0 || stats.memory.length === 0) return stats.memory
        if (prev[prev.length - 1]?.value !== stats.memory[stats.memory.length - 1]?.value) {
          return stats.memory
        }
        return prev
      })
    })
    
    // Set up periodic connection checker in case events are missed
    connectionCheckRef.current = setInterval(() => {
      const currentlyConnected = sshService.isSSHConnected()
      
      // If state doesn't match reality, update it
      if (currentlyConnected !== connected) {
        console.log("[ResourceGraph] Connection state mismatch detected, updating:", 
                    { wasConnected: connected, isConnected: currentlyConnected })
        
        setConnected(currentlyConnected)
        
        if (currentlyConnected) {
          fetchInitialData()
          startPolling()
        } else {
          stopPolling()
        }
      }
      
      // Ensure that system monitoring is active if we're supposed to be connected
      if (currentlyConnected) {
        systemMonitoring.ensurePollingActive()
      }
    }, 2000)
    
    // Cleanup on unmount
    return () => {
      unsubscribe()
      sshService.onConnected(null as unknown as (message: string) => void)
      sshService.onDisconnected(null as unknown as (message: string) => void)
      stopPolling()
      
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current)
        connectionCheckRef.current = null
      }
    }
  }, [connected])
  
  // Separate fetch function for initial data
  const fetchInitialData = () => {
    console.log("[ResourceGraph] Fetching initial data")
    systemMonitoring.refreshStats()
    
    // Get current stats (initial data might not be available immediately)
    const stats = systemMonitoring.getCurrentStats()
    if (stats.cpu.length > 0) setCpuHistory(stats.cpu)
    if (stats.memory.length > 0) setMemoryHistory(stats.memory)
  }
  
  // Start polling for updates
  const startPolling = () => {
    // Clear any existing interval first
    stopPolling()
    
    console.log("[ResourceGraph] Starting polling for updates")
    updateIntervalRef.current = setInterval(() => {
      if (sshService.isSSHConnected()) {
        systemMonitoring.refreshStats()
      } else {
        // If somehow we're polling but not connected, stop polling
        stopPolling()
      }
    }, 3000) // Update every 3 seconds
  }
  
  // Stop polling
  const stopPolling = () => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
      updateIntervalRef.current = null
      console.log("[ResourceGraph] Stopped polling")
    }
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#282a36] p-3 border border-zinc-700/30 rounded-md text-[#f8f8f2] shadow-xl">
          <p className="text-[#6be5fd] font-mono text-xs">{`${label}`}</p>
          <p className="text-sm font-medium mt-1">
            <span className={payload[0].name === 'CPU' ? 'text-[#6be5fd]' : 'text-[#c792ea]'}>
              {`${payload[0].name}: `}
            </span>
            <span className={`${Number(payload[0].value) > 70 ? 'text-[#ec6a88]' : Number(payload[0].value) > 50 ? 'text-[#fbc3a7]' : 'text-[#3fdaa4]'}`}>
              {`${Number(payload[0].value).toFixed(1)}%`}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="relative">
      {!connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]/60 z-10 rounded-lg backdrop-blur-sm">
          <div className="text-[#f8f8f2] text-center p-4">
            <p className="mb-2 text-[#ec6a88]">Not connected to a system</p>
            <p className="text-sm text-[#d8dee9]/70">Connect via SSH to view real-time system statistics</p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="cpu" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="bg-[#282a36] border-b border-zinc-800/30 mb-6 w-full flex justify-start">
          <TabsTrigger
            value="cpu"
            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#6be5fd] data-[state=active]:border-b-2 data-[state=active]:border-[#6be5fd] text-[#d8dee9]/70 px-6 py-2 rounded-none transition-all"
          >
            CPU Usage
          </TabsTrigger>
          <TabsTrigger
            value="memory"
            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#c792ea] data-[state=active]:border-b-2 data-[state=active]:border-[#c792ea] text-[#d8dee9]/70 px-6 py-2 rounded-none transition-all"
          >
            Memory Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cpu" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <motion.div 
            className="h-[250px] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2e3b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#4c566a" 
                  tick={{ fill: "#d8dee9", fontSize: 12 }} 
                  axisLine={{ stroke: '#4c566a' }}
                  tickLine={{ stroke: '#4c566a' }}
                />
                <YAxis
                  stroke="#4c566a"
                  tick={{ fill: "#d8dee9", fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={{ stroke: '#4c566a' }}
                  tickLine={{ stroke: '#4c566a' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="CPU"
                  stroke="#6be5fd"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#6be5fd", strokeWidth: 0 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>

        <TabsContent value="memory" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <motion.div 
            className="h-[250px] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoryHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2e3b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#4c566a" 
                  tick={{ fill: "#d8dee9", fontSize: 12 }} 
                  axisLine={{ stroke: '#4c566a' }}
                  tickLine={{ stroke: '#4c566a' }}
                />
                <YAxis
                  stroke="#4c566a"
                  tick={{ fill: "#d8dee9", fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={{ stroke: '#4c566a' }}
                  tickLine={{ stroke: '#4c566a' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Memory"
                  stroke="#c792ea"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#c792ea", strokeWidth: 0 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
