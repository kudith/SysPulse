import { io, Socket } from "socket.io-client";
import { Terminal } from "xterm";

interface SSHConfig {
  host: string;
  port: number;
  username: string;
  privateKey: string;
  passphrase?: string;
}

// Command execution options with configurable timeout
interface CommandOptions {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  stream?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

// Default command options
const DEFAULT_COMMAND_OPTIONS: CommandOptions = {
  timeout: 60000,    // 60 seconds default timeout
  retry: 2,          // 2 retries
  retryDelay: 1000,  // 1 second between retries
  stream: false,     // No streaming by default
  priority: 'normal' // Normal priority
};

/**
 * Command batch manager - efficiently handles commands in batches
 */
class CommandBatchManager {
  private highPriorityQueue: string[] = [];
  private normalPriorityQueue: string[] = [];
  private lowPriorityQueue: string[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private batchInterval: number = 50;
  private maxBatchSize: number = 5;
  private processing: boolean = false;
  private lastBatchTime: number = 0;
  private socket: Socket | null = null;
  private persistentId: string | null = null;
  
  constructor(
    socket: Socket | null,
    getPersistentId: () => string | null,
    private onResponse: (results: Map<string, string>) => void,
    private onError: (error: Error) => void
  ) {
    this.socket = socket;
    this.persistentId = getPersistentId();
  }
  
  public updateSocket(socket: Socket | null): void {
    this.socket = socket;
  }
  
  public updatePersistentId(id: string | null): void {
    this.persistentId = id;
  }
  
  public queueCommand(command: string, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    switch (priority) {
      case 'high':
        this.highPriorityQueue.push(command);
        break;
      case 'low':
        this.lowPriorityQueue.push(command);
        break;
      default:
        this.normalPriorityQueue.push(command);
        break;
    }
    
    this.scheduleBatch();
  }
  
  private scheduleBatch(): void {
    // If already processing or timer is set, don't schedule another one
    if (this.processing || this.batchTimer) {
      return;
    }
    
    // Determine how long to wait before processing
    const now = Date.now();
    const timeSinceLastBatch = now - this.lastBatchTime;
    const waitTime = Math.max(0, this.batchInterval - timeSinceLastBatch);
    
    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, waitTime);
  }
  
  private processBatch(): void {
    if (!this.socket || !this.socket.connected || this.processing) {
      this.batchTimer = null;
      return;
    }
    
    this.processing = true;
    this.batchTimer = null;
    this.lastBatchTime = Date.now();
    
    // Create batch from queues, prioritizing high > normal > low
    let batch: string[] = [];
    
    // First take high priority items
    while (batch.length < this.maxBatchSize && this.highPriorityQueue.length > 0) {
      batch.push(this.highPriorityQueue.shift()!);
    }
    
    // Then normal priority
    while (batch.length < this.maxBatchSize && this.normalPriorityQueue.length > 0) {
      batch.push(this.normalPriorityQueue.shift()!);
    }
    
    // Finally low priority
    while (batch.length < this.maxBatchSize && this.lowPriorityQueue.length > 0) {
      batch.push(this.lowPriorityQueue.shift()!);
    }
    
    // If we have commands to process
    if (batch.length > 0) {
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Send the batch
      this.socket.emit("ssh-execute-batch", {
        commands: batch,
        batchId,
        sessionId: this.persistentId
      });
      
      // Set timeout for batch response
      const timeoutHandle = setTimeout(() => {
        console.error(`[CommandBatchManager] Batch ${batchId} timed out`);
        this.processing = false;
        this.onError(new Error(`Batch execution timed out for ${batch.length} commands`));
        
        // Process next batch if there are pending commands
        if (this.hasQueuedCommands()) {
          this.scheduleBatch();
        }
      }, 30000); // 30 second timeout
      
      // Listen for batch response
      const handleBatchResult = (data: { batchId: string, results: Array<{command: string, output: string, error?: string}> }) => {
        if (data.batchId === batchId) {
          clearTimeout(timeoutHandle);
          this.socket?.off("command-batch-result", handleBatchResult);
          
          // Process results
          const resultMap = new Map<string, string>();
          let hasErrors = false;
          
          data.results.forEach(result => {
            if (!result.error) {
              resultMap.set(result.command, result.output);
            } else {
              console.warn(`[CommandBatchManager] Command error: ${result.command} - ${result.error}`);
              hasErrors = true;
            }
          });
          
          if (resultMap.size > 0) {
            this.onResponse(resultMap);
          }
          
          if (hasErrors) {
            this.onError(new Error(`Some commands in batch failed`));
          }
          
          // Continue processing
          this.processing = false;
          
          // If we have more commands or new commands arrived during processing, schedule next batch
          if (this.hasQueuedCommands()) {
            this.scheduleBatch();
          }
        }
      };
      
      this.socket.on("command-batch-result", handleBatchResult);
    } else {
      this.processing = false;
    }
  }
  
