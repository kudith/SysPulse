import sshService from "../ssh-service";
import type { Process } from "@/lib/types";

export interface SystemStats {
  cpu: {
    time: string;
    value: number;
  }[];
  memory: {
    time: string;
    value: number;
  }[];
  processes: Process[];
}

class SystemMonitoringService {
  private statsCache: SystemStats = {
    cpu: [],
    memory: [],
    processes: []
  };
  
  private listeners: Set<(data: SystemStats) => void> = new Set();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;
  private lastPollingStartTime = 0;
  private minimumPollingInterval = 5000; // 5 seconds minimum between polls
  private pollingDelay = 15000; // 15 seconds between regular polls (increased from 5s)
  
  // Command to get CPU usage (top for 1 cycle in batch mode, with CPU summary)
  private CPU_COMMAND = "top -bn1 | grep '%Cpu' | awk '{print $2}'";
  
  // Command to get memory usage percentage
  private MEMORY_COMMAND = "free | grep Mem | awk '{print ($3/$2) * 100.0}'";
  
  // Command to get process list with CPU and memory usage
  private PROCESS_COMMAND = "ps aux --sort=-%cpu | head -20";
  
  // Batch commands for efficiency
  private BATCH_COMMANDS = [
    "top -bn1 | grep '%Cpu' | awk '{print $2}'",
    "free | grep Mem | awk '{print ($3/$2) * 100.0}'",
    "ps aux --sort=-%cpu | head -20"
  ];
  
  constructor() {
    // Initialize with empty data sets
    const initialTimePoint = new Date().toLocaleTimeString();
    
    for (let i = 0; i < 20; i++) {
      this.statsCache.cpu.push({
        time: initialTimePoint,
        value: 0
      });
      
      this.statsCache.memory.push({
        time: initialTimePoint,
        value: 0
      });
    }
  }
  
