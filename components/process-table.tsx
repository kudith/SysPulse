"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Process } from "@/lib/types"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import sshService from "@/lib/ssh-service"
import systemMonitoring from "@/lib/system-monitoring/system-stats"

interface ProcessTableProps {
  onSelectProcess: (process: Process | null) => void
  selectedProcess: Process | null
}

export function ProcessTable({ onSelectProcess, selectedProcess }: ProcessTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [processes, setProcesses] = useState<Process[]>([])
  const [connected, setConnected] = useState(false)

  // Subscribe to system monitoring service to get real-time process data
  useEffect(() => {
    // Check initial connection status
    setConnected(sshService.isSSHConnected())
    
    // Set up event listeners for SSH connection changes
    const handleConnected = () => {
      setConnected(true)
      systemMonitoring.refreshStats() // Fetch data immediately on connection
    }
    
    const handleDisconnected = () => {
      setConnected(false)
      setProcesses([])
    }
    
    sshService.onConnected(handleConnected)
    sshService.onDisconnected(handleDisconnected)
    
    // Subscribe to system monitoring updates
    const unsubscribe = systemMonitoring.subscribe((stats) => {
      setProcesses(stats.processes)
    })
    
    // Get initial data
    if (sshService.isSSHConnected()) {
      const stats = systemMonitoring.getCurrentStats()
      setProcesses(stats.processes)
    }
    
    // Cleanup on unmount
    return () => {
      unsubscribe()
      sshService.onConnected(null)
      sshService.onDisconnected(null)
    }
  }, [])

  const filteredProcesses = processes.filter(
    (process) =>
      process.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.pid.toString().includes(searchTerm),
  )

  // Determine status color based on CPU/Memory usage
  const getStatusColor = (cpu: number, memory: number) => {
    const total = cpu + memory;
    if (total > 150) return "text-[#ec6a88]";
    if (total > 100) return "text-[#fbc3a7]";
    if (total > 50) return "text-[#6be5fd]";
    return "text-[#3fdaa4]";
  };

  // Determine badge color based on user
  const getUserBadgeColor = (user: string) => {
    switch (user.toLowerCase()) {
      case 'root':
        return "bg-[#ec6a88]/10 text-[#ec6a88] border-[#ec6a88]/30";
      case 'admin':
        return "bg-[#fbc3a7]/10 text-[#fbc3a7] border-[#fbc3a7]/30";
      case 'system':
        return "bg-[#6be5fd]/10 text-[#6be5fd] border-[#6be5fd]/30";
      default:
        return "bg-[#3fdaa4]/10 text-[#3fdaa4] border-[#3fdaa4]/30";
    }
  };

  return (
    <div className="space-y-4 relative">
      {!connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]/60 z-10 rounded-lg backdrop-blur-sm">
          <div className="text-[#f8f8f2] text-center p-4">
            <p className="mb-2 text-[#ec6a88]">Not connected to a system</p>
            <p className="text-sm text-[#d8dee9]/70">Connect via SSH to view process information</p>
          </div>
        </div>
      )}
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#6be5fd]" />
        <Input
          placeholder="Search processes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 bg-[#282a36] border-zinc-800/50 text-[#d8dee9] focus-visible:ring-[#6be5fd] focus-visible:border-[#6be5fd]"
          disabled={!connected}
        />
      </div>

      <div className="rounded-md border border-zinc-800/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#282a36]">
            <TableRow className="hover:bg-transparent border-zinc-800/50">
              <TableHead className="text-[#6be5fd] font-medium">PID</TableHead>
              <TableHead className="text-[#6be5fd] font-medium">USER</TableHead>
              <TableHead className="text-[#6be5fd] font-medium">COMMAND</TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-right">CPU%</TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-right">MEM%</TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-center">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!connected ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-[#d8dee9]/50">
                  No SSH connection established
                </TableCell>
              </TableRow>
            ) : filteredProcesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-[#d8dee9]/50">
                  {searchTerm ? "No processes found matching your search" : "No processes found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProcesses.map((process) => (
                <motion.tr
                  key={process.pid}
                  onClick={() => onSelectProcess(process)}
                  className={`cursor-pointer border-zinc-800/50 group ${
                    selectedProcess?.pid === process.pid ? "bg-[#3fdaa4]/5" : "bg-[#1e1e1e]"
                  }`}
                  whileHover={{ backgroundColor: 'rgba(107, 229, 253, 0.05)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TableCell className="text-[#6272a4] font-mono">{process.pid}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getUserBadgeColor(process.user)}>
                      {process.user}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#d8dee9] font-medium">
                    {process.command.length > 50 
                      ? `${process.command.substring(0, 50)}...`
                      : process.command}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${process.cpu > 50 ? "text-[#ec6a88]" : "text-[#3fdaa4]"}`}>
                    {process.cpu.toFixed(1)}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${process.memory > 50 ? "text-[#fbc3a7]" : "text-[#6be5fd]"}`}>
                    {process.memory.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <span className={`h-2 w-2 rounded-full ${
                        getStatusColor(process.cpu, process.memory)
                      } shadow-glow`}></span>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 5px currentColor;
        }
      `}</style>
    </div>
  )
}
