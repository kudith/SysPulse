import sshService from "../ssh-service";
import type { Process } from "@/lib/types";

export type StatPoint = {
  time: string; // Using string instead of Date to be compatible with existing code
  value: number;
};

export type SystemStats = {
  cpu: StatPoint[];
  memory: StatPoint[];
  disk: StatPoint[];
  uptime: number;
  processes: Process[]; // Keep Process[] type as per existing code
  users: number;
  hostname: string;
};

class SystemMonitoringService {
  private statsCache: SystemStats = {
    cpu: [],
    memory: [],
    disk: [],
    uptime: 0,
    processes: [],
    users: 0,
    hostname: ''
  };
  
  private listeners: Set<(data: SystemStats) => void> = new Set();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;
  private lastPollingStartTime = 0;
  private minimumPollingInterval = 2000; // Reduced from 5s to 2s for more responsive updates
  private pollingDelay = 5000; // 5 seconds between regular polls (decreased from 15s for more real-time feel)
  private lastUpdateTime = 0;
  private isFetching = false;
  private forceRefreshQueued = false;
  private MAX_POINTS = 60;
  
  // Command to get CPU usage (top for 1 cycle in batch mode, with CPU summary)
  private CPU_COMMAND = "top -bn1 | grep '%Cpu' | awk '{print $2}'";
  
  // Command to get memory usage percentage
  private MEMORY_COMMAND = "free | grep Mem | awk '{print ($3/$2) * 100.0}'";
  
  // Command to get disk usage percentage
  private DISK_COMMAND = "df -h / | awk 'NR==2 {print $5}' | tr -d '%'";
  
  // Command to get uptime in seconds
  private UPTIME_COMMAND = "cat /proc/uptime | awk '{print $1}'";
  
  // Command to get users count
  private USERS_COMMAND = "who | wc -l";
  
  // Command to get hostname
  private HOSTNAME_COMMAND = "hostname";
  
  // Command to get process list with CPU and memory usage
  private PROCESS_COMMAND = "ps aux --sort=-%cpu | head -20";
  
  // Batch commands for efficiency
  private BATCH_COMMANDS = [
    "top -bn1 | grep '%Cpu' | awk '{print $2}'",
    "free | grep Mem | awk '{print ($3/$2) * 100.0}'",
    "df -h / | awk 'NR==2 {print $5}' | tr -d '%'",
    "cat /proc/uptime | awk '{print $1}'",
    "who | wc -l",
    "hostname",
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
      
      this.statsCache.disk.push({
        time: initialTimePoint,
        value: 0
      });
    }
    
    // Add connection state listener to automatically refresh when connected
    if (typeof window !== 'undefined') {
      sshService.onConnected((message: string) => {
        console.log("[SystemMonitoringService] SSH connected, refreshing stats");
        this.refreshStats();
        
        // Start polling if we have listeners
        if (this.listeners.size > 0 && !this.isPolling) {
          this.startPolling();
        }
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
    const now = Date.now();
    this.lastUpdateTime = now;
    
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
    
    if (!sshService.isSSHConnected()) {
      console.log("[SystemMonitoringService] Not starting polling: SSH not connected");
      return;
    }
    
    console.log("[SystemMonitoringService] Starting polling");
    this.isPolling = true;
    
    // Initial poll immediately
    this.pollSystemStats();
    
    // Set up regular polling interval with a more frequent update
    this.pollingInterval = setInterval(() => {
      this.pollSystemStats();
    }, this.pollingDelay);
  }
  
  private stopPolling() {
    if (!this.isPolling) return;
    
    console.log("[SystemMonitoringService] Stopping polling");
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    this.isPolling = false;
  }
  
  private async pollSystemStats() {
    if (!sshService.isSSHConnected()) {
      console.warn("[SystemMonitoringService] Cannot poll system stats: SSH not connected");
      this.stopPolling();
      return;
    }
    
    // If already fetching data, queue a refresh for when it's done
    if (this.isFetching) {
      this.forceRefreshQueued = true;
      return;
    }
    
    // Implement rate limiting to prevent too frequent polls
    const now = Date.now();
    if (now - this.lastPollingStartTime < this.minimumPollingInterval) {
      console.log(`[SystemMonitoringService] Skipping poll: too soon (${now - this.lastPollingStartTime}ms since last poll)`);
      return;
    }
    
    this.lastPollingStartTime = now;
    
    try {
      this.isFetching = true;
      // Use batch command execution for efficiency
      await this.fetchStatsInBatch();
      
      this.notifyListeners();
    } catch (error) {
      console.error("[SystemMonitoringService] Error polling system stats:", error);
    } finally {
      this.isFetching = false;
      
      // If a refresh was queued while we were fetching, do it now
      if (this.forceRefreshQueued) {
        this.forceRefreshQueued = false;
        setTimeout(() => this.pollSystemStats(), 100);
      }
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
      
      // Process Disk data
      const diskResponse = results.get(this.DISK_COMMAND);
      if (diskResponse) {
        const diskUsage = parseFloat(diskResponse.trim());
        
        if (!isNaN(diskUsage)) {
          const currentTime = new Date().toLocaleTimeString();
          
          // Add new data point
          this.statsCache.disk.push({
            time: currentTime,
            value: diskUsage
          });
          
          // Keep only the last 20 data points
          if (this.statsCache.disk.length > 20) {
            this.statsCache.disk.shift();
          }
        }
      }
      
      // Process uptime
      const uptimeResponse = results.get(this.UPTIME_COMMAND);
      if (uptimeResponse) {
        this.statsCache.uptime = Math.floor(parseFloat(uptimeResponse.trim()));
      }
      
      // Process users count
      const usersResponse = results.get(this.USERS_COMMAND);
      if (usersResponse) {
        this.statsCache.users = parseInt(usersResponse.trim(), 10);
      }
      
      // Process hostname
      const hostnameResponse = results.get(this.HOSTNAME_COMMAND);
      if (hostnameResponse) {
        this.statsCache.hostname = hostnameResponse.trim();
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
      console.error("[SystemMonitoringService] Error fetching stats in batch:", error);
      
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
      console.error('Error fetching CPU stats:', error);
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
      console.error('Error fetching memory stats:', error);
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
      console.error('Error fetching process list:', error);
    }
  }
  
  // Public API
  public getCurrentStats(): SystemStats {
    return { ...this.statsCache };
  }
  
  public async refreshStats(): Promise<SystemStats> {
    if (!sshService.isSSHConnected()) {
      console.warn("[SystemMonitoringService] Cannot refresh stats: SSH not connected");
      return this.statsCache;
    }
    
    // If already fetching, wait until it's done and then get the latest stats
    if (this.isFetching) {
      this.forceRefreshQueued = true;
      return this.statsCache;
    }
    
    try {
      await this.pollSystemStats();
      return { ...this.statsCache };
    } catch (error) {
      console.error("[SystemMonitoringService] Error refreshing stats:", error);
      return this.statsCache;
    }
  }
  
  public isActive(): boolean {
    return this.isPolling;
  }
  
  public getSubscriberCount(): number {
    return this.listeners.size;
  }
  
  // Get the time of the last successful update
  public getLastUpdateTime(): number {
    return this.lastUpdateTime;
  }
  
  // Force restart polling if it should be running but isn't
  public ensurePollingActive(): void {
    if (this.listeners.size > 0 && !this.isPolling && sshService.isSSHConnected()) {
      console.log("[SystemMonitoringService] Restarting polling");
      this.startPolling();
    }
  }
}

// Create a singleton instance
const systemMonitoring = new SystemMonitoringService();

// Export the singleton
export default systemMonitoring;