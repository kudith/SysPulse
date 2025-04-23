"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProcessTable } from "@/components/process-table"
import { ControlPanel } from "@/components/control-panel"
import { ResourceGraph } from "@/components/resource-graph"
import { SSHForm } from "@/components/ssh-form"
import type { Process } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 border-terminal-green/30 bg-terminal-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-terminal-green text-lg">System Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceGraph />
            </CardContent>
          </Card>

          <Card className="border-terminal-green/30 bg-terminal-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-terminal-green text-lg">SSH Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <SSHForm />
            </CardContent>
          </Card>
        </div>

        <Card className="border-terminal-green/30 bg-terminal-dark">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-terminal-green text-lg">Process Management</CardTitle>
            {selectedProcess && <ControlPanel process={selectedProcess} />}
          </CardHeader>
          <CardContent>
            <ProcessTable onSelectProcess={setSelectedProcess} selectedProcess={selectedProcess} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
