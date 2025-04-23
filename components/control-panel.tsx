"use client"

import { useState } from "react"
import { X, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Process } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ControlPanelProps {
  process: Process
}

export function ControlPanel({ process }: ControlPanelProps) {
  const [isKillDialogOpen, setIsKillDialogOpen] = useState(false)
  const [isReniceDialogOpen, setIsReniceDialogOpen] = useState(false)
  const [priority, setPriority] = useState("0")
  const { toast } = useToast()

  const handleKill = () => {
    toast({
      title: "Process terminated",
      description: `Process ${process.command} (PID: ${process.pid}) terminated`,
    })
    setIsKillDialogOpen(false)
  }

  const handleRenice = () => {
    toast({
      title: "Priority changed",
      description: `Process ${process.command} (PID: ${process.pid}) priority changed to ${priority}`,
    })
    setIsReniceDialogOpen(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={isKillDialogOpen} onOpenChange={setIsKillDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
            <X className="h-4 w-4 mr-1" />
            Kill
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-terminal-dark border-terminal-green">
          <DialogHeader>
            <DialogTitle className="text-terminal-green">Confirm Process Termination</DialogTitle>
            <DialogDescription className="text-terminal-green/70">
              Are you sure you want to terminate process {process.command} (PID: {process.pid})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsKillDialogOpen(false)}
              className="border-terminal-green text-terminal-green hover:bg-terminal-green/10"
            >
              Cancel
            </Button>
            <Button onClick={handleKill} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Terminate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReniceDialogOpen} onOpenChange={setIsReniceDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-terminal-green text-terminal-green hover:bg-terminal-green/10"
          >
            <ArrowUp className="h-4 w-4 mr-1" />
            Renice
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-terminal-dark border-terminal-green">
          <DialogHeader>
            <DialogTitle className="text-terminal-green">Change Process Priority</DialogTitle>
            <DialogDescription className="text-terminal-green/70">
              Set priority for process {process.command} (PID: {process.pid})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-black border-terminal-green/30 text-terminal-green">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-terminal-dark border-terminal-green text-terminal-green">
                <SelectItem value="-20">-20 (Highest)</SelectItem>
                <SelectItem value="-10">-10 (High)</SelectItem>
                <SelectItem value="0">0 (Normal)</SelectItem>
                <SelectItem value="10">10 (Low)</SelectItem>
                <SelectItem value="19">19 (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReniceDialogOpen(false)}
              className="border-terminal-green text-terminal-green hover:bg-terminal-green/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenice}
              className="bg-terminal-green/20 border border-terminal-green text-terminal-green hover:bg-terminal-green/30"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
