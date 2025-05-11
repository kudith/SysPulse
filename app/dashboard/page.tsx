"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProcessTable } from "@/components/process-table"
import { ControlPanel } from "@/components/control-panel"
import { ResourceGraph } from "@/components/resource-graph"
import { SSHForm } from "@/components/ssh-form"
import type { Process } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function EnhancedDashboardPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [sshConnected, setSSHConnected] = useState<boolean>(true) // Mocked for now
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshInterval, setRefreshInterval] = useState(30000)
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(Date.now())
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col my-20">
      <Header />

      {/* Global SSH Status */}
      <div className="text-sm text-[#a8aebb] px-4 pt-2 text-right container mx-auto">
        Status SSH: {" "}
        <span className={`font-medium ${sshConnected ? "text-green-400" : "text-red-500"}`}>
          {sshConnected ? "Tersambung" : "Tidak tersambung"}
        </span>
      </div>

      <motion.main
        className="flex-1 container mx-auto p-4 space-y-4 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30 flex justify-between items-center">
                <CardTitle className="text-[#6be5fd] text-lg font-medium">System Resources</CardTitle>
                <span className="text-xs text-[#a8aebb]">Last updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
              </CardHeader>
              <CardContent className="p-4">
                <ResourceGraph key={lastUpdated} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#c792ea] text-lg font-medium">SSH Connection</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <SSHForm />
              </CardContent>
            </Card>

            <Card className="mt-4 border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#3fdaa4] text-base font-medium">Server Info</CardTitle>
              </CardHeader>
              <CardContent className="text-[#a8aebb] text-sm">
                <p>OS: Ubuntu 22.04</p>
                <p>IP: 192.168.1.100</p>
                <p>Uptime: 2 hari 4 jam</p>
              </CardContent>
            </Card>

            <Card className="mt-4 border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#ff79c6] text-base font-medium">Preferensi</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm text-[#a8aebb] mb-1">Auto-refresh</label>
                <Select
                  defaultValue="30000"
                  onValueChange={(val) => setRefreshInterval(Number(val))}
                >
                  <SelectTrigger className="bg-[#161616] border-zinc-700 text-[#d8dee9]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Manual</SelectItem>
                    <SelectItem value="10000">10 detik</SelectItem>
                    <SelectItem value="30000">30 detik</SelectItem>
                    <SelectItem value="60000">1 menit</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden mx-auto max-w-7xl">
            <CardHeader className="pb-2 border-b border-zinc-800/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-[#3fdaa4] text-lg font-medium">Process Management</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Cari proses..."
                  className="bg-[#161616] border border-zinc-700 text-[#d8dee9] w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {selectedProcess && <ControlPanel process={selectedProcess} />}
            </CardHeader>
            <CardContent className="p-4">
              <ProcessTable
                onSelectProcess={setSelectedProcess}
                selectedProcess={selectedProcess}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}