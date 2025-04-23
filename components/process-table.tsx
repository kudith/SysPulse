"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { processes } from "@/lib/data"
import type { Process } from "@/lib/types"

interface ProcessTableProps {
  onSelectProcess: (process: Process | null) => void
  selectedProcess: Process | null
}

export function ProcessTable({ onSelectProcess, selectedProcess }: ProcessTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProcesses = processes.filter(
    (process) =>
      process.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.pid.toString().includes(searchTerm),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-terminal-green/70" />
        <Input
          placeholder="Search processes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 bg-black border-terminal-green/30 text-terminal-green focus-visible:ring-terminal-green"
        />
      </div>

      <div className="rounded-md border border-terminal-green/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-terminal-dark">
            <TableRow className="hover:bg-transparent border-terminal-green/30">
              <TableHead className="text-terminal-green">PID</TableHead>
              <TableHead className="text-terminal-green">USER</TableHead>
              <TableHead className="text-terminal-green">COMMAND</TableHead>
              <TableHead className="text-terminal-green text-right">CPU%</TableHead>
              <TableHead className="text-terminal-green text-right">MEM%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProcesses.map((process) => (
              <TableRow
                key={process.pid}
                onClick={() => onSelectProcess(process)}
                className={`cursor-pointer hover:bg-terminal-green/10 border-terminal-green/30 ${
                  selectedProcess?.pid === process.pid ? "bg-terminal-green/10" : "bg-black"
                }`}
              >
                <TableCell className="text-terminal-green">{process.pid}</TableCell>
                <TableCell className="text-terminal-green">{process.user}</TableCell>
                <TableCell className="text-terminal-green font-medium">{process.command}</TableCell>
                <TableCell className="text-terminal-green text-right">{process.cpu.toFixed(1)}</TableCell>
                <TableCell className="text-terminal-green text-right">{process.memory.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
