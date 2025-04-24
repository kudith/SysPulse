"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Server, User, Key, Hash, Upload, Lock, ArrowRight, Clock, RefreshCcw, Terminal, Database } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import sshService from "@/lib/ssh-service"

export function SSHForm() {
  const router = useRouter()
  const [host, setHost] = useState("")
  const [username, setUsername] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [port, setPort] = useState("22")
  const [isConnecting, setIsConnecting] = useState(false)
  const [usePassphrase, setUsePassphrase] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [connectionInfo, setConnectionInfo] = useState<{
    host: string;
    username: string;
    port: number;
    timestamp: string;
  } | null>(null)
  const [durationDisplay, setDurationDisplay] = useState("0s")

  // Refs to avoid dependency issues
  const connectionTimestampRef = useRef<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the duration display
  const updateDurationDisplay = () => {
    if (!connectionTimestampRef.current) return;
    
    try {
      const connectedTime = new Date(connectionTimestampRef.current);
      const now = new Date();
      const diffMs = now.getTime() - connectedTime.getTime();
      
      // Format duration
      const diffSecs = Math.floor(diffMs / 1000);
      const minutes = Math.floor(diffSecs / 60);
      const seconds = diffSecs % 60;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      let durationText: string;
      if (hours > 0) {
        durationText = `${hours}h ${mins}m ${seconds}s`;
      } else if (mins > 0) {
        durationText = `${mins}m ${seconds}s`;
      } else {
        durationText = `${seconds}s`;
      }
      
      setDurationDisplay(durationText);
    } catch (e) {
      setDurationDisplay("Unknown");
    }
  }

  // Check connection status once when component mounts
  useEffect(() => {
    // Clean up function
    const cleanup = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    
    // Check if SSH is connected
    const isSSHConnected = sshService.isSSHConnected();
    console.log("[SSHForm] Initial connection check:", isSSHConnected);
    setIsConnected(isSSHConnected);
    
    if (isSSHConnected) {
      // Get connection info from session storage
      const connectionInfoStr = sessionStorage.getItem('ssh_connection_info');
      if (connectionInfoStr) {
        try {
          const info = JSON.parse(connectionInfoStr);
          setConnectionInfo(info);
          connectionTimestampRef.current = info.timestamp;
          setHost(info.host || "");
          setUsername(info.username || "");
          setPort((info.port || 22).toString());
          
          // Start duration timer
          updateDurationDisplay();
          timerRef.current = setInterval(updateDurationDisplay, 1000);
        } catch (error) {
          console.error("[SSHForm] Failed to parse connection info:", error);
        }
      } else {
        // Create minimal info
        const now = new Date().toISOString();
        connectionTimestampRef.current = now;
        const minimalInfo = {
          host: "Unknown",
          username: "Unknown",
          port: 22,
          timestamp: now
        };
        setConnectionInfo(minimalInfo);
        
        // Start duration timer
        updateDurationDisplay();
        timerRef.current = setInterval(updateDurationDisplay, 1000);
      }
    }
    
    return cleanup;
  }, []); // Empty dependency array means this runs once on mount

  // Set up event handlers for SSH connection - separate from the initial check
  useEffect(() => {
    const handleConnected = (message: string) => {
      console.log("[SSHForm] Connected event:", message);
      setIsConnecting(false);
      setIsConnected(true);
      
      // Clear connection timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Set timestamp and start timer if not already running
      const now = new Date().toISOString();
      connectionTimestampRef.current = now;
      updateDurationDisplay();
      
      if (!timerRef.current) {
        timerRef.current = setInterval(updateDurationDisplay, 1000);
      }
      
      toast({
        title: "Connection successful",
        description: message,
      });
    };
    
    const handleDisconnected = (message: string) => {
      console.log("[SSHForm] Disconnected event:", message);
      setIsConnecting(false);
      setIsConnected(false);
      connectionTimestampRef.current = null;
      
      // Clear any timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      toast({
        title: "Disconnected",
        description: message,
      });
    };
    
    const handleError = (error: string) => {
      console.log("[SSHForm] Error event:", error);
      setIsConnecting(false);
      
      // Clear connection timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      toast({
        title: "Connection failed",
        description: error,
        variant: "destructive",
      });
    };

    // Register event handlers
    sshService.onConnected(handleConnected);
    sshService.onDisconnected(handleDisconnected);
    sshService.onError(handleError);

    return () => {
      // Cleanup
      sshService.onConnected(null);
      sshService.onDisconnected(null);
      sshService.onError(null);
    };
  }, [toast]); // Only depend on toast which is stable

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (typeof content === 'string') {
        setPrivateKey(content)
      }
    }
    reader.readAsText(file)
  }

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Double check we're not already connected
    if (sshService.isSSHConnected()) {
      console.log("[SSHForm] Already connected, not attempting new connection");
      return;
    }
    
    setIsConnecting(true);

    // Validate connection parameters
    if (!host || !username || !privateKey || !port) {
      console.error('[SSHForm] Missing required connection parameters');
      toast({
        title: "Connection failed",
        description: "Missing required connection parameters. Please fill in all fields.",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }

    console.log('[SSHForm] Attempting to connect with parameters:', {
      host, username, port, 
      privateKey: privateKey ? 'Provided' : 'Missing',
      passphrase: usePassphrase ? 'Provided' : 'Not used'
    });

    // Set connection timeout
    timeoutRef.current = setTimeout(() => {
      if (isConnecting) {
        console.log("[SSHForm] Connection timeout after 10s");
        setIsConnecting(false);
        toast({
          title: "Connection timeout",
          description: "SSH connection attempt took too long. Please try again.",
          variant: "destructive",
        });
      }
    }, 10000);

    try {
      // Save connection info to session storage
      const connectionInfo = {
        host,
        username,
        port: parseInt(port),
        timestamp: new Date().toISOString()
      };

      window.sessionStorage.setItem('ssh_connection_info', JSON.stringify(connectionInfo));
      setConnectionInfo(connectionInfo);
      console.log('[SSHForm] Connection info saved to session storage:', connectionInfo);

      // Connect to SSH server
      sshService.connect({
        host,
        port: parseInt(port),
        username,
        privateKey,
        passphrase: usePassphrase ? passphrase : undefined
      });
    } catch (error) {
      console.error('[SSHForm] Error during connection attempt:', error);
      setIsConnecting(false);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }
  
  const handleDisconnect = () => {
    sshService.disconnect();
    setIsConnected(false);
    connectionTimestampRef.current = null;
    
    // Stop the duration timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear connection info from session storage
    sessionStorage.removeItem('ssh_persistent_id');
    sessionStorage.removeItem('ssh_connected_state');
    
    toast({
      title: "Disconnected",
      description: "SSH connection closed"
    });
  }
  
  const handleOpenTerminal = () => {
    router.push("/terminal");
  }
  
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch (e) {
      return "Unknown";
    }
  }

  // Connection Status Card
  if (isConnected && (connectionInfo || sshService.isSSHConnected())) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <Card className="border-zinc-800/50 bg-[#1e1e1e] text-[#d8dee9] shadow-lg overflow-hidden">
          <CardHeader className="pb-2 border-b border-zinc-800/30">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[#c792ea] flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  SSH Connection Active
                </CardTitle>
                <CardDescription className="text-[#d8dee9]/70">
                  You are connected to a remote server
                </CardDescription>
              </div>
              <Badge className="bg-[#3fdaa4]/10 text-[#3fdaa4] border-[#3fdaa4]/30 hover:bg-[#3fdaa4]/20">
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-[#6be5fd]" />
                  <span className="text-[#d8dee9]/70">Host:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{connectionInfo?.host || host || "Unknown"}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-[#6be5fd]" />
                  <span className="text-[#d8dee9]/70">Port:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{connectionInfo?.port || port || "22"}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#c792ea]" />
                  <span className="text-[#d8dee9]/70">Username:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{connectionInfo?.username || username || "Unknown"}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#fbc3a7]" />
                  <span className="text-[#d8dee9]/70">Connected at:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{formatDate(connectionTimestampRef.current || connectionInfo?.timestamp || new Date().toISOString())}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 text-[#fbc3a7]" />
                  <span className="text-[#d8dee9]/70">Duration:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{durationDisplay}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#3fdaa4]" />
                  <span className="text-[#d8dee9]/70">Session:</span>
                </div>
                <span className="font-mono text-xs text-[#d8dee9]">
                  {sessionStorage.getItem('ssh_persistent_id')?.substring(0, 8) || 'Unknown'}...
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 justify-between pt-4 border-t border-zinc-800/30">
            <Button 
              variant="outline" 
              onClick={handleDisconnect} 
              className="bg-[#ec6a88]/10 text-[#ec6a88] border-[#ec6a88]/30 hover:bg-[#ec6a88]/20 hover:text-[#ec6a88] w-full"
            >
              Disconnect
            </Button>
            <Button 
              onClick={handleOpenTerminal} 
              className="bg-[#3fdaa4]/10 hover:bg-[#3fdaa4]/20 text-[#3fdaa4] border border-[#3fdaa4]/30 w-full"
            >
              <Terminal className="h-4 w-4 mr-2" /> Open Terminal <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // Login Form
  return (
    <form onSubmit={handleConnect} className="space-y-3">
      {/* Form content - unchanged */}
      <div className="space-y-2">
        <Label htmlFor="host" className="text-[#d8dee9]">
          Host
        </Label>
        <div className="relative">
          <Server className="absolute left-3 top-2.5 h-4 w-4 text-[#6be5fd]" />
          <Input
            id="host"
            placeholder="hostname or IP address"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="pl-10 bg-[#282a36] border-zinc-800/50 text-[#d8dee9] focus-visible:ring-[#c792ea] focus-visible:border-[#c792ea] placeholder:text-[#6272a4]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-[#d8dee9]">
            Username
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-[#c792ea]" />
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-[#282a36] border-zinc-800/50 text-[#d8dee9] focus-visible:ring-[#c792ea] focus-visible:border-[#c792ea] placeholder:text-[#6272a4]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="port" className="text-[#d8dee9]">
            Port
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-[#fbc3a7]" />
            <Input
              id="port"
              placeholder="22"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="pl-10 bg-[#282a36] border-zinc-800/50 text-[#d8dee9] focus-visible:ring-[#c792ea] focus-visible:border-[#c792ea] placeholder:text-[#6272a4]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="privateKey" className="text-[#d8dee9]">
            Private Key
          </Label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            onClick={handleSelectFile}
            variant="outline"
            size="sm"
            className="text-xs bg-[#282a36] hover:bg-[#3fdaa4]/10 text-[#3fdaa4] border border-[#3fdaa4]/30"
          >
            <Upload className="h-3 w-3 mr-1" /> Upload Key
          </Button>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-3 flex items-center justify-center">
            <Key className="h-4 w-4 text-[#fbc3a7]" />
          </div>
          <Textarea
            id="privateKey"
            placeholder="Paste your private key here or upload a file"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="min-h-[150px] pl-10 bg-[#282a36] border-zinc-800/50 text-[#d8dee9] focus-visible:ring-[#c792ea] focus-visible:border-[#c792ea] font-mono text-xs placeholder:text-[#6272a4]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="usePassphrase" 
          checked={usePassphrase}
          onCheckedChange={(checked) => setUsePassphrase(checked as boolean)}
          className="border-[#3fdaa4]/50 data-[state=checked]:bg-[#3fdaa4] data-[state=checked]:text-[#161616]"
        />
        <Label htmlFor="usePassphrase" className="text-[#d8dee9] text-sm cursor-pointer">
          My key is protected with a passphrase
        </Label>
      </div>

      {usePassphrase && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="passphrase" className="text-[#d8dee9]">
            Passphrase
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#ec6a88]" />
            <Input
              id="passphrase"
              type="password"
              placeholder="Enter your key's passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="pl-10 bg-[#282a36] border-zinc-800/50 text-[#d8dee9] focus-visible:ring-[#c792ea] focus-visible:border-[#c792ea] placeholder:text-[#6272a4]"
            />
          </div>
        </motion.div>
      )}

      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="pt-2"
      >
        <Button
          type="submit"
          disabled={isConnecting}
          className={`w-full transition-all duration-300 ${
            isConnecting
              ? "bg-[#6be5fd]/10 text-[#6be5fd]/70 border border-[#6be5fd]/30"
              : "bg-[#c792ea]/10 hover:bg-[#c792ea]/20 text-[#c792ea] border border-[#c792ea]/30"
          }`}
        >
          {isConnecting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#6be5fd]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </div>
          ) : (
            "Connect"
          )}
        </Button>
      </motion.div>
    </form>
  )
}