  public hasQueuedCommands(): boolean {
    return this.highPriorityQueue.length > 0 || 
           this.normalPriorityQueue.length > 0 || 
           this.lowPriorityQueue.length > 0;
  }
  
  public getQueueStatus(): { high: number, normal: number, low: number, total: number } {
    return {
      high: this.highPriorityQueue.length,
      normal: this.normalPriorityQueue.length,
      low: this.lowPriorityQueue.length,
      total: this.highPriorityQueue.length + this.normalPriorityQueue.length + this.lowPriorityQueue.length
    };
  }
  
  public clear(): void {
    this.highPriorityQueue = [];
    this.normalPriorityQueue = [];
    this.lowPriorityQueue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    this.processing = false;
  }
}

class SSHService {
  private socket: Socket | null = null;
  private terminal: Terminal | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private initialResizeSent: boolean = false;
  private persistentId: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private backoffTime: number = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();
  private connectionConfig: SSHConfig | null = null;
  private commandQueue: Array<{id: string, resolve: Function, reject: Function, timeout: NodeJS.Timeout}> = [];
  private dataBuffer: string = '';
  private dataTimeout: NodeJS.Timeout | null = null;
  private dataBufferMaxTime: number = 16; // ms (approx 1 frame at 60FPS)
  private connectionRetryBackoff: number = 0;
  
  // Enhanced command batch manager
  private batchManager: CommandBatchManager;

