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
}

// Default command options
const DEFAULT_COMMAND_OPTIONS: CommandOptions = {
  timeout: 60000,    // 60 seconds default timeout
  retry: 2,          // 2 retries
  retryDelay: 1000,  // 1 second between retries
  stream: false      // No streaming by default
};

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
  private commandBatch: Map<string, {commands: string[], resolve: Function, reject: Function}> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;

  // Event callbacks
  private onConnectedCallback: ((message: string) => void) | null = null;
  private onDataCallback: ((data: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onDisconnectedCallback: ((message: string) => void) | null = null;

  constructor() {
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

  private initSocket() {
    try {
      // Connect to the WebSocket server with environment-specific URL
      const socketUrl =
        process.env.NODE_ENV === "production"
          ? "https://your-production-domain.com"
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
        // If we have a persistent ID, use it to reconnect to the same session
        auth: this.persistentId
          ? {
              sessionId: this.persistentId,
            }
          : undefined,
      });

      // Setup event listeners
      this.socket.on("connect", () => {
        console.log(
          `[SSH Service] WebSocket connected to server (socket ID: ${this.socket?.id})`
        );

        // Reset reconnection attempts on successful connection
        this.reconnectAttempts = 0;
        
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
        }

        // Send initial resize if terminal dimensions are available
        this.sendInitialResize();

        if (this.onConnectedCallback) {
          this.onConnectedCallback("Reconnected to existing session");
        }
      });

      this.socket.on("ssh-data", (data) => {
        this.lastActivityTime = Date.now();
        
        // Only log first 100 chars to avoid console overflow
        const truncated = typeof data === "string" && data.length > 100 
          ? `${data.substring(0, 100)}... (${data.length} bytes)` 
          : data;
        console.log("[SSH Service] Received SSH data:", truncated);
        
        if (this.terminal) {
          this.terminal.write(data);
        }

        if (this.onDataCallback) {
          this.onDataCallback(data);
        }
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
        if (this.terminal) {
          console.log(`[SSH Service] Received SSH error data: ${data.substring(0, 100)}...`);
          this.terminal.write(`\x1b[31m${data}\x1b[0m`);  // Ensure error text is red
        }

        if (this.onErrorCallback) {
          this.onErrorCallback(data);
        }
      });

      this.socket.on("ssh-closed", (data) => {
        this.isConnected = false;
        this.isConnecting = false;
        this.initialResizeSent = false;
        this.lastActivityTime = Date.now();
        
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
        
        const batchItem = this.commandBatch.get(data.batchId);
        if (!batchItem) {
          console.warn(`[SSH Service] Received results for unknown batch ID: ${data.batchId}`);
          return;
        }
        
        // Process the batch results
        const resultMap = new Map<string, string>();
        let hasErrors = false;
        let errorMessage = "";
        
        data.results.forEach(result => {
          if (result.error) {
            hasErrors = true;
            errorMessage += `${result.command}: ${result.error}\n`;
          } else {
            resultMap.set(result.command, result.output);
          }
        });
        
        // Remove the batch
        this.commandBatch.delete(data.batchId);
        
        // Resolve or reject
        if (hasErrors && resultMap.size === 0) {
          batchItem.reject(new Error(`Batch execution failed: ${errorMessage}`));
        } else {
          // Even if some commands failed, return the successful results
          batchItem.resolve(resultMap);
        }
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
    
    // Clear command batches
    for (const [batchId, batchItem] of this.commandBatch) {
      batchItem.reject(new Error(error));
    }
    this.commandBatch.clear();
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
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
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
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
  
  // Execute multiple commands in a batch for better performance
  public async executeBatch(commands: string[]): Promise<Map<string, string>> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("SSH not connected"));
        return;
      }
      
      if (!commands || commands.length === 0) {
        resolve(new Map<string, string>());
        return;
      }
      
      // Generate batch ID
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Store batch information
      this.commandBatch.set(batchId, {
        commands,
        resolve,
        reject
      });
      
      // Send the batch request
      this.socket.emit("ssh-execute-batch", {
        commands,
        batchId,
        sessionId: this.persistentId
      });
      
      this.lastActivityTime = Date.now();
      
      // Set a timeout for the batch
      setTimeout(() => {
        if (this.commandBatch.has(batchId)) {
          const batchItem = this.commandBatch.get(batchId);
          this.commandBatch.delete(batchId);
          if (batchItem) {
            batchItem.reject(new Error("Batch execution timed out"));
          }
        }
      }, 60000); // 60 second timeout for batches
    });
  }
  
  // Queue commands to be sent as a batch (more efficient)
  public queueCommand(command: string): void {
    // Create batch array if it doesn't exist
    if (!this._batchCommands) {
      this._batchCommands = [];
    }
    
    // Add command to queue
    this._batchCommands.push(command);
    
    // If this is the first command, set a timer to flush the batch
    if (this._batchCommands.length === 1 && !this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flushCommandQueue(), 50);
    }
    
    // If we've reached batch size, flush immediately
    if (this._batchCommands.length >= 10) {
      this.flushCommandQueue();
    }
  }
  
  private _batchCommands: string[] = [];
  
  // Flush queued commands as a batch
  private flushCommandQueue(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    if (!this._batchCommands || this._batchCommands.length === 0) {
      return;
    }
    
    // Get commands from queue
    const commands = [...this._batchCommands];
    this._batchCommands = [];
    
    // Execute as batch
    this.executeBatch(commands).catch(error => {
      console.error("[SSH Service] Batch execution failed:", error);
    });
  }
}

// Create a singleton instance
const sshService = new SSHService();
export default sshService;
