"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProcessTable } from "@/components/process-table"
import { ControlPanel } from "@/components/control-panel"
import { ResourceGraph } from "@/components/resource-graph"
import { SSHForm } from "@/components/ssh-form"
import type { Process } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col">
      <Header />
      <motion.main 
        className="flex-1 container mx-auto p-4 space-y-4 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className="md:col-span-2"
            variants={itemVariants}
          >
            <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#6be5fd] text-lg font-medium">System Resources</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResourceGraph />
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
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
            <CardHeader className="pb-2 border-b border-zinc-800/30 flex flex-row items-center justify-between">
              <CardTitle className="text-[#3fdaa4] text-lg font-medium">Process Management</CardTitle>
              {selectedProcess && <ControlPanel process={selectedProcess} />}
            </CardHeader>
            <CardContent className="p-4">
              <ProcessTable onSelectProcess={setSelectedProcess} selectedProcess={selectedProcess} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}
