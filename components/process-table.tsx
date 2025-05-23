"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Process } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import sshService from "@/lib/ssh-service";
import systemMonitoring from "@/lib/system-monitoring/system-stats";
import { debounce } from "lodash"; // Make sure to install lodash
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, Scissors, Activity } from "lucide-react";
import { toast } from "sonner"; // Ensure this import exists at the top

interface ProcessTableProps {
  onSelectProcess: (process: Process | null) => void;
  selectedProcess: Process | null;
}

export function ProcessTable({
  onSelectProcess,
  selectedProcess,
}: ProcessTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [processes, setProcesses] = useState<Process[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [killDialogOpen, setKillDialogOpen] = useState(false);
  const [reniceDialogOpen, setReniceDialogOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [targetProcess, setTargetProcess] = useState<Process | null>(null);
  const [newPriority, setNewPriority] = useState(0);
  const [killStatus, setKillStatus] = useState("");

  // Debounce search for better performance
  const debouncedSearchTerm = useMemo(() => {
    return debounce((term: string) => {
      setSearchTerm(term);
    }, 300);
  }, []);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearchTerm(e.target.value);
    },
    [debouncedSearchTerm]
  );

  // Subscribe to system monitoring service to get real-time process data with optimized rendering
  useEffect(() => {
    // Check initial connection status
    setConnected(sshService.isSSHConnected());

    // Set up event listeners for SSH connection changes
    const handleConnected = () => {
      setConnected(true);
      setLoading(true);

      // Add timeout handling to prevent UI freeze
      const timeoutId = setTimeout(() => {
        setLoading(false);
        console.log("Stats loading timed out, showing UI anyway");
      }, 5000); // Show UI after 5 seconds even if stats fail

      systemMonitoring
        .refreshStats()
        .then(() => {
          clearTimeout(timeoutId);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error refreshing stats:", err);
          clearTimeout(timeoutId);
          setLoading(false);
        });
    };

    const handleDisconnected = () => {
      setConnected(false);
      setProcesses([]);
    };

    sshService.onConnected(handleConnected);
    sshService.onDisconnected(handleDisconnected);

    // Subscribe to system monitoring updates with optimized render batching
    let lastUpdateTime = 0;
    let pendingUpdate = false;

    const unsubscribe = systemMonitoring.subscribe((stats) => {
      // Batch frequent updates to avoid excessive renders
      const now = performance.now();
      if (now - lastUpdateTime < 500 && !pendingUpdate) {
        // If less than 500ms since last update, delay this update
        pendingUpdate = true;
        setTimeout(() => {
          setProcesses(systemMonitoring.getCurrentStats().processes);
          lastUpdateTime = performance.now();
          pendingUpdate = false;
        }, 500);
      } else {
        setProcesses(stats.processes);
        lastUpdateTime = now;
      }
    });

    // Get initial data
    if (sshService.isSSHConnected()) {
      const stats = systemMonitoring.getCurrentStats();
      setProcesses(stats.processes);
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
      // Replace null with empty functions that match the expected signature
      sshService.onConnected((message: string) => {});
      sshService.onDisconnected((message: string) => {});
      debouncedSearchTerm.cancel();
    };
  }, [debouncedSearchTerm]);

  const filteredProcesses = useMemo(() => {
    return processes.filter(
      (process) =>
        process.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.pid.toString().includes(searchTerm)
    );
  }, [processes, searchTerm]);

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
      case "root":
        return "bg-[#ec6a88]/10 text-[#ec6a88] border-[#ec6a88]/30";
      case "admin":
        return "bg-[#fbc3a7]/10 text-[#fbc3a7] border-[#fbc3a7]/30";
      case "system":
        return "bg-[#6be5fd]/10 text-[#6be5fd] border-[#6be5fd]/30";
      default:
        return "bg-[#3fdaa4]/10 text-[#3fdaa4] border-[#3fdaa4]/30";
    }
  };

  const handleKillClick = useCallback(
    (process: Process, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent row selection when clicking the button
      setTargetProcess(process);
      setKillDialogOpen(true);
    },
    []
  );

  const handleReniceClick = useCallback(
    (process: Process, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent row selection when clicking the button
      setTargetProcess(process);
      setNewPriority(0); // Reset priority to default
      setReniceDialogOpen(true);
    },
    []
  );

  const executeKill = useCallback(
    async (signal: number = 15) => {
      if (!targetProcess) return;

      setProcessingAction(true);
      setKillStatus(`Terminating process ${targetProcess.pid}...`);

      try {
        // Show immediate feedback with toast
        toast.loading(`Terminating process ${targetProcess.pid}...`, {
          id: `kill-${targetProcess.pid}`,
        });

        // Execute kill command
        const result = await sshService.killProcess(targetProcess.pid, signal);

        // Force close the dialog immediately on success
        setKillDialogOpen(false);

        // Show success toast after dialog is closed
        setTimeout(() => {
          toast.success(`Process ${targetProcess.pid} terminated successfully`, {
            id: `kill-${targetProcess.pid}`,
          });
        }, 100);

        // Force refresh process list immediately in background
        systemMonitoring.refreshStats()
          .catch(err => console.error("Failed to refresh stats:", err));

        // If this was the selected process, clear the selection
        if (selectedProcess?.pid === targetProcess.pid) {
          onSelectProcess(null);
        }
      } catch (error) {
        console.error("Kill process error:", error);
        // Show error toast
        toast.error(
          `Failed to kill process: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          { id: `kill-${targetProcess.pid}` }
        );
      } finally {
        setProcessingAction(false);
        setKillStatus("");
      }
    },
    [targetProcess, selectedProcess, onSelectProcess]
  );

  const executeRenice = useCallback(async () => {
    if (!targetProcess) return;

    setProcessingAction(true);
    try {
      await sshService.reniceProcess(targetProcess.pid, newPriority);
      toast.success(`Priority changed for process ${targetProcess.pid}`);
      setReniceDialogOpen(false);

      // Force refresh process list immediately
      await systemMonitoring.refreshStats();
    } catch (error) {
      toast.error(
        `Failed to change process priority: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setProcessingAction(false);
    }
  }, [targetProcess, newPriority]);

  return (
    <div className="space-y-4 relative">
      {/* Loading indicator */}
      {loading && connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]/30 z-20 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center text-[#f8f8f2]">
            <div className="h-6 w-6 border-2 border-t-[#6be5fd] rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-[#d8dee9]">Loading system data...</p>
          </div>
        </div>
      )}

      {/* Not connected overlay */}
      {!connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]/60 z-10 rounded-lg backdrop-blur-sm">
          <div className="text-[#f8f8f2] text-center p-4">
            <p className="mb-2 text-[#ec6a88]">Not connected to a system</p>
            <p className="text-sm text-[#d8dee9]/70">
              Connect via SSH to view process information
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#6be5fd]" />
        <Input
          placeholder="Search processes..."
          onChange={handleSearch}
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
              <TableHead className="text-[#6be5fd] font-medium">
                COMMAND
              </TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-right">
                CPU%
              </TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-right">
                MEM%
              </TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-center">
                STATUS
              </TableHead>
              <TableHead className="text-[#6be5fd] font-medium text-center">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!connected ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-[#d8dee9]/50"
                >
                  No SSH connection established
                </TableCell>
              </TableRow>
            ) : filteredProcesses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-[#d8dee9]/50"
                >
                  {searchTerm
                    ? "No processes found matching your search"
                    : loading
                    ? "Loading processes..."
                    : "No processes found"}
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredProcesses.map((process) => (
                  <motion.tr
                    key={process.pid}
                    onClick={() => onSelectProcess(process)}
                    className={`cursor-pointer border-zinc-800/50 group ${
                      selectedProcess?.pid === process.pid
                        ? "bg-[#3fdaa4]/5"
                        : "bg-[#1e1e1e]"
                    }`}
                    whileHover={{
                      backgroundColor: "rgba(107, 229, 253, 0.05)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell className="text-[#6272a4] font-mono">
                      {process.pid}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getUserBadgeColor(process.user)}
                      >
                        {process.user}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#d8dee9] font-medium">
                      {process.command.length > 50
                        ? `${process.command.substring(0, 50)}...`
                        : process.command}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        process.cpu > 50 ? "text-[#ec6a88]" : "text-[#3fdaa4]"
                      }`}
                    >
                      {process.cpu.toFixed(1)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        process.memory > 50
                          ? "text-[#fbc3a7]"
                          : "text-[#6be5fd]"
                      }`}
                    >
                      {process.memory.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <span
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            process.cpu,
                            process.memory
                          )} shadow-glow`}
                        ></span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        {/* Add these buttons */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/10"
                          onClick={(e) => handleKillClick(process, e)}
                          title="Kill process"
                        >
                          <Scissors className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100/10"
                          onClick={(e) => handleReniceClick(process, e)}
                          title="Change process priority"
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                        <span
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            process.cpu,
                            process.memory
                          )} shadow-glow`}
                        ></span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Kill Process Dialog */}
      <Dialog open={killDialogOpen} onOpenChange={setKillDialogOpen}>
        <DialogContent className="bg-[#282a36] border-zinc-700 text-[#f8f8f2]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#f8f8f2]">
              <AlertCircle className="h-5 w-5 text-[#ec6a88] mr-2" /> Terminate
              Process
            </DialogTitle>
            <DialogDescription className="text-[#d8dee9]">
              Are you sure you want to terminate process {targetProcess?.pid}?
            </DialogDescription>
          </DialogHeader>

          {/* Process command code block - moved outside DialogDescription */}
          <div className="mt-2 bg-[#1e1e1e] p-2 rounded border border-zinc-700">
            <code className="text-[#d8dee9] font-mono">
              {targetProcess?.command}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              className="bg-[#ec6a88]/10 text-[#ec6a88] border-[#ec6a88]/30 hover:bg-[#ec6a88]/20"
              onClick={() => executeKill(9)}
              disabled={processingAction}
            >
              {processingAction ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Force Kill (-9)"
              )}
            </Button>
            <Button
              variant="outline"
              className="bg-[#6be5fd]/10 text-[#6be5fd] border-[#6be5fd]/30 hover:bg-[#6be5fd]/20"
              onClick={() => executeKill(15)}
              disabled={processingAction}
            >
              {processingAction ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Terminate (-15)"
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setKillDialogOpen(false)}
              disabled={processingAction}
              className="text-[#d8dee9]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renice Process Dialog */}
      <Dialog open={reniceDialogOpen} onOpenChange={setReniceDialogOpen}>
        <DialogContent className="bg-[#282a36] border-zinc-700 text-[#f8f8f2]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#f8f8f2]">
              <Activity className="h-5 w-5 text-[#6be5fd] mr-2" /> Change Process
              Priority
            </DialogTitle>
            <DialogDescription className="text-[#d8dee9]">
              Adjust the priority of process {targetProcess?.pid}
            </DialogDescription>
          </DialogHeader>

          {/* Process command code block - moved outside DialogDescription */}
          <div className="mt-2 bg-[#1e1e1e] p-2 rounded border border-zinc-700">
            <code className="text-[#d8dee9] font-mono">
              {targetProcess?.command}
            </code>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[#3fdaa4]">Higher Priority (-20)</span>
              <span className="text-[#ec6a88]">Lower Priority (19)</span>
            </div>
            <Slider
              defaultValue={[0]}
              min={-20}
              max={19}
              step={1}
              value={[newPriority]}
              onValueChange={(value) => setNewPriority(value[0])}
              className="w-full"
            />
            <div className="text-center text-[#f8f8f2] font-mono">
              New Priority: {newPriority}
            </div>
            <p className="text-sm text-[#d8dee9]/70">
              Lower values give higher priority. Only root can set negative values.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setReniceDialogOpen(false)}
              disabled={processingAction}
              className="text-[#d8dee9]"
            >
              Cancel
            </Button>
            <Button
              onClick={executeRenice}
              disabled={processingAction}
              className="bg-[#3fdaa4]/10 text-[#3fdaa4] border-[#3fdaa4]/30 hover:bg-[#3fdaa4]/20"
            >
              {processingAction ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-t-[#3fdaa4] rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Apply Priority"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 5px currentColor;
        }
      `}</style>
    </div>
  );
}
