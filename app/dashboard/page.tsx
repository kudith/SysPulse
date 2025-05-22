"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { ProcessTable } from "@/components/process-table";
import { ControlPanel } from "@/components/control-panel";
import { ResourceGraph } from "@/components/resource-graph";
import { SSHForm } from "@/components/ssh-form";
import type { Process } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Import Button component
import sshService from "@/lib/ssh-service";
import {ServerInfoContent} from "@/components/ServerInfoContent";

export default function EnhancedDashboardPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [sshConnected, setSSHConnected] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshMode, setRefreshMode] = useState("manual"); // Changed from refreshInterval to refreshMode
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isClientSide, setIsClientSide] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New manual refresh function
  const handleManualRefresh = () => {
    if (sshService.isSSHConnected()) {
      setLastUpdated(Date.now());
      setRefreshTrigger(prev => prev + 1);
    }
  };

  useEffect(() => {
    // Mark that we're now on the client side
    setIsClientSide(true);
    
    // Initialize lastUpdated only on the client side
    setLastUpdated(Date.now());
    
    // Check initial SSH connection status
    const isConnected = sshService.isSSHConnected();
    setSSHConnected(isConnected);
    console.log("Initial SSH connection status:", isConnected);

    // Set up event listeners for SSH connection changes
    const handleConnected = (message: string) => {
      console.log("SSH connected event received:", message);
      setSSHConnected(true); // Update state when connected
      setLastUpdated(Date.now()); // Force refresh of components
      setRenderKey(prev => prev + 1); // Increment render key instead of using timestamp
    };

    const handleDisconnected = (message: string) => {
      console.log("SSH disconnected event received:", message);
      setSSHConnected(false);
      setSelectedProcess(null); // Clear selected process when disconnected
      setRenderKey(prev => prev + 1);
    };

    // Listen for global connection events too
    const handleGlobalEvent = () => {
      const currentConnected = sshService.isSSHConnected();
      if (currentConnected !== sshConnected) {
        setSSHConnected(currentConnected);
        if (currentConnected) {
          setLastUpdated(Date.now());
          setRenderKey(prev => prev + 1);
        } else {
          setSelectedProcess(null);
          setRenderKey(prev => prev + 1);
        }
      }
    };

    // Register the connection event handlers
    sshService.onConnected(handleConnected);
    sshService.onDisconnected(handleDisconnected);
    window.addEventListener('ssh-connection-change', handleGlobalEvent);

    // Removed the auto-refresh interval

    // Cleanup event handlers on unmount
    return () => {
      sshService.onConnected(() => {});
      sshService.onDisconnected(() => {});
      window.removeEventListener('ssh-connection-change', handleGlobalEvent);
    };
  }, [sshConnected]); // Removed refreshInterval from dependencies

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col my-20">
      <Header />

      {/* Global SSH Status */}
      <div className="text-sm text-[#a8aebb] px-4 pt-2 text-right container mx-auto">
        Status SSH:{" "}
        <span
          className={`font-medium ${
            sshConnected ? "text-green-400" : "text-red-500"
          }`}
        >
          {sshConnected ? "Tersambung" : "Tidak tersambung"}
        </span>
      </div>

      <motion.main
        className="flex-1 container mx-auto p-4 space-y-4 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={`main-container-${sshConnected ? 'connected' : 'disconnected'}`} // Re-render on connection state change
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30 flex justify-between items-center">
                <CardTitle className="text-[#6be5fd] text-lg font-medium">
                  System Resources
                </CardTitle>
                {/* Display last updated time and manual refresh button */}
                <div className="flex items-center gap-2">
                  {isClientSide && lastUpdated && (
                    <span className="text-xs text-[#a8aebb]">
                      Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </span>
                  )}
                  {/* Added manual refresh button */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleManualRefresh}
                    disabled={!sshConnected}
                    className="text-xs bg-transparent border-zinc-700 hover:bg-zinc-800"
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {/* Use stable key for initial render, then include renderKey for refresh */}
                {isClientSide ? (
                  <ResourceGraph key={`resource-${renderKey}`} refreshTrigger={refreshTrigger} />
                ) : (
                  <div>Loading resource graph...</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#c792ea] text-lg font-medium">
                  SSH Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <SSHForm />
              </CardContent>
            </Card>

            <Card className="mt-4 border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#3fdaa4] text-base font-medium">
                  Server Info
                </CardTitle>
              </CardHeader>
              {/* <CardContent className="text-[#a8aebb] text-sm">
                {!sshConnected ? (
                  <div className="py-2 text-zinc-500 italic">
                    Connect to SSH to view server information
                  </div>
                ) : isClientSide ? (
                  <ServerInfoContent key={`server-info-${renderKey}`} />
                ) : (
                  <div>Loading server info...</div>
                )}
              </CardContent> */}
            </Card>

            <Card className="mt-4 border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-zinc-800/30">
                <CardTitle className="text-[#ff79c6] text-base font-medium">
                  Preferensi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm text-[#a8aebb] mb-1">
                  Refresh Mode
                </label>
                <Select
                  defaultValue="manual"
                  onValueChange={(val) => setRefreshMode(val)}
                >
                  <SelectTrigger className="bg-[#161616] border-zinc-700 text-[#d8dee9]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual refresh only</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border border-zinc-800/50 bg-[#1e1e1e] shadow-lg overflow-hidden mx-auto max-w-7xl">
            <CardHeader className="pb-2 border-b border-zinc-800/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-[#3fdaa4] text-lg font-medium">
                Process Management
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Cari proses..."
                  className="bg-[#161616] border border-zinc-700 text-[#d8dee9] w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!sshConnected}
                />
                {/* Added refresh button for processes */}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleManualRefresh}
                  disabled={!sshConnected}
                  className="text-xs bg-transparent border-zinc-700 hover:bg-zinc-800"
                >
                  Refresh
                </Button>
              </div>
              {selectedProcess && <ControlPanel process={selectedProcess} />}
            </CardHeader>
            <CardContent className="p-4">
              {isClientSide ? (
                <ProcessTable
                  onSelectProcess={setSelectedProcess}
                  selectedProcess={selectedProcess}
                  key={`process-table-${renderKey}`}
                />
              ) : (
                <div>Loading process table...</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
}