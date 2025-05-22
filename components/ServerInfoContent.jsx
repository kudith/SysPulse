"use client"

import { useEffect, useState } from "react"
import sshService from "@/lib/ssh-service"

export function ServerInfoContent() {
  const [loading, setLoading] = useState(true)
  const [serverInfo, setServerInfo] = useState({
    os: "",
    hostname: "",
    ip: "",
    uptime: "",
    kernel: "",
    cpu: "",
    memory: ""
  })
  
  // Gunakan interval yang lebih pendek untuk update lebih sering
  const refreshInterval = 10000; // 10 detik

  useEffect(() => {
    async function fetchServerInfo() {
      if (!sshService.isSSHConnected()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Execute commands in batch to get server information
        const commands = [
          "cat /etc/os-release | grep PRETTY_NAME | cut -d '\"' -f 2",  // OS name
          "hostname",                                                  // Hostname
          "hostname -I | awk '{print $1}'",                            // IP address
          "uptime -p",                                                 // Uptime in readable format
          "uname -r",                                                  // Kernel version
          "lscpu | grep 'Model name' | cut -d ':' -f 2 | xargs",       // CPU info
          "free -h | awk '/^Mem/ {print $3\"/\"$2}'"                   // Memory usage
        ];

        // Batch execution dengan prioritas tinggi
        const results = await sshService.executeCommandBatch(commands, 'high');
        
        if (results && results.size > 0) {
          setServerInfo({
            os: results.get(commands[0])?.trim() || "Unknown OS",
            hostname: results.get(commands[1])?.trim() || "Unknown Host",
            ip: results.get(commands[2])?.trim() || "Unknown IP",
            uptime: results.get(commands[3])?.trim() || "Unknown Uptime",
            kernel: results.get(commands[4])?.trim() || "Unknown Kernel",
            cpu: results.get(commands[5])?.trim() || "Unknown CPU",
            memory: results.get(commands[6])?.trim() || "Unknown Memory"
          });
        }
      } catch (error) {
        console.error("Error fetching server info:", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Fetch data immediately
    fetchServerInfo();
    
    // Set interval untuk update data secara berkala
    const interval = setInterval(fetchServerInfo, refreshInterval);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-5 w-5 border-2 border-t-[#6be5fd] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[#6be5fd]">Loading server info...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <p><span className="font-medium text-[#6be5fd]">OS:</span> {serverInfo.os}</p>
      <p><span className="font-medium text-[#6be5fd]">Hostname:</span> {serverInfo.hostname}</p>
      <p><span className="font-medium text-[#6be5fd]">IP:</span> {serverInfo.ip}</p>
      <p><span className="font-medium text-[#6be5fd]">Uptime:</span> {serverInfo.uptime}</p>
      <p><span className="font-medium text-[#6be5fd]">Kernel:</span> {serverInfo.kernel}</p>
      <p><span className="font-medium text-[#6be5fd]">CPU:</span> {serverInfo.cpu}</p>
      <p><span className="font-medium text-[#6be5fd]">Memory:</span> {serverInfo.memory}</p>
    </div>
  )
}