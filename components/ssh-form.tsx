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
  
  // New state for the connected card
  const [isConnected, setIsConnected] = useState(false)
  const [connectionTimestamp, setConnectionTimestamp] = useState<string | null>(null)
  const [connectionInfo, setConnectionInfo] = useState<{
    host: string;
    username: string;
    port: number;
    timestamp: string;
  } | null>(null)

  // Check if already connected when the component mounts
  useEffect(() => {
    // Check if SSH service is already connected
    if (sshService.isSSHConnected()) {
      // Get connection info from session storage
      const connectionInfoStr = sessionStorage.getItem('ssh_connection_info');
      if (connectionInfoStr) {
        try {
          const info = JSON.parse(connectionInfoStr);
          setIsConnected(true);
          setConnectionInfo(info);
          setConnectionTimestamp(info.timestamp);
          setHost(info.host);
          setUsername(info.username);
          setPort(info.port.toString());
        } catch (error) {
          console.error("Failed to parse connection info from session storage:", error);
        }
      } else {
        setIsConnected(true);
        setConnectionTimestamp(new Date().toISOString());
      }
    }
    
    // Set up event handlers for SSH connection
    sshService.onConnected((message) => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionTimestamp(new Date().toISOString());
      
      toast({
        title: "Connection successful",
        description: message,
      });
    });

    sshService.onDisconnected((message) => {
      setIsConnecting(false);
      setIsConnected(false);
      setConnectionTimestamp(null);
      
      toast({
        title: "Disconnected",
        description: message,
      });
    });

    sshService.onError((error) => {
      setIsConnecting(false);
      
      toast({
        title: "Connection failed",
        description: error,
        variant: "destructive",
      });
    });
  }, [toast]);

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
    setIsConnecting(true);

    // Validate connection parameters before attempting to connect
    if (!host || !username || !privateKey || !port) {
      console.error('[SSHForm] Missing required connection parameters:', {
        host,
        username,
        privateKey: privateKey ? 'Provided' : 'Missing',
        port
      });
      toast({
        title: "Connection failed",
        description: "Missing required connection parameters. Please fill in all fields.",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }

    console.log('[SSHForm] Attempting to connect with parameters:', {
      host,
      username,
      port,
      privateKey: privateKey ? 'Provided' : 'Missing',
      passphrase: usePassphrase ? 'Provided' : 'Not used'
    });

    try {
      // Save connection info to session storage for terminal page to use
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
    setConnectionTimestamp(null);
    
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
  
  // Calculate connected duration
  const getConnectedDuration = () => {
    if (!connectionTimestamp) return "Unknown";
    
    try {
      const connectedTime = new Date(connectionTimestamp);
      const now = new Date();
      const diffMs = now.getTime() - connectedTime.getTime();
      
      // Format duration
      const diffSecs = Math.floor(diffMs / 1000);
      const minutes = Math.floor(diffSecs / 60);
      const seconds = diffSecs % 60;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${mins}m ${seconds}s`;
      } else if (mins > 0) {
        return `${mins}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    } catch (e) {
      return "Unknown";
    }
  }
  
  // Connection Status Card
  if (isConnected && connectionInfo) {
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
                <span className="font-mono text-[#d8dee9]">{connectionInfo.host}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-[#6be5fd]" />
                  <span className="text-[#d8dee9]/70">Port:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{connectionInfo.port}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#c792ea]" />
                  <span className="text-[#d8dee9]/70">Username:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{connectionInfo.username}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#fbc3a7]" />
                  <span className="text-[#d8dee9]/70">Connected at:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{formatDate(connectionTimestamp || connectionInfo.timestamp)}</span>
              </div>
              <Separator className="bg-zinc-800/30" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 text-[#fbc3a7]" />
                  <span className="text-[#d8dee9]/70">Duration:</span>
                </div>
                <span className="font-mono text-[#d8dee9]">{getConnectedDuration()}</span>
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

  return (
    <form onSubmit={handleConnect} className="space-y-3">
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
            // accept=".pem,.key,.pub,.ppk,.p12,.crt,.csr,.der,.txt,text/plain,application/x-pem-file,application/x-ssh-key,application/x-pkcs12"
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
