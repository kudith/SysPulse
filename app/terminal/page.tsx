"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { TerminalHeader } from "@/components/terminal/terminal-header"
import { TerminalWindow } from "@/components/terminal/terminal-window"
import { SimpleTerminal } from "@/components/terminal/simple-terminal"
import { TerminalFooter } from "@/components/terminal/terminal-footer"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import sshService from "@/lib/ssh-service"
import systemMonitoring from "@/lib/system-monitoring/system-stats"
import { Button } from "@/components/ui/button"

export default function TerminalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [connected, setConnected] = useState(false)
  const [hostname, setHostname] = useState("server")
  const [username, setUsername] = useState("user")
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [diskUsage, setDiskUsage] = useState(0)
  const [useSimpleTerminal, setUseSimpleTerminal] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const connectionCheckedRef = useRef(false)

  // Handle SSH connection
  useEffect(() => {
    if (connectionCheckedRef.current) return;
    connectionCheckedRef.current = true;
    
    const checkConnection = () => {
      // Check if SSH service is connected
      if (sshService.isSSHConnected()) {
        setConnected(true);
        console.log('Terminal page: SSH connection active');
        
        // Start system monitoring if connected
        systemMonitoring.refreshStats();
      } else {
        console.log('Terminal page: No active SSH connection found');
        
        // Don't redirect immediately, give user a chance to see what's happening
        toast({
          title: "SSH Status",
          description: "No active SSH connection found. You can continue in local mode or go back to dashboard.",
        });
      }
    };
    
    // Check connection status after a small delay to allow SSH service to initialize
    setTimeout(checkConnection, 1000);
  }, [toast]);
  
  // Setup event listeners for SSH service
  useEffect(() => {
    // Set up event listeners
    const connectedHandler = (message: string) => {
      console.log('SSH Connected:', message);
      setConnected(true);
      
      // Trigger system monitoring refresh
      systemMonitoring.refreshStats();
      
      toast({
        title: "Connected",
        description: message,
      });
    };
    
    const disconnectedHandler = (message: string) => {
      console.log('SSH Disconnected:', message);
      setConnected(false);
      
      toast({
        title: "Disconnected",
        description: message,
      });
    };
    
    const errorHandler = (error: string) => {
      console.error('SSH Error:', error);
      
      toast({
        title: "Connection error",
        description: error,
        variant: "destructive",
      });
    };
    
    // Register handlers
    sshService.onConnected(connectedHandler);
    sshService.onDisconnected(disconnectedHandler);
    sshService.onError(errorHandler);

    // Extract connection info from session storage
    const connectionInfo = window.sessionStorage.getItem('ssh_connection_info');
    if (connectionInfo) {
      try {
        const { host, username: user } = JSON.parse(connectionInfo);
        setHostname(host);
        setUsername(user);
      } catch (e) {
        console.error('Failed to parse connection info:', e);
      }
    }

    // Subscribe to system monitoring updates
    const unsubscribe = systemMonitoring.subscribe((stats) => {
      if (stats.cpu.length > 0) {
        setCpuUsage(stats.cpu[stats.cpu.length - 1].value);
      }
      if (stats.memory.length > 0) {
        setMemoryUsage(stats.memory[stats.memory.length - 1].value);
      }
    });

    return () => {
      // Cleanup
      unsubscribe();
      
      // Clear handlers
      sshService.onConnected(() => {});
      sshService.onDisconnected(() => {});
      sshService.onError(() => {});
    };
  }, [toast]);

  // Handle disconnect
  const handleDisconnect = async () => {
    toast({
      title: "Disconnecting",
      description: "Closing SSH connection...",
    });

    sshService.disconnect();
    
    // Clear the persistent connection state
    sessionStorage.removeItem('ssh_persistent_id');
    sessionStorage.removeItem('ssh_connection_info');
    
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 space-y-4">
        <motion.div
          className="flex-1 flex flex-col max-w-7xl mx-auto w-full h-[85vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <TerminalHeader
              connected={connected}
              hostname={hostname}
              username={username}
              onDisconnect={handleDisconnect}
            />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setUseSimpleTerminal(!useSimpleTerminal)}
            >
              {useSimpleTerminal ? "Use SSH Terminal" : "Use Debug Terminal"}
            </Button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden border border-[#161616] rounded-b-lg bg-[#121212]">
            {useSimpleTerminal ? (
              <SimpleTerminal />
            ) : (
              <TerminalWindow connected={connected} ref={terminalRef} />
            )}
          </div>

          <TerminalFooter cpuUsage={cpuUsage} memoryUsage={memoryUsage} diskUsage={diskUsage} />
        </motion.div>
      </main>
    </div>
  );
}