  // Event callbacks
  private onConnectedCallback: ((message: string) => void) | null = null;
  private onDataCallback: ((data: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onDisconnectedCallback: ((message: string) => void) | null = null;
  private debugMode: boolean = false;

  constructor() {
    // Initialize the batch manager
    this.batchManager = new CommandBatchManager(
      this.socket,
      () => this.persistentId,
      this.handleBatchResults.bind(this),
      this.handleBatchError.bind(this)
    );
    
    // Check for existing connection state
    if (typeof window !== "undefined") {
      this.persistentId = sessionStorage.getItem("ssh_persistent_id");
      const connectedState = sessionStorage.getItem("ssh_connected_state");
      this.isConnected = connectedState === "true";

      // Store last config if it exists
      const savedConfig = sessionStorage.getItem("ssh_connection_config");
      if (savedConfig) {
        try {
          this.connectionConfig = JSON.parse(savedConfig);
        } catch (e) {
          console.error("[SSH Service] Failed to parse saved config");
          sessionStorage.removeItem("ssh_connection_config");
        }
      }
      
      // Check for debug mode
      this.debugMode = localStorage.getItem("ssh_debug_mode") === "true";
    }

    this.initSocket();

    // Setup page unload handler to detect when page is actually closed vs refreshed
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", (event) => {
        // Only if the user is actually closing the browser/tab, not refreshing
        if (event.persisted === false) {
          this.cleanup();
        }
      });
      
      // Register visibility change handler to reconnect when tab becomes visible
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && this.isConnected && (!this.socket || !this.socket.connected)) {
          console.log("[SSH Service] Page became visible, checking connection...");
          this.checkConnectionStatus();
        }
      });
    }
    
    // Setup heartbeat to keep connections alive
    this.startHeartbeat();
  }
  
  private logDebug(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(`[SSH Debug] ${message}`, ...args);
    }
  }

  private initSocket() {
    try {
      // Connect to the WebSocket server with environment-specific URL
      const socketUrl =
        process.env.NODE_ENV === "production"
          ? process.env.SSH_SERVER_URL
          : "http://localhost:3001";

      console.log(
        `[SSH Service] Connecting to WebSocket server at ${socketUrl}`
      );

      // Close existing socket if any
      if (this.socket) {
        this.socket.disconnect();
      }

      // Enhanced socketio configuration for better performance
      this.socket = io(socketUrl, {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        timeout: 45000,              // Increased timeout
        transports: ["websocket"],   // Use websocket only for better performance
        forceNew: false,             // Allow reuse of existing connection
        upgrade: true,               // Allow transport upgrade
        rememberUpgrade: true,       // Remember successful upgrades
        perMessageDeflate: true,     // Enable compression
        pingTimeout: 30000,          // Increase ping timeout
        pingInterval: 15000,         // More frequent pings
        autoConnect: true,           // Auto connect socket
        // If we have a persistent ID, use it to reconnect to the same session
        auth: this.persistentId
          ? {
              sessionId: this.persistentId,
            }
          : undefined,
      });
      
      // Update the batch manager's socket reference
      this.batchManager.updateSocket(this.socket);

      // Setup event listeners
      this.socket.on("connect", () => {
        console.log(
          `[SSH Service] WebSocket connected to server (socket ID: ${this.socket?.id})`
        );

        // Reset reconnection attempts on successful connection
        this.reconnectAttempts = 0;
        this.connectionRetryBackoff = 0;
        
        // If we have a persistent ID, check if the connection still exists on the server
        if (this.persistentId) {
          console.log(`[SSH Service] Checking existing session with ID: ${this.persistentId}`);
          this.socket?.emit("ssh-check-connection", {
            sessionId: this.persistentId,
          });
        } 
        // If we were previously connected but have no persistent ID, try to reconnect
        else if (this.isConnected && this.connectionConfig) {
          console.log("[SSH Service] Attempting to restore previous connection");
          this.connect(this.connectionConfig);
        }
      });

      this.socket.on("connect_error", (error) => {
        console.error("[SSH Service] WebSocket connection error:", error);
        this.handleConnectionRetry();
      });

      // Ensure shell session is restarted after reconnect
      this.socket.on("ssh-connected", (data) => {
        this.isConnected = true;
        this.isConnecting = false;
        this.lastActivityTime = Date.now();
        console.log("[SSH Service] SSH connection established:", data.message);

        if (data.sessionId) {
          this.persistentId = data.sessionId;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("ssh_persistent_id", data.sessionId);
            sessionStorage.setItem("ssh_connected_state", "true");
          }
          
          // Update batch manager with new session ID
          this.batchManager.updatePersistentId(data.sessionId);
        }

        // Send initial resize if terminal dimensions are available
        this.sendInitialResize();

        if (this.onConnectedCallback) {
          this.onConnectedCallback(data.message);
        }
      });

      this.socket.on("ssh-connection-exists", (data) => {
        this.isConnected = true;
        this.isConnecting = false;
        this.lastActivityTime = Date.now();
        console.log(
          "[SSH Service] Reconnected to existing SSH session:",
          data.message
        );

        if (data.sessionId && !this.persistentId) {
          this.persistentId = data.sessionId;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("ssh_persistent_id", data.sessionId);
            sessionStorage.setItem("ssh_connected_state", "true");
          }
          
          // Update batch manager with session ID
          this.batchManager.updatePersistentId(data.sessionId);
        }

        // Send initial resize if terminal dimensions are available
        this.sendInitialResize();

        if (this.onConnectedCallback) {
          this.onConnectedCallback("Reconnected to existing session");
        }
      });

      this.socket.on("ssh-data", (data) => {
        this.lastActivityTime = Date.now();
        
        if (!data) return;
        
        // Improved data buffering
        this.dataBuffer += data;
        
        // Clear any existing timeout
        if (this.dataTimeout) {
          clearTimeout(this.dataTimeout);
        }
        
        // For small data chunks, process immediately
        // For large data chunks, buffer and process after a short delay
        if (data.length < 1024) {
          this.processDataBuffer();
        } else {
          // Use a minimal delay that won't block UI rendering
          this.dataTimeout = setTimeout(() => this.processDataBuffer(), this.dataBufferMaxTime);
        }
      });
      
      // Process and render buffered data
      this.socket.on("ssh-heartbeat", () => {
        // Process any pending data in buffer on heartbeat
        if (this.dataBuffer.length > 0) {
          this.processDataBuffer();
        }
        
        this.lastActivityTime = Date.now();
      });

      this.socket.on("ssh-error", (data) => {
        this.isConnecting = false;
        this.lastActivityTime = Date.now();
        console.error("[SSH Service] SSH error:", data.message);

        // Check for authentication-related errors that might indicate a persistent problem
        if (
          data.message?.includes("Authentication failed") ||
          data.message?.includes("auth methods") ||
          data.message?.includes("no valid auth")
        ) {
          console.error("[SSH Service] Authentication error detected, clearing persistent state");
          this.clearPersistentState();
        }

        if (this.onErrorCallback) {
          this.onErrorCallback(data.message);
        }
        
        // Add visual error indicator to terminal
        if (this.terminal) {
          this.terminal.writeln(`\r\n\x1b[1;31m[Error] ${data.message}\x1b[0m\r\n`);
        }
      });

      this.socket.on("ssh-error-data", (data) => {
        this.lastActivityTime = Date.now();
        // Pass error data to terminal (usually displayed in red)
        if (this.terminal && data) {
          console.log(`[SSH Service] Received SSH error data: ${data.substring(0, 100)}...`);
          this.terminal.write(`\x1b[31m${data}\x1b[0m`);  // Ensure error text is red
        }

        if (this.onErrorCallback && data) {
          this.onErrorCallback(data);
        }
      });

      this.socket.on("ssh-closed", (data) => {
        this.isConnected = false;
        this.isConnecting = false;
        this.initialResizeSent = false;
        this.lastActivityTime = Date.now();
        
        // Force process any remaining data in buffer
        this.processDataBuffer();
        
        // Only clear persistent state for normal closures
        if (!data.message?.includes("reconnect")) {
          this.clearPersistentState();
        }
        
        console.log("[SSH Service] SSH connection closed:", data.message);

        // Show message in terminal
        if (this.terminal) {
          this.terminal.writeln(`\r\n\x1b[1;33m[Closed] ${data.message || "Connection closed"}\x1b[0m\r\n`);
        }

        if (this.onDisconnectedCallback) {
          this.onDisconnectedCallback(data.message);
        }
      });

      this.socket.on("ssh-ended", (data) => {
        this.isConnected = false;
        this.isConnecting = false;
        this.initialResizeSent = false;
        this.lastActivityTime = Date.now();
        
        // Force process any remaining data in buffer
        this.processDataBuffer();
        
        this.clearPersistentState();
        console.log("[SSH Service] SSH connection ended:", data.message);

        // Show message in terminal
        if (this.terminal) {
          this.terminal.writeln(`\r\n\x1b[1;33m[Ended] ${data.message || "Connection ended"}\x1b[0m\r\n`);
        }

        if (this.onDisconnectedCallback) {
          this.onDisconnectedCallback(data.message);
        }
      });

      // Handle command results with reliable delivery
      this.socket.on("command-result", (data: { executionId: string, output: string, error?: string, partial?: boolean }) => {
        this.lastActivityTime = Date.now();
        
        // Find the command in the queue
        const commandItem = this.commandQueue.find(item => item.id === data.executionId);
        if (!commandItem) {
          console.warn(`[SSH Service] Received result for unknown command ID: ${data.executionId}`);
          return;
        }
        
        // If it's a partial response (for streaming), don't resolve yet
        if (data.partial) {
          // If user provided an onData callback, we could call it here
          return;
        }
        
        // Remove the command from the queue
        this.commandQueue = this.commandQueue.filter(item => item.id !== data.executionId);
        
        // Clear the timeout
        if (commandItem.timeout) {
          clearTimeout(commandItem.timeout);
        }
        
        // Resolve or reject based on the response
        if (data.error) {
          commandItem.reject(new Error(data.error));
        } else {
          commandItem.resolve(data.output || "");
        }
      });
      
      // Handle batch command results
      this.socket.on("command-batch-result", (data: { batchId: string, results: Array<{command: string, output: string, error?: string}> }) => {
        this.lastActivityTime = Date.now();
        // Handled by batch manager
      });

      this.socket.on("disconnect", (reason) => {
        this.isConnecting = false;
        this.initialResizeSent = false;
        this.lastActivityTime = Date.now();
        console.log(`[SSH Service] WebSocket disconnected from server: ${reason}`);

        // Show message in terminal
        if (this.terminal) {
          this.terminal.writeln(`\r\n\x1b[1;33m[Disconnected] WebSocket connection lost (${reason})\x1b[0m\r\n`);
        }

        // For certain disconnect reasons, attempt reconnection
        if (reason === "io server disconnect" || reason === "transport close" || reason === "ping timeout") {
          this.handleConnectionRetry();
        }

        if (this.onDisconnectedCallback && !this.isConnected) {
          this.onDisconnectedCallback(`WebSocket connection lost: ${reason}`);
        }
      });

      this.socket.io.on("reconnect", (attempt) => {
        console.log(`[SSH Service] Socket.IO reconnected after ${attempt} attempts`);
        
        // Show message in terminal
        if (this.terminal) {
          this.terminal.writeln(`\r\n\x1b[1;32m[Reconnected] Socket connection restored\x1b[0m\r\n`);
        }
        
        // Update batch manager with new socket
        this.batchManager.updateSocket(this.socket);
        
        // Check connection status after reconnection
        this.checkConnectionStatus();
      });
      
      this.socket.io.on("reconnect_attempt", (attempt) => {
        console.log(`[SSH Service] Socket.IO reconnection attempt: ${attempt}`);
      });
      
      this.socket.io.on("reconnect_error", (error) => {
        console.error(`[SSH Service] Socket.IO reconnection error:`, error);
      });
      
      this.socket.io.on("reconnect_failed", () => {
        console.error(`[SSH Service] Socket.IO reconnection failed after max attempts`);
        
        // Show message in terminal
        if (this.terminal) {
          this.terminal.writeln(`\r\n\x1b[1;31m[Error] Reconnection failed after maximum attempts\x1b[0m\r\n`);
        }
        
        // Clear connection state since we failed to reconnect
        this.clearPersistentState();
      });
    } catch (err) {
      console.error("[SSH Service] Error initializing socket:", err);
    }
  }
  
  // Process and render buffered terminal data efficiently
  private processDataBuffer(): void {
    if (this.dataTimeout) {
      clearTimeout(this.dataTimeout);
      this.dataTimeout = null;
    }
    
    if (this.dataBuffer.length > 0) {
      this.logDebug(`Processing ${this.dataBuffer.length} bytes of buffered data`);
      
      // Send data to terminal
      if (this.terminal) {
        try {
          this.terminal.write(this.dataBuffer);
        } catch (err) {
          console.error("[SSH Service] Error writing to terminal:", err);
        }
      }
      
      // Call the data callback if registered
      if (this.onDataCallback) {
        try {
          this.onDataCallback(this.dataBuffer);
        } catch (err) {
          console.error("[SSH Service] Error in data callback:", err);
        }
      }
      
      // Clear the buffer
      this.dataBuffer = '';
    }
  }
  
  // Handle command batch responses
  private handleBatchResults(results: Map<string, string>): void {
    // Nothing to do here - individual services will handle their own responses
    // The batch manager handles the Socket.io event directly
    this.lastActivityTime = Date.now();
  }
  
  // Handle command batch errors
  private handleBatchError(error: Error): void {
    console.error("[SSH Service] Batch execution error:", error.message);
    // No need to call error callback here, as individual commands will handle their own errors
  }
  
  // Handle connection retry with exponential backoff
  private handleConnectionRetry(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[SSH Service] Maximum reconnect attempts reached, giving up");
      
      // Show message in terminal
      if (this.terminal) {
        this.terminal.writeln("\r\n\x1b[1;31m[Error] Maximum reconnect attempts reached. Please refresh the page to try again.\x1b[0m\r\n");
      }
      
      // Clear connection state
      this.clearPersistentState();
      return;
    }
    
    // Calculate backoff time with jitter
    const delay = this.backoffTime * Math.pow(1.5, this.reconnectAttempts) + Math.random() * 1000;
    console.log(`[SSH Service] Will attempt reconnect in ${Math.round(delay/1000)}s (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    // Show message in terminal
    if (this.terminal) {
      this.terminal.writeln(`\r\n\x1b[1;33m[Info] Reconnect attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts} in ${Math.round(delay/1000)} seconds...\x1b[0m\r\n`);
    }
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.reconnectTimer = null;
      this.initSocket();
    }, delay);
  }
  
  // Start heartbeat to detect connection issues
  private startHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.pingInterval = setInterval(() => {
      // If we're connected, check that we've had activity recently
      if (this.isConnected && this.socket?.connected) {
        const timeSinceLastActivity = Date.now() - this.lastActivityTime;
        
        // If no activity for 30 seconds, send a ping
        if (timeSinceLastActivity > 30000) {
          console.log("[SSH Service] No recent activity, sending ping");
          
          // Use socket.io ping to check connection
          this.socket.emit("ping", () => {
            console.log("[SSH Service] Ping successful");
            this.lastActivityTime = Date.now();
          });
          
          // If connection config is available, try refreshing the session
          if (timeSinceLastActivity > 60000 && this.connectionConfig) {
            console.log("[SSH Service] Long inactivity period, refreshing session");
            this.refreshConnection();
          }
        }
        
        // Process any pending data
        if (this.dataBuffer.length > 0) {
          this.processDataBuffer();
        }
      }
    }, 10000); // Check every 10 seconds
  }

  // Check connection status with the server
  private checkConnectionStatus(): void {
    if (!this.socket || !this.socket.connected) {
      console.log("[SSH Service] Socket not connected, reconnecting...");
      this.initSocket();
      return;
    }
    
    if (this.persistentId) {
      console.log("[SSH Service] Checking connection status for session:", this.persistentId);
      this.socket.emit("ssh-check-connection", { sessionId: this.persistentId });
    } else if (this.isConnected && this.connectionConfig) {
      console.log("[SSH Service] No session ID but was connected, reconnecting...");
      this.connect(this.connectionConfig);
    } else {
      console.log("[SSH Service] No active session to check");
    }
  }

  // Clear pending command queue
  private clearCommandQueue(error: string): void {
    // Reject all pending commands
    this.commandQueue.forEach(item => {
      clearTimeout(item.timeout);
      item.reject(new Error(error));
    });
    this.commandQueue = [];
    
    // Clear batch manager
    this.batchManager.clear();
    
    if (this.dataTimeout) {
      clearTimeout(this.dataTimeout);
      this.dataTimeout = null;
    }
    
    // Process any remaining data
    if (this.dataBuffer.length > 0) {
      this.processDataBuffer();
    }
  }

  // Clear persistent connection state
  private clearPersistentState(): void {
    this.persistentId = null;
    this.isConnected = false;
    
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ssh_persistent_id");
      sessionStorage.removeItem("ssh_connected_state");
    }
    
    // Clear any pending commands
    this.clearCommandQueue("Connection terminated");
    
    // Update batch manager
    this.batchManager.updatePersistentId(null);
  }

  // Send initial resize after connection
  private sendInitialResize(): void {
    if (!this.terminal || !this.isConnected) {
      console.log(
        "[SSH Service] Terminal or connection not ready for initial resize"
      );
      return;
    }

    try {
      const cols = this.terminal.cols;
      const rows = this.terminal.rows;

      if (cols > 0 && rows > 0) {
        console.log(
          `[SSH Service] Sending initial terminal size: ${cols}x${rows}`
        );
        this.resize(cols, rows);
        this.initialResizeSent = true;
      } else {
        // Try again later if dimensions are not available yet
        console.log(
          "[SSH Service] Invalid terminal dimensions, retrying in 1s..."
        );
        setTimeout(() => this.sendInitialResize(), 1000);
      }
    } catch (err) {
      console.error("[SSH Service] Error during initial resize:", err);
    }
  }

  // Connect to SSH server
  public connect(config: SSHConfig): void {
    if (!this.socket) {
      this.initSocket();
    }

    if (!this.socket) {
      throw new Error("WebSocket not initialized");
    }

    this.isConnecting = true;
    this.connectionConfig = config; // Store the config for potential reconnection
    
    // Save connection config for potential page reload
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ssh_connection_config", JSON.stringify(config));
    }
    
    console.log(
      `[SSH Service] Attempting to connect to SSH server: ${config.username}@${config.host}:${config.port}`
    );

    // If terminal is available, show connecting message
    if (this.terminal) {
      this.terminal.writeln(`\r\n\x1b[1;33m[Connecting] Establishing SSH connection to ${config.username}@${config.host}:${config.port}...\x1b[0m\r\n`);
    }

    this.socket.emit("ssh-connect", config);
  }

  // Disconnect from SSH server
  public disconnect(): void {
    if (this.socket) {
      this.socket.emit("ssh-disconnect");
      this.isConnected = false;
      this.isConnecting = false;
      this.initialResizeSent = false;
      this.clearPersistentState();
      
      // Process any remaining data
      if (this.dataBuffer.length > 0) {
        this.processDataBuffer();
      }
      
      // Remove saved connection config
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("ssh_connection_config");
      }
      this.connectionConfig = null;
      
      console.log("[SSH Service] Disconnecting from SSH server");
      
      // If terminal is available, show disconnected message
      if (this.terminal) {
        this.terminal.writeln("\r\n\x1b[1;33m[Disconnected] SSH connection closed by user\x1b[0m\r\n");
      }
    }
  }

  // Send data to SSH server
  public sendData(data: string): void {
    if (!this.isConnected || !this.socket) {
      console.warn(
        "[SSH Service] Cannot send data: not connected to SSH server"
      );
      return;
    }
    
    this.lastActivityTime = Date.now();
    this.socket.emit("ssh-input", data);
  }

  // Resize terminal dimensions
  public resize(cols: number, rows: number): void {
    if (!this.isConnected || !this.socket) {
      console.warn("[SSH Service] Cannot resize: not connected to SSH server");
      return;
    }

    if (
      !cols ||
      !rows ||
      isNaN(cols) ||
      isNaN(rows) ||
      cols <= 0 ||
      rows <= 0
    ) {
      console.warn(
        `[SSH Service] Invalid terminal dimensions: cols=${cols}, rows=${rows}`
      );
      return;
    }

    this.lastActivityTime = Date.now();
    console.log(`[SSH Service] Resizing terminal to ${cols}x${rows}`);
    this.socket.emit("ssh-resize", { cols, rows });
  }

  // Set the terminal instance
  public setTerminal(terminal: Terminal | null): void {
    this.terminal = terminal;
    console.log("[SSH Service] Terminal instance set");

    // If already connected, try to send the resize immediately
    if (this.isConnected && !this.initialResizeSent && terminal) {
      // Give the terminal a moment to initialize
      setTimeout(() => this.sendInitialResize(), 500);
    }
  }

  // Event handlers
  public onConnected(callback: (message: string) => void): void {
    this.onConnectedCallback = callback;
  }

  public onData(callback: (data: string) => void): void {
    this.onDataCallback = callback;
  }

  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  public onDisconnected(callback: (message: string) => void): void {
    this.onDisconnectedCallback = callback;
  }

  // Check connection status
  public isSSHConnected(): boolean {
    return this.isConnected;
  }

  public isSSHConnecting(): boolean {
    return this.isConnecting;
  }

  // Set debug mode
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    if (typeof window !== "undefined") {
      if (enabled) {
        localStorage.setItem("ssh_debug_mode", "true");
      } else {
        localStorage.removeItem("ssh_debug_mode");
      }
    }
  }

  // Cleanup method
  public cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.dataTimeout) {
      clearTimeout(this.dataTimeout);
      this.dataTimeout = null;
    }
    
    // Process any remaining data
    if (this.dataBuffer.length > 0) {
      this.processDataBuffer();
    }
    
    // Clear any pending commands
    this.clearCommandQueue("Service cleanup");
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.terminal = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.initialResizeSent = false;
    this.clearPersistentState();
    
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ssh_connection_config");
    }
    this.connectionConfig = null;

    console.log("[SSH Service] Service cleaned up");
  }

  // Reconnect to WebSocket server
  public reconnect(): void {
    if (!this.socket || !this.socket.connected) {
      console.log("[SSH Service] Reconnecting to WebSocket server");
      this.initSocket();
    } else if (this.isConnected) {
      console.log("[SSH Service] Already connected, refreshing connection");
      this.refreshConnection();
    } else if (this.connectionConfig) {
      console.log("[SSH Service] Socket connected but SSH disconnected, reconnecting to SSH");
      this.connect(this.connectionConfig);
    } else {
      console.log("[SSH Service] Socket connected but no connection config available");
    }
  }

  // Get the current terminal instance
  public getTerminal(): Terminal | null {
    return this.terminal;
  }

  // Restart shell session properly
  public restartShell(): void {
    if (!this.isConnected || !this.socket) {
      console.warn(
        "[SSH Service] Cannot restart shell: not connected to SSH server"
      );
      return;
    }

    console.log("[SSH Service] Requesting shell restart");
    this.lastActivityTime = Date.now();

    // First clear any pending data in the terminal
    if (this.terminal) {
      // Add a visual separator
      this.terminal.writeln(
        "\r\n\x1b[1;33m--- Shell session restarted ---\x1b[0m\r\n"
      );
    }

    // Request server to restart the shell
    this.socket.emit("ssh-restart-shell");

    // Reset terminal size after a short delay
    setTimeout(() => {
      this.sendInitialResize();
    }, 500);
    
    // Process any remaining data
    if (this.dataBuffer.length > 0) {
      this.processDataBuffer();
    }
    
    // Clear any pending commands
    this.clearCommandQueue("Shell restarted");
  }

  // Refresh connection to handle state transitions between debug mode and SSH terminal
  public refreshConnection(): void {
    if (!this.isConnected || !this.socket) {
      console.warn("[SSH Service] Cannot refresh connection: not connected to SSH server");
      return;
    }

    console.log("[SSH Service] Refreshing SSH connection");
    this.lastActivityTime = Date.now();

    // Process any remaining data
    if (this.dataBuffer.length > 0) {
      this.processDataBuffer();
    }

    // Clear terminal display
    if (this.terminal) {
      // Add a visual separator
      this.terminal.writeln("\r\n\x1b[1;34m--- Refreshing SSH connection ---\x1b[0m\r\n");
    }

    // Notify server about refresh request
    this.socket.emit("ssh-refresh-connection");
    
    // Make sure terminal dimensions are correct
    this.sendInitialResize();
  }
  
  // Execute a command on the SSH connection and return the result
  public async executeCommand(command: string, options?: CommandOptions): Promise<string> {
    const mergedOptions = { ...DEFAULT_COMMAND_OPTIONS, ...options };
    let retryCount = 0;
    
    const executeWithRetry = async (): Promise<string> => {
      try {
        return await this.executeSingleCommand(command, mergedOptions);
      } catch (error) {
        retryCount++;
        
        // If we have retries left, try again after delay
        if (retryCount <= (mergedOptions.retry || 0)) {
          console.log(`[SSH Service] Command failed, retrying (${retryCount}/${mergedOptions.retry})...`);
          
          // Wait for retryDelay before trying again
          await new Promise(resolve => setTimeout(resolve, mergedOptions.retryDelay || 1000));
          return executeWithRetry();
        }
        
        // No retries left, re-throw the error
        throw error;
      }
    };
    
    return executeWithRetry();
  }
  
  // Internal method to execute a single command (used by executeCommand with retry)
  private executeSingleCommand(command: string, options: CommandOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("SSH not connected"));
        return;
      }

      // Generate a unique ID for this command execution
      const executionId = `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a timeout for the command
      const timeout = setTimeout(() => {
        // Remove this command from the queue
        this.commandQueue = this.commandQueue.filter(item => item.id !== executionId);
        reject(new Error("Command execution timed out"));
      }, options.timeout || 30000);
      
      // Add to command queue
      this.commandQueue.push({
        id: executionId,
        resolve,
        reject,
        timeout
      });
      
      // Send the command execution request
      this.socket.emit("ssh-execute-command", {
        command,
        executionId,
        sessionId: this.persistentId,
        stream: options.stream || false
      });
      
      this.lastActivityTime = Date.now();
    });
  }
  
  /**
   * Queue a command to be executed in batch mode for better performance
   * @param command Command to execute
   * @param priority Priority of the command
   */
  public queueCommand(command: string, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    if (!this.socket || !this.isConnected) {
      console.warn('[SSH Service] Cannot queue command: not connected');
      return;
    }
    
    this.batchManager.queueCommand(command, priority);
  }
  
  /**
   * Get the status of command queues
   */
  public getQueueStatus(): { high: number, normal: number, low: number, total: number } {
    return this.batchManager.getQueueStatus();
  }
  
  // Advanced executeCommandBatch method with prioritized queuing
  public async executeCommandBatch(commands: string[], priority: 'high' | 'normal' | 'low' = 'normal'): Promise<Map<string, string>> {
    if (!commands || commands.length === 0) {
      return new Map<string, string>();
    }
    
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("SSH not connected"));
        return;
      }
      
      // Generate batch ID
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Send the batch request
      this.socket.emit("ssh-execute-batch", {
        commands,
        batchId,
        sessionId: this.persistentId,
        priority
      });
      
      this.lastActivityTime = Date.now();
      
      // Create timeout handler
      const timeoutHandler = setTimeout(() => {
        this.socket?.off("command-batch-result", resultHandler);
        reject(new Error("Batch execution timed out"));
      }, 60000); // 60 second timeout
      
      // Create result handler
      const resultHandler = (data: { batchId: string, results: Array<{command: string, output: string, error?: string}> }) => {
        if (data.batchId === batchId) {
          clearTimeout(timeoutHandler);
          this.socket?.off("command-batch-result", resultHandler);
          
          const resultMap = new Map<string, string>();
          let hasErrors = false;
          
          data.results.forEach(result => {
            if (result.error) {
              hasErrors = true;
              console.warn(`[SSH Service] Command error in batch: ${result.command} - ${result.error}`);
            } else {
              resultMap.set(result.command, result.output);
            }
          });
          
          if (hasErrors && resultMap.size === 0) {
            reject(new Error("All commands in batch failed"));
          } else {
            resolve(resultMap);
          }
        }
      };
      
      this.socket.on("command-batch-result", resultHandler);
    });
  }
  
  /**
   * Get diagnostics information
   */
  public getDiagnostics(): { 
    connected: boolean, 
    connecting: boolean,
    sessionId: string | null,
    queueStatus: ReturnType<CommandBatchManager['getQueueStatus']>,
    socketConnected: boolean,
    lastActivity: Date,
    bufferSize: number
  } {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      sessionId: this.persistentId,
      queueStatus: this.batchManager.getQueueStatus(),
      socketConnected: this.socket?.connected || false,
      lastActivity: new Date(this.lastActivityTime),
      bufferSize: this.dataBuffer.length
    };
  }
}

// Create a singleton instance
const sshService = new SSHService();
export default sshService;