  public subscribe(callback: (data: SystemStats) => void): () => void {
    this.listeners.add(callback);
    
    // Start polling if this is the first subscriber
    if (this.listeners.size === 1) {
      this.startPolling();
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      
      // Stop polling if no more subscribers
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }
  
  private notifyListeners() {
    const stats = { ...this.statsCache };
    
    this.listeners.forEach(listener => {
      try {
        listener(stats);
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }
  
  private startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    
    // Initial poll immediately
    this.pollSystemStats();
    
    // Set up regular polling interval with a longer delay (15s instead of 5s)
    this.pollingInterval = setInterval(() => {
      this.pollSystemStats();
    }, this.pollingDelay);
  }
  
  private stopPolling() {
    if (!this.isPolling) return;
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    this.isPolling = false;
  }
  
  private async pollSystemStats() {
    if (!sshService.isSSHConnected()) {
      console.warn("Cannot poll system stats: SSH not connected");
      return;
    }
    
    // Implement rate limiting to prevent too frequent polls
    const now = Date.now();
    if (now - this.lastPollingStartTime < this.minimumPollingInterval) {
      console.log(`Skipping poll: too soon (${now - this.lastPollingStartTime}ms since last poll)`);
      return;
    }
    
    this.lastPollingStartTime = now;
    
    try {
      // Use batch command execution for efficiency
      await this.fetchStatsInBatch();
      
      this.notifyListeners();
    } catch (error) {
      console.error("Error polling system stats:", error);
    }
  }
  
  private async fetchStatsInBatch() {
    try {
      // Queue commands in the batch system with low priority (non-interactive data)
      const results = await sshService.executeCommandBatch(this.BATCH_COMMANDS, 'low');
      
      // Process CPU data
      const cpuResponse = results.get(this.CPU_COMMAND);
      if (cpuResponse) {
        const cpuUsage = parseFloat(cpuResponse.trim());
        
        if (!isNaN(cpuUsage)) {
          const currentTime = new Date().toLocaleTimeString();
          
          // Add new data point
          this.statsCache.cpu.push({
            time: currentTime,
            value: cpuUsage
          });
          
          // Keep only the last 20 data points
          if (this.statsCache.cpu.length > 20) {
            this.statsCache.cpu.shift();
          }
        }
      }
      
      // Process Memory data
      const memoryResponse = results.get(this.MEMORY_COMMAND);
      if (memoryResponse) {
        const memoryUsage = parseFloat(memoryResponse.trim());
        
        if (!isNaN(memoryUsage)) {
          const currentTime = new Date().toLocaleTimeString();
          
          // Add new data point
          this.statsCache.memory.push({
            time: currentTime,
            value: memoryUsage
          });
          
          // Keep only the last 20 data points
          if (this.statsCache.memory.length > 20) {
            this.statsCache.memory.shift();
          }
        }
      }
      
      // Process Process list
      const processResponse = results.get(this.PROCESS_COMMAND);
      if (processResponse) {
        const lines = processResponse.split('\n').filter(line => line.trim() !== '');
        
        // Skip the header line
        const processes: Process[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Parse ps aux output format
          const parts = line.split(/\s+/);
          
          if (parts.length >= 11) {
            const user = parts[0];
            const pid = parseInt(parts[1]);
            const cpu = parseFloat(parts[2]);
            const memory = parseFloat(parts[3]);
            // Join remaining parts as the command
            const command = parts.slice(10).join(' ');
            
            if (!isNaN(pid) && !isNaN(cpu) && !isNaN(memory)) {
              processes.push({
                pid,
                user,
                command,
                cpu,
                memory,
                status: 'running'
              });
            }
          }
        }
        
        // Update the processes list
        this.statsCache.processes = processes;
      }
    } catch (error) {
      console.error("Error fetching stats in batch:", error);
      
      // If batch fails, we could try individual fetches as fallback
      // but for now we'll just throw to be handled by caller
      throw error;
    }
  }
  
  // Legacy methods using individual commands - kept for backward compatibility
  private async fetchCpuStats() {
    try {
      // Use low priority for monitoring commands
      const response = await sshService.executeCommand(this.CPU_COMMAND, { 
        priority: 'low',
        retry: 1,
        retryDelay: 1000
      });
      
      const cpuUsage = parseFloat(response.trim());
      
      if (!isNaN(cpuUsage)) {
        const currentTime = new Date().toLocaleTimeString();
        
        // Add new data point
        this.statsCache.cpu.push({
          time: currentTime,
          value: cpuUsage
        });
        
        // Keep only the last 20 data points
        if (this.statsCache.cpu.length > 20) {
          this.statsCache.cpu.shift();
        }
      }
    } catch (error) {
      console.error("Error fetching CPU stats:", error);
    }
  }
  
  private async fetchMemoryStats() {
    try {
      // Use low priority for monitoring commands
      const response = await sshService.executeCommand(this.MEMORY_COMMAND, { 
        priority: 'low',
        retry: 1,
        retryDelay: 1000
      });
      
      const memoryUsage = parseFloat(response.trim());
      
      if (!isNaN(memoryUsage)) {
        const currentTime = new Date().toLocaleTimeString();
        
        // Add new data point
        this.statsCache.memory.push({
          time: currentTime,
          value: memoryUsage
        });
        
        // Keep only the last 20 data points
        if (this.statsCache.memory.length > 20) {
          this.statsCache.memory.shift();
        }
      }
    } catch (error) {
      console.error("Error fetching memory stats:", error);
    }
  }
  
  private async fetchProcessList() {
    try {
      // Use low priority for monitoring commands
      const response = await sshService.executeCommand(this.PROCESS_COMMAND, { 
        priority: 'low',
        retry: 1,
        retryDelay: 1000
      });
      
      const lines = response.split('\n').filter(line => line.trim() !== '');
      
      // Skip the header line
      const processes: Process[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse ps aux output format
        const parts = line.split(/\s+/);
        
        if (parts.length >= 11) {
          const user = parts[0];
          const pid = parseInt(parts[1]);
          const cpu = parseFloat(parts[2]);
          const memory = parseFloat(parts[3]);
          // Join remaining parts as the command
          const command = parts.slice(10).join(' ');
          
          if (!isNaN(pid) && !isNaN(cpu) && !isNaN(memory)) {
            processes.push({
              pid,
              user,
              command,
              cpu,
              memory,
              status: 'running'
            });
          }
        }
      }
      
      // Update the processes list
      this.statsCache.processes = processes;
    } catch (error) {
      console.error("Error fetching process list:", error);
    }
  }
  
  // Method to get the current cached stats without polling
  public getCurrentStats(): SystemStats {
    return { ...this.statsCache };
  }
  
  // Force an immediate refresh with rate limiting
  public async refreshStats(): Promise<SystemStats> {
    const now = Date.now();
    // Only allow refresh if enough time has passed since last poll
    if (now - this.lastPollingStartTime >= this.minimumPollingInterval) {
      await this.pollSystemStats();
    } else {
      console.log(`Refresh throttled: ${now - this.lastPollingStartTime}ms since last poll`);
    }
    return { ...this.statsCache };
  }
  
  // Check if we're currently polling
  public isActive(): boolean {
    return this.isPolling;
  }
  
  // Get number of subscribers
  public getSubscriberCount(): number {
    return this.listeners.size;
  }
}

const systemMonitoring = new SystemMonitoringService();
export default systemMonitoring;