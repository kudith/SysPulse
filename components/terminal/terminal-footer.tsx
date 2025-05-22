"use client"

import { motion } from "framer-motion"
import { Cpu, HardDrive, MemoryStick, Clock, Activity, Globe, Terminal, Disc, Users, Server } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState, useRef } from "react"
import systemMonitoring from "@/lib/system-monitoring/system-stats"
import sshService from "@/lib/ssh-service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TerminalFooterProps {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export function TerminalFooter({ 
  cpuUsage: initialCpuUsage, 
  memoryUsage: initialMemoryUsage, 
  diskUsage: initialDiskUsage 
}: TerminalFooterProps) {
  // Use real system data from SSH instead of the simulated values
  const [cpuUsage, setCpuUsage] = useState(initialCpuUsage);
  const [memoryUsage, setMemoryUsage] = useState(initialMemoryUsage);
  const [diskUsage, setDiskUsage] = useState(initialDiskUsage);
  const [processes, setProcesses] = useState<number>(0);
  const [users, setUsers] = useState<number>(0);
  const [uptime, setUptime] = useState<string>("");
  const [hostname, setHostname] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format date and time with a live clock
  const [dateTime, setDateTime] = useState({
    formattedDate: '',
    formattedTime: ''
  });
  
  // For ping simulation
  const [ping, setPing] = useState(0);

  useEffect(() => {
    // Check connection status
    const isConnected = sshService.isSSHConnected();
    setConnected(isConnected);
    
    // Set up connection status listener
    const handleConnected = () => {
      setConnected(true);
      fetchSystemInfo();
      startRefreshTimer();
    };
    
    const handleDisconnected = () => {
      setConnected(false);
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
    
    sshService.onConnected(handleConnected);
    sshService.onDisconnected(handleDisconnected);
    
    // Ping simulation - we'll keep this for UI feedback
    const pingInterval = setInterval(() => {
      setPing(Math.floor(Math.random() * 100) + 10);
    }, 3000);

    // Fetch real system data if connected
    if (isConnected) {
      fetchSystemInfo();
      startRefreshTimer();
      
      // Subscribe to system monitoring stats
      const unsubscribe = systemMonitoring.subscribe((stats) => {
        // Update CPU usage from the latest data point
        if (stats.cpu.length > 0) {
          setCpuUsage(stats.cpu[stats.cpu.length - 1].value);
        }
        
        // Update memory usage from the latest data point
        if (stats.memory.length > 0) {
          setMemoryUsage(stats.memory[stats.memory.length - 1].value);
        }
        
        // Update process count
        setProcesses(stats.processes.length);
        
        setIsLoading(false);
      });
      
      // Initial data fetch
      systemMonitoring.refreshStats();
      
      return () => {
        clearInterval(pingInterval);
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
        unsubscribe();
        sshService.onConnected(() => {});
        sshService.onDisconnected(() => {});
      };
    } else {
      // If not connected, set loading to false
      setIsLoading(false);
      
      return () => {
        clearInterval(pingInterval);
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
        sshService.onConnected(() => {});
        sshService.onDisconnected(() => {});
      };
    }
  }, []);
  
  const startRefreshTimer = () => {
    // Clear existing timer if any
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    
    // Set up a refresh timer (every 60 seconds)
    refreshTimerRef.current = setInterval(() => {
      if (sshService.isSSHConnected()) {
        fetchSystemInfo();
      } else {
        // If disconnected, clear the timer
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
      }
    }, 60000); // Refresh every minute
  };
  
  // Fetch additional system info (hostname, users, uptime, disk usage)
  const fetchSystemInfo = async () => {
    if (!sshService.isSSHConnected()) {
      console.log("Cannot fetch system info: SSH not connected");
      return;
    }
    
    try {
      // Run all commands silently in the background
      const commands = [
        "df -h / | awk 'NR==2 {print $5}' | tr -d '%'", // Disk usage
        "hostname",                                     // Hostname
        "who | wc -l",                                  // User count
        "uptime -p"                                     // Uptime
      ];
      
      // Execute all commands in background
      const results = await sshService.executeBackgroundBatch(commands, 'low');
      
      // Process results - order is preserved in the Map
      let index = 0;
      for (const [command, output] of results.entries()) {
        const trimmedOutput = output.trim();
        
        switch(index) {
          case 0: // Disk usage
            const parsedDiskUsage = parseFloat(trimmedOutput);
            if (!isNaN(parsedDiskUsage)) {
              setDiskUsage(parsedDiskUsage);
            }
            break;
            
          case 1: // Hostname
            setHostname(trimmedOutput);
            break;
            
          case 2: // User count
            const usersCount = parseInt(trimmedOutput);
            if (!isNaN(usersCount)) {
              setUsers(usersCount);
            }
            break;
            
          case 3: // Uptime
            setUptime(trimmedOutput.replace('up ', ''));
            break;
        }
        index++;
      }
      
      // Also trigger a system stats refresh (which will now use background commands too)
      systemMonitoring.refreshStats();
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching system info:", error);
      
      if (error instanceof Error && error.message.includes("connection")) {
        console.log("Connection error while fetching system info, checking connection status");
        const isConnected = sshService.isSSHConnected();
        setConnected(isConnected);
      }
    }
  };
  
  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime({
        formattedDate: now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        formattedTime: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      });
    };
    
    // Update immediately and then every second
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get color based on usage percentage
  const getUsageColor = (percentage: number) => {
    if (percentage > 80) return "text-[#ec6a88]"; // Red pastel
    if (percentage > 60) return "text-[#fbc3a7]"; // Peach
    if (percentage > 40) return "text-[#70e1e8]"; // Teal pastel
    return "text-[#3fdaa4]"; // Mint green
  };
  
  // Get progress color as tailwind class based on usage
  const getProgressColor = (percentage: number) => {
    if (percentage > 80) return "bg-[#ec6a88]";
    if (percentage > 60) return "bg-[#fbc3a7]";
    if (percentage > 40) return "bg-[#6be5fd]";
    return "bg-[#3fdaa4]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full border-t border-[#2c2e2f] bg-[#232526] px-4 py-1.5 text-[#9da1a6] text-xs flex justify-between items-center"
    >
      <div className="flex items-center space-x-4">
        {/* CPU Usage */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 cursor-help">
                <Cpu className="h-3.5 w-3.5" />
                <div className="w-32">
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] font-mono ${getUsageColor(cpuUsage)}`}>CPU</span>
                    <span className={`text-[10px] font-mono ${getUsageColor(cpuUsage)}`}>{isLoading ? '...' : `${cpuUsage.toFixed(1)}%`}</span>
                  </div>
                  <Progress 
                    value={cpuUsage} 
                    className="h-1 bg-[#2c2e2f]" 
                    indicatorClassName={getProgressColor(cpuUsage)} 
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current CPU usage {isLoading ? 'loading...' : `${cpuUsage.toFixed(1)}%`}</p>
              {connected && <p>Active processes: {processes}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Memory Usage */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 cursor-help">
                <MemoryStick className="h-3.5 w-3.5" />
                <div className="w-32">
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] font-mono ${getUsageColor(memoryUsage)}`}>Memory</span>
                    <span className={`text-[10px] font-mono ${getUsageColor(memoryUsage)}`}>{isLoading ? '...' : `${memoryUsage.toFixed(1)}%`}</span>
                  </div>
                  <Progress 
                    value={memoryUsage} 
                    className="h-1 bg-[#2c2e2f]" 
                    indicatorClassName={getProgressColor(memoryUsage)} 
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Memory usage: {isLoading ? 'loading...' : `${memoryUsage.toFixed(1)}%`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center space-x-4">
        {/* Server info */}
        {connected && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1.5 cursor-help">
                    <Server className="h-3.5 w-3.5" />
                    <span className="font-mono">{hostname || 'Unknown'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hostname: {hostname || 'Unknown'}</p>
                  <p>Uptime: {uptime || 'Unknown'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1.5 cursor-help">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-mono">{users} user{users !== 1 ? 's' : ''}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{users} user{users !== 1 ? 's' : ''} logged in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {/* Connection status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center space-x-1.5 cursor-help ${connected ? 'text-[#3fdaa4]' : 'text-[#ec6a88]'}`}>
                <Disc className="h-3.5 w-3.5" />
                <span className="font-mono">{connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{connected ? 'SSH connection established' : 'SSH disconnected'}</p>
              {connected && <p>Ping: {ping}ms</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Time */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1.5 cursor-help">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono">{dateTime.formattedTime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{dateTime.formattedDate}</p>
              <p>Local time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}