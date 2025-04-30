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
import { Server, User, Key, Hash, Upload, Lock, ArrowRight, Clock, RefreshCcw, Terminal, Database, HelpCircle, ExternalLink } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import sshService from "@/lib/ssh-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [helpOpen, setHelpOpen] = useState(false)
  
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
    
    // Force re-emit of connection state in case events were missed
    sshService.emitConnectionState();
    
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
  }, []);

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
      sshService.onConnected(null as unknown as (message: string) => void);
      sshService.onDisconnected(null as unknown as (message: string) => void);
      sshService.onError(null as unknown as (error: string) => void);
    };
  }, [toast]); // Only depend on toast which is stable

  // Add an additional check for connection status that runs periodically
  useEffect(() => {
    if (isConnecting) {
      // Set up a periodic check for connection status while in "connecting" state
      const checkInterval = setInterval(() => {
        const currentlyConnected = sshService.isSSHConnected();
        if (currentlyConnected) {
          console.log("[SSHForm] Connection detected in polling check");
          setIsConnecting(false);
          setIsConnected(true);
          
          // Set timestamp and start timer if not already running
          if (!connectionTimestampRef.current) {
            const now = new Date().toISOString();
            connectionTimestampRef.current = now;
            updateDurationDisplay();
            
            if (!timerRef.current) {
              timerRef.current = setInterval(updateDurationDisplay, 1000);
            }
          }
        }
      }, 1000); // Check every second
      
      return () => clearInterval(checkInterval);
    }
  }, [isConnecting]);

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
      // Force UI update to reflect actual connection state
      setIsConnecting(false);
      setIsConnected(true);
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

    // Set connection timeout - but make it longer to account for Process Management UI loading
    timeoutRef.current = setTimeout(() => {
      // Only trigger timeout if we're still in connecting state
      if (isConnecting) {
        console.log("[SSHForm] Connection timeout after 15s");
        
        // Check one more time if we're actually connected before showing error
        const actuallyConnected = sshService.isSSHConnected();
        if (actuallyConnected) {
          setIsConnecting(false);
          setIsConnected(true);
          console.log("[SSHForm] Actually connected, ignoring timeout");
        } else {
          setIsConnecting(false);
          toast({
            title: "Connection timeout",
            description: "SSH connection attempt took too long. Please try again.",
            variant: "destructive",
          });
        }
      }
    }, 15000); // Extended from 10s to 15s

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
    <>
      <div className="flex justify-between items-center mb-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-[#d8dee9]">Koneksi SSH</h2>
        <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 bg-[#3fdaa4]/10 text-[#3fdaa4] hover:bg-[#3fdaa4]/20 hover:text-[#3fdaa4] transition-all duration-200"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Bantuan</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e1e] border border-zinc-800/50 text-[#d8dee9] max-w-4xl w-[90vw] md:w-[85vw] lg:w-[95vw] p-0 rounded-xl shadow-2xl mx-auto my-auto inset-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <div className="overflow-y-auto max-h-[95vh] p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/30">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-[#c792ea] text-2xl flex items-center gap-2 font-semibold">
                  <HelpCircle className="h-6 w-6" />
                  Bantuan Koneksi SSH
                </DialogTitle>
                <DialogDescription className="text-[#d8dee9]/70 text-base mt-1">
                  Panduan untuk melakukan koneksi SSH ke server jarak jauh
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="mt-6">
                <TabsList className="bg-[#282a36] border-zinc-800/50 w-full flex p-1 rounded-lg mb-4">
                  <TabsTrigger value="basic" className="flex-1 data-[state=active]:bg-[#3fdaa4]/10 data-[state=active]:text-[#3fdaa4] rounded-md transition-all py-2 text-sm">
                    Dasar SSH
                  </TabsTrigger>
                  <TabsTrigger value="ngrok" className="flex-1 data-[state=active]:bg-[#3fdaa4]/10 data-[state=active]:text-[#3fdaa4] rounded-md transition-all py-2 text-sm">
                    Menggunakan Ngrok
                  </TabsTrigger>
                  <TabsTrigger value="cloud" className="flex-1 data-[state=active]:bg-[#3fdaa4]/10 data-[state=active]:text-[#3fdaa4] rounded-md transition-all py-2 text-sm">
                    VM Cloud
                  </TabsTrigger>
                  <TabsTrigger value="troubleshoot" className="flex-1 data-[state=active]:bg-[#3fdaa4]/10 data-[state=active]:text-[#3fdaa4] rounded-md transition-all py-2 text-sm">
                    Pemecahan Masalah
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="mt-4 space-y-5 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-[#6be5fd] flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      Koneksi SSH Dasar
                    </h3>
                    <p className="text-[#d8dee9]/90 leading-relaxed">
                      SSH (Secure Shell) adalah protokol jaringan yang digunakan untuk koneksi aman ke server jarak jauh.
                      Berikut informasi dasar untuk koneksi:
                    </p>
                    
                    <div className="space-y-3 mt-5 bg-[#282a36]/70 rounded-lg p-4 border border-zinc-800/50">
                      <h4 className="font-medium text-[#fbc3a7] text-lg">Informasi yang diperlukan:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-[#d8dee9]/90">
                        <li><span className="font-semibold text-[#d8dee9]">Host:</span> Alamat IP atau nama domain server (contoh: 192.168.1.100 atau server.com)</li>
                        <li><span className="font-semibold text-[#d8dee9]">Port:</span> Nomor port SSH (default: 22)</li>
                        <li><span className="font-semibold text-[#d8dee9]">Username:</span> Nama pengguna untuk login ke server</li>
                        <li><span className="font-semibold text-[#d8dee9]">Private Key:</span> File kunci pribadi untuk autentikasi (biasanya file .pem atau id_rsa)</li>
                      </ul>
                    </div>

                    <div className="space-y-3 mt-5 bg-[#282a36]/70 rounded-lg p-4 border border-zinc-800/50">
                      <h4 className="font-medium text-[#fbc3a7] text-lg">Cara Mendapatkan Private Key:</h4>
                      <p className="text-[#d8dee9]/90">Private key biasanya dibuat saat pertama kali menyiapkan server atau VM Anda:</p>
                      <ul className="list-disc pl-5 space-y-2 text-[#d8dee9]/90">
                        <li>Pada Linux/Mac, private key biasanya tersimpan di <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">~/.ssh/id_rsa</code></li>
                        <li>Untuk VM cloud, private key biasanya diunduh saat membuat instance</li>
                        <li>Jika belum memiliki kunci, buat dengan perintah: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ssh-keygen -t rsa -b 4096</code></li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ngrok" className="mt-4 space-y-5 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-[#6be5fd] flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Menggunakan Ngrok untuk Forwarding SSH
                    </h3>
                    <p className="text-[#d8dee9]/90 leading-relaxed">
                      Jika server Anda berada di balik NAT atau firewall, Ngrok dapat membantu melakukan port forwarding 
                      agar server dapat diakses dari internet.
                    </p>
                    
                    <div className="space-y-3 mt-5 bg-[#282a36]/70 rounded-lg p-4 border border-zinc-800/50">
                      <h4 className="font-medium text-[#fbc3a7] text-lg">Langkah-langkah:</h4>
                      <ol className="list-decimal pl-5 space-y-4 text-[#d8dee9]/90">
                        <li>
                          <div className="font-semibold text-[#d8dee9] text-base">Instal Ngrok</div>
                          <p>Unduh dan instal dari <a href="https://ngrok.com/download" target="_blank" rel="noopener noreferrer" className="text-[#3fdaa4] hover:underline inline-flex items-center">ngrok.com <ExternalLink className="h-3 w-3 ml-1" /></a></p>
                        </li>
                        <li>
                          <div className="font-semibold text-[#d8dee9] text-base">Daftar dan dapatkan token autentikasi</div>
                          <p>Daftar akun gratis di website Ngrok dan salin token autentikasi Anda</p>
                        </li>
                        <li>
                          <div className="font-semibold text-[#d8dee9] text-base">Autentikasi Ngrok</div>
                          <p>Jalankan perintah: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ngrok authtoken YOUR_AUTH_TOKEN</code></p>
                        </li>
                        <li>
                          <div className="font-semibold text-[#d8dee9] text-base">Mulai TCP forwarding untuk SSH</div>
                          <p>Jalankan perintah: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ngrok tcp 22</code></p>
                        </li>
                        <li>
                          <div className="font-semibold text-[#d8dee9] text-base">Gunakan alamat forwarding</div>
                          <p>Salin alamat yang diberikan (contoh: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">tcp://0.tcp.ngrok.io:12345</code>)</p>
                          <p>Masukkan <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">0.tcp.ngrok.io</code> sebagai host dan <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">12345</code> sebagai port dalam form koneksi</p>
                        </li>
                      </ol>
                    </div>

                    <div className="bg-[#ff79c6]/10 p-4 rounded-lg mt-4 border border-[#ff79c6]/30">
                      <p className="text-[#ff79c6] font-medium flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Catatan Penting:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-2 text-[#d8dee9]/90">
                        <li>Alamat Ngrok gratis akan berubah setiap kali direstart</li>
                        <li>Untuk alamat statis, Anda perlu berlangganan paket premium Ngrok</li>
                        <li>Pastikan server SSH Anda berjalan di port 22 atau sesuaikan perintah Ngrok</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cloud" className="mt-4 space-y-5 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-[#6be5fd] flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Koneksi ke VM Cloud
                    </h3>
                    <p className="text-[#d8dee9]/90 leading-relaxed">
                      Menghubungkan ke VM yang berjalan di layanan cloud seperti AWS, Google Cloud, atau Azure.
                    </p>
                    
                    <div className="space-y-6 mt-4">
                      <div className="bg-[#282a36]/70 rounded-lg p-4 border border-zinc-800/50">
                        <h4 className="font-medium text-[#fbc3a7] text-lg mb-3">AWS EC2:</h4>
                        <ol className="list-decimal pl-5 space-y-2 text-[#d8dee9]/90">
                          <li>Gunakan file .pem yang diunduh saat membuat instance</li>
                          <li>Host adalah Public DNS atau Public IP dari instance</li>
                          <li>Username default bergantung pada jenis OS: 
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Amazon Linux/RHEL: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code></li>
                              <li>Ubuntu: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ubuntu</code></li>
                              <li>Debian: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">admin</code> atau <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">debian</code></li>
                            </ul>
                          </li>
                          <li>Pastikan Security Group mengizinkan koneksi SSH (port 22)</li>
                        </ol>
                      </div>
                      
                      <div className="bg-[#282a36]/70 rounded-lg p-4 border border-zinc-800/50">
                        <h4 className="font-medium text-[#fbc3a7] text-lg mb-3">Google Cloud Platform:</h4>
                        <ol className="list-decimal pl-5 space-y-2 text-[#d8dee9]/90">
                          <li>Gunakan alamat IP eksternal sebagai host</li>
                          <li>Upload kunci SSH melalui Metadata VM</li>
                          <li>Username biasanya adalah nama pengguna Anda di GCP atau yang dikonfigurasi saat membuat VM</li>
                          <li>Pastikan aturan firewall mengizinkan koneksi SSH (port 22)</li>
                        </ol>
                      </div>
                      
                      <div className="bg-[#282a36]/70 rounded-lg p-4 border border-zinc-800/50">
                        <h4 className="font-medium text-[#fbc3a7] text-lg mb-3">Microsoft Azure:</h4>
                        <ol className="list-decimal pl-5 space-y-2 text-[#d8dee9]/90">
                          <li>Gunakan alamat IP publik VM sebagai host</li>
                          <li>Gunakan username yang dikonfigurasi saat membuat VM</li>
                          <li>Pastikan Network Security Group (NSG) mengizinkan koneksi SSH</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="troubleshoot" className="mt-4 space-y-5 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-[#6be5fd] flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H9.5M14.5 4C14.5 5.10457 13.6046 6 12.5 6H11.5C10.3954 6 9.5 5.10457 9.5 4M14.5 4C14.5 2.89543 13.6046 2 12.5 2H11.5C10.3954 2 9.5 2.89543 9.5 4M12 11V16M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pemecahan Masalah Koneksi SSH
                    </h3>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-[#fbc3a7] text-lg">Masalah Umum:</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                          <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Connection Refused</p>
                          <ul className="list-disc pl-5 mt-1 space-y-2 text-[#d8dee9]/90">
                            <li>Pastikan layanan SSH berjalan di server</li>
                            <li>Periksa apakah port 22 terbuka (atau port yang dikonfigurasi)</li>
                            <li>Periksa aturan firewall (Security Group, iptables, dll)</li>
                            <li>Coba dengan perintah: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ssh -v username@host</code> untuk debug</li>
                          </ul>
                        </div>
                        
                        <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                          <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Permission Denied (publickey)</p>
                          <ul className="list-disc pl-5 mt-1 space-y-2 text-[#d8dee9]/90">
                            <li>Pastikan menggunakan private key yang benar</li>
                            <li>Periksa hak akses file private key (chmod 400 key.pem)</li>
                            <li>Pastikan username sudah benar</li>
                            <li>Periksa apakah public key sudah ditambahkan ke authorized_keys di server</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                        <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Host Key Verification Failed</p>
                        <ul className="list-disc pl-5 mt-1 space-y-2 text-[#d8dee9]/90">
                          <li>Alamat IP server mungkin berubah tapi fingerprint tetap di known_hosts</li>
                          <li>Hapus entri lama dengan: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ssh-keygen -R hostname_or_ip</code></li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-[#3fdaa4]/10 p-4 rounded-lg mt-6 border border-[#3fdaa4]/30">
                      <h4 className="font-medium text-[#3fdaa4] text-lg mb-2 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 11.9999H20M4 11.9999H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99995 20.1046 9.99995 19V18.469C9.99995 17.5739 9.6444 16.7155 9.01151 16.0827L8.46441 15.5356Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Tips:
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-[#d8dee9]/90">
                        <li>Pastikan format private key benar (OpenSSH atau PEM)</li>
                        <li>Nonaktifkan sementara firewall untuk mendiagnosis masalah koneksi</li>
                        <li>Coba koneksi dari jaringan berbeda untuk menyingkirkan masalah jaringan</li>
                        <li>Gunakan telnet untuk memeriksa port: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">telnet hostname 22</code></li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <form onSubmit={handleConnect} className="space-y-3 max-w-3xl mx-auto">
      {/* Form content - unchanged */}
      <div className="space-y-2">
        <Label htmlFor="host" className="text-[#d8dee9]">
          Host
        </Label>
        <div className="relative">
          <Server className="absolute left-3 top-2.5 h-4 w-4 text-[#6be5fd]" />
          <Input
            id="host"
              placeholder="hostname atau alamat IP"
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
                placeholder="nama pengguna"
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
              placeholder="Tempel private key Anda di sini atau upload file"
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
            Key saya dilindungi dengan passphrase
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
                placeholder="Masukkan passphrase untuk key Anda"
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
                Menghubungkan...
            </div>
          ) : (
              "Hubungkan"
          )}
        </Button>
      </motion.div>
    </form>
    </>
  )
}