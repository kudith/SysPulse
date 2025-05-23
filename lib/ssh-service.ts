import { io, Socket } from "socket.io-client";
import { Terminal } from "xterm";

// Type definitions
export interface EnhancedSocketOptions {
  reconnectionAttempts: number;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  timeout: number;
  transports: string[];
  forceNew: boolean;
  upgrade: boolean;
  rememberUpgrade: boolean;
  perMessageDeflate:
    | boolean
    | {
        threshold: number;
        zlibDeflateOptions?: {
          level: number;
          memLevel: number;
        };
      };
  pingTimeout: number;
  pingInterval: number;
  autoConnect: boolean;
  auth?: any;
}

export type PerformanceMode = "high" | "balanced" | "eco";

export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  privateKey: string;
  passphrase?: string;
}

export interface CommandOptions {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  stream?: boolean;
  priority?: "high" | "normal" | "low";
  background?: boolean; // Add background option
}

// State interfaces
interface CommandQueueState {
  highPriorityQueue: string[];
  normalPriorityQueue: string[];
  lowPriorityQueue: string[];
  batchTimer: NodeJS.Timeout | null;
  batchInterval: number;
  maxBatchSize: number;
  processing: boolean;
  lastBatchTime: number;
  metrics: {
    processed: number;
    errors: number;
    lastProcessTime: number;
    avgProcessTime: number;
  };
}

interface SSHServiceState {
  socket: Socket | null;
  terminal: Terminal | null;
  isConnected: boolean;
  isConnecting: boolean;
  initialResizeSent: boolean;
  persistentId: string | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  backoffTime: number;
  reconnectTimer: NodeJS.Timeout | null;
  pingInterval: NodeJS.Timeout | null;
  lastActivityTime: number;
  connectionConfig: SSHConfig | null;
  commandQueue: Array<{
    id: string;
    resolve: Function;
    reject: Function;
    timeout: NodeJS.Timeout;
  }>;
  dataBuffer: string;
  dataTimeout: NodeJS.Timeout | null;
  dataBufferMaxTime: number;
  connectionRetryBackoff: number;
  useBinaryTransport: boolean;
  frameSkip: number;
  maxFrameSkip: number;
  isHighLoad: boolean;
  performanceMode: PerformanceMode;
  dataWorker: Worker | null;
  performanceMetrics: {
    lastRenderTime: number;
    renderTimes: number[];
    dataVolume: number;
    frameDrops: number;
    lastRenderTimestamp: number;
    renderCount: number;
    throttledCount: number;
  };
  callbacks: {
    onConnected: ((message: string) => void) | null;
    onData: ((data: string) => void) | null;
    onError: ((error: string) => void) | null;
    onDisconnected: ((message: string) => void) | null;
  };
  debugMode: boolean;
  batchManagerState: CommandQueueState;
}

// Default command options
const DEFAULT_COMMAND_OPTIONS: CommandOptions = {
  timeout: 60000, // 60 seconds default timeout
  retry: 2, // 2 retries
  retryDelay: 1000, // 1 second between retries
  stream: false, // No streaming by default
  priority: "normal", // Normal priority
};

// Create the initial state
const createInitialState = (): SSHServiceState => {
  // Initialize with values from session storage if available
  let persistentId = null;
  let isConnected = false;
  let connectionConfig = null;
  let debugMode = false;
  let performanceMode: PerformanceMode = "balanced";

  if (typeof window !== "undefined") {
    persistentId = sessionStorage.getItem("ssh_persistent_id");
    const connectedState = sessionStorage.getItem("ssh_connected_state");
    isConnected = connectedState === "true";

    // Store last config if it exists
    const savedConfig = sessionStorage.getItem("ssh_connection_config");
    if (savedConfig) {
      try {
        connectionConfig = JSON.parse(savedConfig);
      } catch (e) {
        console.error("[SSH Service] Failed to parse saved config");
        sessionStorage.removeItem("ssh_connection_config");
      }
    }

    debugMode = localStorage.getItem("ssh_debug_mode") === "true";

    // Load performance mode from localStorage
    const savedPerformanceMode = localStorage.getItem(
      "ssh_performance_mode"
    ) as PerformanceMode | null;
    if (
      savedPerformanceMode &&
      ["high", "balanced", "eco"].includes(savedPerformanceMode)
    ) {
      performanceMode = savedPerformanceMode;
    }
  }

  return {
    socket: null,
    terminal: null,
    isConnected,
    isConnecting: false,
    initialResizeSent: false,
    persistentId,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    backoffTime: 1000,
    reconnectTimer: null,
    pingInterval: null,
    lastActivityTime: Date.now(),
    connectionConfig,
    commandQueue: [],
    dataBuffer: "",
    dataTimeout: null,
    dataBufferMaxTime: 16, // ms (approx 1 frame at 60FPS)
    connectionRetryBackoff: 0,
    useBinaryTransport: true,
    frameSkip: 0,
    maxFrameSkip: 2,
    isHighLoad: false,
    performanceMode,
    dataWorker: null,
    performanceMetrics: {
      lastRenderTime: 0,
      renderTimes: [],
      dataVolume: 0,
      frameDrops: 0,
      lastRenderTimestamp: 0,
      renderCount: 0,
      throttledCount: 0,
    },
    callbacks: {
      onConnected: null,
      onData: null,
      onError: null,
      onDisconnected: null,
    },
    debugMode,
    batchManagerState: {
      highPriorityQueue: [],
      normalPriorityQueue: [],
      lowPriorityQueue: [],
      batchTimer: null,
      batchInterval: 50,
      maxBatchSize: 5,
      processing: false,
      lastBatchTime: 0,
      metrics: {
        processed: 0,
        errors: 0,
        lastProcessTime: 0,
        avgProcessTime: 0,
      },
    },
  };
};

// Create the service state
let serviceState = createInitialState();

// Utility functions
const logDebug = (message: string, ...args: any[]): void => {
  if (serviceState.debugMode) {
    console.log(`[SSH Debug] ${message}`, ...args);
  }
};

const getBaseBufferTime = (mode: PerformanceMode): number => {
  switch (mode) {
    case "high":
      return 8; // ~120fps
    case "eco":
      return 33; // ~30fps
    case "balanced":
    default:
      return 16; // ~60fps
  }
};

// Batch command manager functions
const scheduleBatch = (): void => {
  const state = serviceState.batchManagerState;

  // If already processing or timer is set, don't schedule another one
  if (state.processing || state.batchTimer) {
    return;
  }

  // Determine how long to wait before processing based on system load
  const now = Date.now();
  const timeSinceLastBatch = now - state.lastBatchTime;

  // Adaptive batch interval based on previous processing time
  const adaptiveBatchInterval = Math.max(
    state.batchInterval,
    Math.min(500, state.metrics.avgProcessTime * 1.5) // At most 500ms delay
  );

  const waitTime = Math.max(0, adaptiveBatchInterval - timeSinceLastBatch);

  serviceState.batchManagerState.batchTimer = setTimeout(() => {
    processBatch();
  }, waitTime);
};

const processBatch = (): void => {
  const state = serviceState.batchManagerState;

  if (
    !serviceState.socket ||
    !serviceState.socket.connected ||
    state.processing
  ) {
    serviceState.batchManagerState.batchTimer = null;
    return;
  }

  serviceState.batchManagerState.processing = true;
  serviceState.batchManagerState.batchTimer = null;
  serviceState.batchManagerState.lastBatchTime = Date.now();

  // Create batch from queues, prioritizing high > normal > low
  let batch: string[] = [];

  // First take high priority items
  while (
    batch.length < state.maxBatchSize &&
    state.highPriorityQueue.length > 0
  ) {
    batch.push(state.highPriorityQueue.shift()!);
  }

  // Then normal priority
  while (
    batch.length < state.maxBatchSize &&
    state.normalPriorityQueue.length > 0
  ) {
    batch.push(state.normalPriorityQueue.shift()!);
  }

  // Finally low priority
  while (
    batch.length < state.maxBatchSize &&
    state.lowPriorityQueue.length > 0
  ) {
    batch.push(state.lowPriorityQueue.shift()!);
  }

  // If we have commands to process
  if (batch.length > 0) {
    const batchId = `batch_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const startTime = performance.now();

    // Send the batch
    serviceState.socket.emit("ssh-execute-batch", {
      commands: batch,
      batchId,
      sessionId: serviceState.persistentId,
    });

    // Set timeout for batch response - adaptive based on command count
    const timeoutHandle = setTimeout(() => {
      console.error(`[CommandBatchManager] Batch ${batchId} timed out`);
      serviceState.batchManagerState.processing = false;
      serviceState.batchManagerState.metrics.errors++;

      if (hasQueuedCommands()) {
        scheduleBatch();
      }
    }, Math.max(30000, batch.length * 5000)); // At least 30 seconds or 5s per command

    // Listen for batch response
    const handleBatchResult = (data: {
      batchId: string;
      results: Array<{ command: string; output: string; error?: string }>;
    }) => {
      if (data.batchId === batchId) {
        clearTimeout(timeoutHandle);
        serviceState.socket?.off("command-batch-result", handleBatchResult);

        // Track metrics
        const processTime = performance.now() - startTime;
        serviceState.batchManagerState.metrics.lastProcessTime = processTime;
        serviceState.batchManagerState.metrics.avgProcessTime =
          (serviceState.batchManagerState.metrics.avgProcessTime *
            serviceState.batchManagerState.metrics.processed +
            processTime) /
          (serviceState.batchManagerState.metrics.processed + 1);
        serviceState.batchManagerState.metrics.processed++;

        // Process results
        const resultMap = new Map<string, string>();
        let hasErrors = false;

        data.results.forEach((result) => {
          if (!result.error) {
            resultMap.set(result.command, result.output);
          } else {
            console.warn(
              `[CommandBatchManager] Command error: ${result.command} - ${result.error}`
            );
            hasErrors = true;
            serviceState.batchManagerState.metrics.errors++;
          }
        });

        if (resultMap.size > 0) {
          handleBatchResults(resultMap);
        }

        if (hasErrors) {
          handleBatchError(new Error(`Some commands in batch failed`));
        }

        // Continue processing
        serviceState.batchManagerState.processing = false;

        // If we have more commands or new commands arrived during processing, schedule next batch
        if (hasQueuedCommands()) {
          scheduleBatch();
        }
      }
    };

    serviceState.socket.on("command-batch-result", handleBatchResult);
  } else {
    serviceState.batchManagerState.processing = false;
  }
};

const queueCommand = (
  command: string,
  priority: "high" | "normal" | "low" = "normal"
): void => {
  switch (priority) {
    case "high":
      serviceState.batchManagerState.highPriorityQueue.push(command);
      break;
    case "low":
      serviceState.batchManagerState.lowPriorityQueue.push(command);
      break;
    default:
      serviceState.batchManagerState.normalPriorityQueue.push(command);
      break;
  }

  scheduleBatch();
};

const hasQueuedCommands = (): boolean => {
  const state = serviceState.batchManagerState;
  return (
    state.highPriorityQueue.length > 0 ||
    state.normalPriorityQueue.length > 0 ||
    state.lowPriorityQueue.length > 0
  );
};

// Internal function to get queue status - renamed to avoid conflict
const getInternalQueueStatus = (): {
  high: number;
  normal: number;
  low: number;
  total: number;
} => {
  const state = serviceState.batchManagerState;
  return {
    high: state.highPriorityQueue.length,
    normal: state.normalPriorityQueue.length,
    low: state.lowPriorityQueue.length,
    total:
      state.highPriorityQueue.length +
      state.normalPriorityQueue.length +
      state.lowPriorityQueue.length,
  };
};

// Internal function to get batch metrics - renamed to avoid conflict
const getInternalBatchMetrics =
  (): typeof serviceState.batchManagerState.metrics => {
    return { ...serviceState.batchManagerState.metrics };
  };

const clearBatchManager = (): void => {
  const state = serviceState.batchManagerState;

  state.highPriorityQueue = [];
  state.normalPriorityQueue = [];
  state.lowPriorityQueue = [];

  if (state.batchTimer) {
    clearTimeout(state.batchTimer);
    state.batchTimer = null;
  }

  state.processing = false;
};

// Handle batch responses and errors
const handleBatchResults = (results: Map<string, string>): void => {
  // Individual services will handle their own responses
  serviceState.lastActivityTime = Date.now();
};

const handleBatchError = (error: Error): void => {
  console.error("[SSH Service] Batch execution error:", error.message);
};

// Data processing functions
const initDataProcessingWorker = (): void => {
  if (typeof Worker !== "undefined") {
    try {
      // Create web worker for data processing
      const workerCode = `
        self.onmessage = function(e) {
          const { action, data } = e.data;
          
          if (action === 'process') {
            // Process data here (future optimizations could include ANSI parsing)
            // For now just pass-through
            self.postMessage({ action: 'processed', result: data });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      serviceState.dataWorker = new Worker(workerUrl);

      serviceState.dataWorker.onmessage = (e) => {
        const { action, result } = e.data;
        if (action === "processed" && serviceState.terminal) {
          serviceState.terminal.write(result);
        }
      };

      logDebug("Data processing worker initialized");
    } catch (err) {
      console.error("[SSH Service] Failed to initialize data worker:", err);
      serviceState.dataWorker = null;
    }
  }
};

const setupLoadDetection = (): void => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const checkLoad = () => {
      (window as any).requestIdleCallback((idleDeadline: any) => {
        // If we have little idle time, we're under high load
        serviceState.isHighLoad = idleDeadline.timeRemaining() < 10;

        if (serviceState.isHighLoad && serviceState.performanceMode !== "eco") {
          logDebug("High system load detected, adjusting rendering strategy");
          serviceState.dataBufferMaxTime = 33; // Switch to lower frame rate temporarily
        } else if (
          !serviceState.isHighLoad &&
          serviceState.dataBufferMaxTime !==
            getBaseBufferTime(serviceState.performanceMode)
        ) {
          // Reset to configured mode if load has decreased
          serviceState.dataBufferMaxTime = getBaseBufferTime(
            serviceState.performanceMode
          );
        }

        // Check again soon
        setTimeout(checkLoad, 2000);
      });
    };

    checkLoad();
  }
};

const handleDataReceived = (data: string): void => {
  // Improved data buffering
  serviceState.dataBuffer += data;

  // Clear any existing timeout
  if (serviceState.dataTimeout) {
    clearTimeout(serviceState.dataTimeout);
  }

  // Use adaptive processing strategy based on data size and system load
  const dataLength = data.length;

  // Track incoming data volume
  serviceState.performanceMetrics.dataVolume += dataLength;

  // For very small data (keys, prompts), process immediately
  if (dataLength < 256) {
    processDataBuffer();
  }
  // For medium data, use normal buffering
  else if (dataLength < 4096) {
    serviceState.dataTimeout = setTimeout(
      () => processDataBuffer(),
      serviceState.dataBufferMaxTime
    );
  }
  // For large data chunks, use frame skipping strategy
  else {
    handleLargeDataStream(data);
  }
};

const handleLargeDataStream = (data: string): void => {
  // For very large outputs, apply frame skipping when under high load
  if (serviceState.dataBuffer.length > 50000 && serviceState.isHighLoad) {
    serviceState.frameSkip++;
    if (serviceState.frameSkip > serviceState.maxFrameSkip) {
      serviceState.frameSkip = 0;

      // Process what we have so far
      processDataBuffer();
      logDebug("Applied frame skipping due to large buffer under high load");
    } else {
      // Just add to buffer without scheduling render yet
      serviceState.performanceMetrics.throttledCount++;
    }
  } else {
    // Reset frame skip counter
    serviceState.frameSkip = 0;

    // Use requestAnimationFrame for heavy data if available
    if (
      typeof window !== "undefined" &&
      window.requestAnimationFrame &&
      serviceState.dataBuffer.length > 10000
    ) {
      window.requestAnimationFrame(() => processDataBuffer());
    } else {
      // Fallback to timeout for non-browser environments
      serviceState.dataTimeout = setTimeout(
        () => processDataBuffer(),
        serviceState.dataBufferMaxTime
      );
    }
  }
};

const processDataBuffer = (): void => {
  if (serviceState.dataTimeout) {
    clearTimeout(serviceState.dataTimeout);
    serviceState.dataTimeout = null;
  }

  if (serviceState.dataBuffer.length > 0) {
    const startTime = performance.now();
    logDebug(
      `Processing ${serviceState.dataBuffer.length} bytes of buffered data`
    );

    // Update performance metrics
    serviceState.performanceMetrics.renderCount++;

    // Prevent excessive processing rate - at most 60fps
    const timeSinceLastRender =
      startTime - serviceState.performanceMetrics.lastRenderTimestamp;
    if (timeSinceLastRender < 16 && serviceState.dataBuffer.length < 512) {
      // Reschedule processing to maintain ~60fps for small updates
      serviceState.dataTimeout = setTimeout(
        () => processDataBuffer(),
        16 - timeSinceLastRender
      );
      return;
    }

    serviceState.performanceMetrics.lastRenderTimestamp = startTime;

    const bufferContent = serviceState.dataBuffer;
    serviceState.dataBuffer = ""; // Clear buffer before writing to avoid recursion issues

    // Send data to terminal - use worker if available
    if (serviceState.terminal) {
      try {
        if (serviceState.dataWorker && bufferContent.length > 5000) {
          // Use worker for large content
          serviceState.dataWorker.postMessage({
            action: "process",
            data: bufferContent,
          });
        } else {
          // Process directly for small content or if worker not available
          serviceState.terminal.write(bufferContent);
        }
      } catch (err) {
        console.error("[SSH Service] Error writing to terminal:", err);
        serviceState.performanceMetrics.frameDrops++;
      }
    }

    // Call the data callback if registered
    if (serviceState.callbacks.onData) {
      try {
        serviceState.callbacks.onData(bufferContent);
      } catch (err) {
        console.error("[SSH Service] Error in data callback:", err);
      }
    }

    // Track render time for performance metrics
    const renderTime = performance.now() - startTime;
    serviceState.performanceMetrics.renderTimes.push(renderTime);
    serviceState.performanceMetrics.lastRenderTime = renderTime;

    // Keep only last 60 measurements
    if (serviceState.performanceMetrics.renderTimes.length > 60) {
      serviceState.performanceMetrics.renderTimes.shift();
    }

    // Auto-tune performance periodically
    if (serviceState.performanceMetrics.renderCount % 100 === 0) {
      autoTunePerformance();
    }
  }
};

const autoTunePerformance = (): void => {
  if (serviceState.performanceMetrics.renderTimes.length < 10) return;

  // Calculate average render time
  const avgRenderTime =
    serviceState.performanceMetrics.renderTimes.reduce(
      (sum, time) => sum + time,
      0
    ) / serviceState.performanceMetrics.renderTimes.length;

  // Check if we need to adjust performance mode
  if (
    avgRenderTime > 25 &&
    serviceState.performanceMode !== "eco" &&
    serviceState.performanceMetrics.frameDrops > 5
  ) {
    // Switch to eco mode if render time is too high
    setPerformanceMode("eco");
    logDebug(
      `Auto-switched to eco mode (avg render: ${avgRenderTime.toFixed(2)}ms)`
    );
  } else if (avgRenderTime < 10 && serviceState.performanceMode === "eco") {
    // Switch back to balanced if performance is good
    setPerformanceMode("balanced");
    logDebug(
      `Auto-switched to balanced mode (avg render: ${avgRenderTime.toFixed(
        2
      )}ms)`
    );
  }

  // Reset frame drops counter
  serviceState.performanceMetrics.frameDrops = 0;
};

// Socket and connection management functions
const initSocket = (): void => {
  try {
    // Connect to the WebSocket server with environment-specific URL
    const socketUrl = process.env.NEXT_PUBLIC_SSH_SERVER_URL; // Replace with actual URL

    console.log(`[SSH Service] Connecting to WebSocket server at ${socketUrl}`);

    // Close existing socket if any
    if (serviceState.socket) {
      serviceState.socket.disconnect();
    }

    // Enhanced socketio configuration for better performance
    serviceState.socket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000, // Reduced timeout for faster failure detection
      transports: ["websocket", "polling"], // Allow fallback to polling if WebSocket fails
      forceNew: true, // Use a new connection to avoid issues with stale connections
      upgrade: true,
      rememberUpgrade: true,
      perMessageDeflate: {
        threshold: 1024,
      },
      autoConnect: true,
      // If we have a persistent ID, use it to reconnect to the same session
      auth: serviceState.persistentId
        ? {
            sessionId: serviceState.persistentId,
          }
        : undefined,
    });

    // For monitoring connections, use the namespace:
    const setupMonitoring = (sessionId: string): Socket | undefined => {
      if (typeof window === "undefined") return;

      // Use a Socket.IO namespace for monitoring instead of native WebSocket
      const monitorSocket = io(`${socketUrl}/monitoring`, {
        transports: ["websocket", "polling"], // Allow fallback
        forceNew: true,
      });

      monitorSocket.on("connect", () => {
        console.log("[Monitor] Connected to monitoring socket");
        monitorSocket.emit("register", {
          sessionId,
          monitor: "resources",
          frequency: "high",
        });
      });

      monitorSocket.on("resource-update", (data) => {
        // Handle resource updates
        console.log("[Monitor] Resource update:", data);
      });

      return monitorSocket;
    };

    // Actually use the setupMonitoring function when we get a session ID
    if (serviceState.persistentId) {
      setupMonitoring(serviceState.persistentId);
    }

    // Set up event listener to create monitoring when connected
    serviceState.socket.on("ssh-connected", (data) => {
      if (data.sessionId) {
        setupMonitoring(data.sessionId);
      }
    });

    setupSocketEventListeners();
  } catch (err) {
    console.error("[SSH Service] Error initializing socket:", err);
  }
};

const setupSocketEventListeners = (): void => {
  if (!serviceState.socket) return;
  const socket = serviceState.socket;

  socket.on("connect", () => {
    console.log(
      `[SSH Service] WebSocket connected to server (socket ID: ${socket.id})`
    );

    // Reset reconnection attempts on successful connection
    serviceState.reconnectAttempts = 0;
    serviceState.connectionRetryBackoff = 0;

    // If we have a persistent ID, check if the connection still exists on the server
    if (serviceState.persistentId) {
      console.log(
        `[SSH Service] Checking existing session with ID: ${serviceState.persistentId}`
      );
      socket.emit("ssh-check-connection", {
        sessionId: serviceState.persistentId,
      });
    }
    // If we were previously connected but have no persistent ID, try to reconnect
    else if (serviceState.isConnected && serviceState.connectionConfig) {
      console.log("[SSH Service] Attempting to restore previous connection");
      connect(serviceState.connectionConfig);
    }
  });

  socket.on("connect_error", (error) => {
    console.error("[SSH Service] WebSocket connection error:", error);
    handleConnectionRetry();
  });

  // Ensure shell session is restarted after reconnect
  socket.on("ssh-connected", (data) => {
    serviceState.isConnected = true;
    serviceState.isConnecting = false;
    serviceState.lastActivityTime = Date.now();
    console.log("[SSH Service] SSH connection established:", data.message);

    if (data.sessionId) {
      serviceState.persistentId = data.sessionId;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ssh_persistent_id", data.sessionId);
        sessionStorage.setItem("ssh_connected_state", "true");
      }
    }

    // Send initial resize if terminal dimensions are available
    sendInitialResize();

    if (serviceState.callbacks.onConnected) {
      serviceState.callbacks.onConnected(data.message);
    }
  });

  socket.on("ssh-connection-exists", (data) => {
    serviceState.isConnected = true;
    serviceState.isConnecting = false;
    serviceState.lastActivityTime = Date.now();
    console.log(
      "[SSH Service] Reconnected to existing SSH session:",
      data.message
    );

    if (data.sessionId && !serviceState.persistentId) {
      serviceState.persistentId = data.sessionId;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ssh_persistent_id", data.sessionId);
        sessionStorage.setItem("ssh_connected_state", "true");
      }
    }

    // Send initial resize if terminal dimensions are available
    sendInitialResize();

    if (serviceState.callbacks.onConnected) {
      serviceState.callbacks.onConnected("Reconnected to existing session");
    }
  });

  // Handle binary data if supported
  socket.on("ssh-binary-data", (data) => {
    serviceState.lastActivityTime = Date.now();

    if (!data) return;

    try {
      // Convert binary data to string
      const textDecoder = new TextDecoder("utf-8");
      const stringData = textDecoder.decode(data);

      // Process as normal string data
      handleDataReceived(stringData);
    } catch (err) {
      console.error("[SSH Service] Error processing binary data:", err);
    }
  });

  // Handle regular string data
  socket.on("ssh-data", (data) => {
    serviceState.lastActivityTime = Date.now();
    if (!data) return;
    handleDataReceived(data);
  });

  socket.on("ssh-heartbeat", () => {
    // Process any pending data in buffer on heartbeat
    if (serviceState.dataBuffer.length > 0) {
      processDataBuffer();
    }

    serviceState.lastActivityTime = Date.now();
  });

  socket.on("ssh-error", (data) => {
    serviceState.isConnecting = false;
    serviceState.lastActivityTime = Date.now();
    console.error("[SSH Service] SSH error:", data.message);

    // Check for authentication-related errors that might indicate a persistent problem
    if (
      data.message?.includes("Authentication failed") ||
      data.message?.includes("auth methods") ||
      data.message?.includes("no valid auth")
    ) {
      console.error(
        "[SSH Service] Authentication error detected, clearing persistent state"
      );
      clearPersistentState();
    }

    if (serviceState.callbacks.onError) {
      serviceState.callbacks.onError(data.message);
    }

    // Add visual error indicator to terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        `\r\n\x1b[1;31m[Error] ${data.message}\x1b[0m\r\n`
      );
    }
  });

  socket.on("ssh-error-data", (data) => {
    serviceState.lastActivityTime = Date.now();
    // Pass error data to terminal (usually displayed in red)
    if (serviceState.terminal && data) {
      console.log(
        `[SSH Service] Received SSH error data: ${data.substring(0, 100)}...`
      );
      serviceState.terminal.write(`\x1b[31m${data}\x1b[0m`); // Ensure error text is red
    }

    if (serviceState.callbacks.onError && data) {
      serviceState.callbacks.onError(data);
    }
  });

  socket.on("ssh-closed", (data) => {
    serviceState.isConnected = false;
    serviceState.isConnecting = false;
    serviceState.initialResizeSent = false;
    serviceState.lastActivityTime = Date.now();

    // Force process any remaining data in buffer
    processDataBuffer();

    // Only clear persistent state for normal closures
    if (!data.message?.includes("reconnect")) {
      clearPersistentState();
    }

    console.log("[SSH Service] SSH connection closed:", data.message);

    // Show message in terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        `\r\n\x1b[1;33m[Closed] ${
          data.message || "Connection closed"
        }\x1b[0m\r\n`
      );
    }

    if (serviceState.callbacks.onDisconnected) {
      serviceState.callbacks.onDisconnected(data.message);
    }
  });

  socket.on("ssh-ended", (data) => {
    serviceState.isConnected = false;
    serviceState.isConnecting = false;
    serviceState.initialResizeSent = false;
    serviceState.lastActivityTime = Date.now();

    // Force process any remaining data in buffer
    processDataBuffer();

    clearPersistentState();
    console.log("[SSH Service] SSH connection ended:", data.message);

    // Show message in terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        `\r\n\x1b[1;33m[Ended] ${data.message || "Connection ended"}\x1b[0m\r\n`
      );
    }

    if (serviceState.callbacks.onDisconnected) {
      serviceState.callbacks.onDisconnected(data.message);
    }
  });

  // Handle command results with reliable delivery
  socket.on(
    "command-result",
    (data: {
      executionId: string;
      output: string;
      error?: string;
      partial?: boolean;
      background?: boolean;
    }) => {
      serviceState.lastActivityTime = Date.now();

      // Find the command in the queue
      const commandItem = serviceState.commandQueue.find(
        (item) => item.id === data.executionId
      );
      if (!commandItem) {
        console.warn(
          `[SSH Service] Received result for unknown command ID: ${data.executionId}`
        );
        return;
      }

      // If it's a partial response (for streaming), don't resolve yet
      if (data.partial) {
        return;
      }

      // Remove the command from the queue
      serviceState.commandQueue = serviceState.commandQueue.filter(
        (item) => item.id !== data.executionId
      );

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
    }
  );

  socket.on("disconnect", (reason) => {
    serviceState.isConnecting = false;
    serviceState.initialResizeSent = false;
    serviceState.lastActivityTime = Date.now();
    console.log(`[SSH Service] WebSocket disconnected from server: ${reason}`);

    // Show message in terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        `\r\n\x1b[1;33m[Disconnected] WebSocket connection lost (${reason})\x1b[0m\r\n`
      );
    }

    // For certain disconnect reasons, attempt reconnection
    if (
      reason === "io server disconnect" ||
      reason === "transport close" ||
      reason === "ping timeout"
    ) {
      handleConnectionRetry();
    }

    if (serviceState.callbacks.onDisconnected && !serviceState.isConnected) {
      serviceState.callbacks.onDisconnected(
        `WebSocket connection lost: ${reason}`
      );
    }
  });

  socket.io.on("reconnect", (attempt) => {
    console.log(
      `[SSH Service] Socket.IO reconnected after ${attempt} attempts`
    );

    // Show message in terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        `\r\n\x1b[1;32m[Reconnected] Socket connection restored\x1b[0m\r\n`
      );
    }

    // Check connection status after reconnection
    checkConnectionStatus();
  });

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log(`[SSH Service] Socket.IO reconnection attempt: ${attempt}`);
  });

  socket.io.on("reconnect_error", (error) => {
    console.error(`[SSH Service] Socket.IO reconnection error:`, error);
  });

  socket.io.on("reconnect_failed", () => {
    console.error(
      `[SSH Service] Socket.IO reconnection failed after max attempts`
    );

    // Show message in terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        `\r\n\x1b[1;31m[Error] Reconnection failed after maximum attempts\x1b[0m\r\n`
      );
    }

    // Clear connection state since we failed to reconnect
    clearPersistentState();
  });
};

// Connection management
const handleConnectionRetry = (): void => {
  if (serviceState.reconnectTimer) {
    clearTimeout(serviceState.reconnectTimer);
    serviceState.reconnectTimer = null;
  }

  if (serviceState.reconnectAttempts >= serviceState.maxReconnectAttempts) {
    console.log("[SSH Service] Maximum reconnect attempts reached, giving up");

    // Show message in terminal
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        "\r\n\x1b[1;31m[Error] Maximum reconnect attempts reached. Please refresh the page to try again.\x1b[0m\r\n"
      );
    }

    // Clear connection state
    clearPersistentState();
    return;
  }

  // Calculate backoff time with jitter
  const delay =
    serviceState.backoffTime * Math.pow(1.5, serviceState.reconnectAttempts) +
    Math.random() * 1000;

  console.log(
    `[SSH Service] Will attempt reconnect in ${Math.round(
      delay / 1000
    )}s (attempt ${serviceState.reconnectAttempts + 1}/${
      serviceState.maxReconnectAttempts
    })`
  );

  // Show message in terminal
  if (serviceState.terminal) {
    serviceState.terminal.writeln(
      `\r\n\x1b[1;33m[Info] Reconnect attempt ${
        serviceState.reconnectAttempts + 1
      }/${serviceState.maxReconnectAttempts} in ${Math.round(
        delay / 1000
      )} seconds...\x1b[0m\r\n`
    );
  }

  serviceState.reconnectTimer = setTimeout(() => {
    serviceState.reconnectAttempts++;
    serviceState.reconnectTimer = null;
    initSocket();
  }, delay);
};

const startHeartbeat = (): void => {
  if (serviceState.pingInterval) {
    clearInterval(serviceState.pingInterval);
  }

  serviceState.pingInterval = setInterval(() => {
    // If we're connected, check that we've had activity recently
    if (serviceState.isConnected && serviceState.socket?.connected) {
      const timeSinceLastActivity = Date.now() - serviceState.lastActivityTime;

      // If no activity for 30 seconds, send a ping
      if (timeSinceLastActivity > 30000) {
        console.log("[SSH Service] No recent activity, sending ping");

        // Use socket.io ping to check connection
        serviceState.socket.emit("ping", () => {
          console.log("[SSH Service] Ping successful");
          serviceState.lastActivityTime = Date.now();
        });

        // If connection config is available, try refreshing the session
        if (timeSinceLastActivity > 60000 && serviceState.connectionConfig) {
          console.log(
            "[SSH Service] Long inactivity period, refreshing session"
          );
          refreshConnection();
        }
      }

      // Process any pending data
      if (serviceState.dataBuffer.length > 0) {
        processDataBuffer();
      }
    }
  }, 10000); // Check every 10 seconds
};

const checkConnectionStatus = (): void => {
  if (!serviceState.socket || !serviceState.socket.connected) {
    console.log("[SSH Service] Socket not connected, reconnecting...");
    initSocket();
    return;
  }

  if (serviceState.persistentId) {
    console.log(
      "[SSH Service] Checking connection status for session:",
      serviceState.persistentId
    );
    serviceState.socket.emit("ssh-check-connection", {
      sessionId: serviceState.persistentId,
    });
  } else if (serviceState.isConnected && serviceState.connectionConfig) {
    console.log(
      "[SSH Service] No session ID but was connected, reconnecting..."
    );
    connect(serviceState.connectionConfig);
  } else {
    console.log("[SSH Service] No active session to check");
  }
};

const clearCommandQueue = (error: string): void => {
  // Reject all pending commands
  serviceState.commandQueue.forEach((item) => {
    clearTimeout(item.timeout);
    item.reject(new Error(error));
  });
  serviceState.commandQueue = [];

  // Clear batch manager
  clearBatchManager();

  if (serviceState.dataTimeout) {
    clearTimeout(serviceState.dataTimeout);
    serviceState.dataTimeout = null;
  }

  // Process any remaining data
  if (serviceState.dataBuffer.length > 0) {
    processDataBuffer();
  }
};

const clearPersistentState = (): void => {
  serviceState.persistentId = null;
  serviceState.isConnected = false;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("ssh_persistent_id");
    sessionStorage.removeItem("ssh_connected_state");
  }

  // Clear any pending commands
  clearCommandQueue("Connection terminated");
};

const sendInitialResize = (): void => {
  if (!serviceState.terminal || !serviceState.isConnected) {
    console.log(
      "[SSH Service] Terminal or connection not ready for initial resize"
    );
    return;
  }

  try {
    const cols = serviceState.terminal.cols;
    const rows = serviceState.terminal.rows;

    if (cols > 0 && rows > 0) {
      console.log(
        `[SSH Service] Sending initial terminal size: ${cols}x${rows}`
      );
      resize(cols, rows);
      serviceState.initialResizeSent = true;
    } else {
      // Try again later if dimensions are not available yet
      console.log(
        "[SSH Service] Invalid terminal dimensions, retrying in 1s..."
      );
      setTimeout(() => sendInitialResize(), 1000);
    }
  } catch (err) {
    console.error("[SSH Service] Error during initial resize:", err);
  }
};

// Initialize service
const initService = (): void => {
  // Initialize data processing worker
  initDataProcessingWorker();

  // Initialize socket connection
  initSocket();

  // Setup load detection for performance optimization
  setupLoadDetection();

  // Start heartbeat to keep connection alive
  startHeartbeat();

  // Setup page unload handler to detect when page is actually closed vs refreshed
  if (typeof window !== "undefined") {
    // Use pagehide event instead, which has the persisted property
    window.addEventListener("pagehide", (event) => {
      // When persisted is false, page is truly unloaded (not cached)
      if (!event.persisted) {
        cleanup();
      }
    });

    // Register visibility change handler to reconnect when tab becomes visible
    document.addEventListener("visibilitychange", () => {
      if (
        document.visibilityState === "visible" &&
        serviceState.isConnected &&
        (!serviceState.socket || !serviceState.socket.connected)
      ) {
        console.log(
          "[SSH Service] Page became visible, checking connection..."
        );
        checkConnectionStatus();
      }
    });
  }
};

// Public API functions

// Set the terminal instance
export const setTerminal = (terminal: Terminal | null): void => {
  serviceState.terminal = terminal;
  console.log("[SSH Service] Terminal instance set");

  // If already connected, try to send the resize immediately
  if (serviceState.isConnected && !serviceState.initialResizeSent && terminal) {
    // Give the terminal a moment to initialize
    setTimeout(() => sendInitialResize(), 500);
  }
};

// Set performance mode
export const setPerformanceMode = (mode: PerformanceMode): void => {
  serviceState.performanceMode = mode;
  serviceState.dataBufferMaxTime = getBaseBufferTime(mode);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("ssh_performance_mode", mode);
  }

  console.log(
    `[SSH Service] Performance mode set to: ${mode} (buffer: ${serviceState.dataBufferMaxTime}ms)`
  );
};

// Connect to SSH server
export const connect = (config: SSHConfig): void => {
  if (!serviceState.socket) {
    initSocket();
  }

  if (!serviceState.socket) {
    throw new Error("WebSocket not initialized");
  }

  serviceState.isConnecting = true;
  serviceState.connectionConfig = config; // Store the config for potential reconnection

  // Save connection config for potential page reload
  if (typeof window !== "undefined") {
    sessionStorage.setItem("ssh_connection_config", JSON.stringify(config));
  }

  console.log(
    `[SSH Service] Attempting to connect to SSH server: ${config.username}@${config.host}:${config.port}`
  );

  // If terminal is available, show connecting message
  if (serviceState.terminal) {
    serviceState.terminal.writeln(
      `\r\n\x1b[1;33m[Connecting] Establishing SSH connection to ${config.username}@${config.host}:${config.port}...\x1b[0m\r\n`
    );
  }

  serviceState.socket.emit("ssh-connect", config);
};

// Disconnect from SSH server
export const disconnect = (): void => {
  if (serviceState.socket) {
    serviceState.socket.emit("ssh-disconnect");
    serviceState.isConnected = false;
    serviceState.isConnecting = false;
    serviceState.initialResizeSent = false;
    clearPersistentState();

    // Process any remaining data
    if (serviceState.dataBuffer.length > 0) {
      processDataBuffer();
    }

    // Remove saved connection config
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ssh_connection_config");
    }
    serviceState.connectionConfig = null;

    console.log("[SSH Service] Disconnecting from SSH server");

    // If terminal is available, show disconnected message
    if (serviceState.terminal) {
      serviceState.terminal.writeln(
        "\r\n\x1b[1;33m[Disconnected] SSH connection closed by user\x1b[0m\r\n"
      );
    }
  }
};

// Send data to SSH server
export const sendData = (data: string): void => {
  if (!serviceState.isConnected || !serviceState.socket) {
    console.warn("[SSH Service] Cannot send data: not connected to SSH server");
    return;
  }

  serviceState.lastActivityTime = Date.now();
  serviceState.socket.emit("ssh-input", data);
};

// Resize terminal dimensions
export const resize = (cols: number, rows: number): void => {
  if (!serviceState.isConnected || !serviceState.socket) {
    console.warn("[SSH Service] Cannot resize: not connected to SSH server");
    return;
  }

  if (!cols || !rows || isNaN(cols) || isNaN(rows) || cols <= 0 || rows <= 0) {
    console.warn(
      `[SSH Service] Invalid terminal dimensions: cols=${cols}, rows=${rows}`
    );
    return;
  }

  serviceState.lastActivityTime = Date.now();
  console.log(`[SSH Service] Resizing terminal to ${cols}x${rows}`);
  serviceState.socket.emit("ssh-resize", { cols, rows });
};

// Event handlers
export const onConnected = (callback: (message: string) => void): void => {
  serviceState.callbacks.onConnected = callback;
};

export const onData = (callback: (data: string) => void): void => {
  serviceState.callbacks.onData = callback;
};

export const onError = (callback: (error: string) => void): void => {
  serviceState.callbacks.onError = callback;
};

export const onDisconnected = (callback: (message: string) => void): void => {
  serviceState.callbacks.onDisconnected = callback;
};

// Check connection status
export const isSSHConnected = (): boolean => {
  return serviceState.isConnected;
};

export const isSSHConnecting = (): boolean => {
  return serviceState.isConnecting;
};

// Set debug mode
export const setDebugMode = (enabled: boolean): void => {
  serviceState.debugMode = enabled;
  if (typeof window !== "undefined") {
    if (enabled) {
      localStorage.setItem("ssh_debug_mode", "true");
    } else {
      localStorage.removeItem("ssh_debug_mode");
    }
  }
};

// Cleanup resources
export const cleanup = (): void => {
  if (serviceState.pingInterval) {
    clearInterval(serviceState.pingInterval);
    serviceState.pingInterval = null;
  }

  if (serviceState.reconnectTimer) {
    clearTimeout(serviceState.reconnectTimer);
    serviceState.reconnectTimer = null;
  }

  if (serviceState.dataTimeout) {
    clearTimeout(serviceState.dataTimeout);
    serviceState.dataTimeout = null;
  }

  // Process any remaining data
  if (serviceState.dataBuffer.length > 0) {
    processDataBuffer();
  }

  // Clear any pending commands
  clearCommandQueue("Service cleanup");

  if (serviceState.socket) {
    serviceState.socket.disconnect();
    serviceState.socket = null;
  }

  // Terminate worker if exists
  if (serviceState.dataWorker) {
    serviceState.dataWorker.terminate();
    serviceState.dataWorker = null;
  }

  serviceState.terminal = null;
  serviceState.isConnected = false;
  serviceState.isConnecting = false;
  serviceState.initialResizeSent = false;
  clearPersistentState();

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("ssh_connection_config");
  }
  serviceState.connectionConfig = null;

  console.log("[SSH Service] Service cleaned up");
};

// Reconnect to WebSocket server
export const reconnect = (): void => {
  if (!serviceState.socket || !serviceState.socket.connected) {
    console.log("[SSH Service] Reconnecting to WebSocket server");
    initSocket();
  } else if (serviceState.isConnected) {
    console.log("[SSH Service] Already connected, refreshing connection");
    refreshConnection();
  } else if (serviceState.connectionConfig) {
    console.log(
      "[SSH Service] Socket connected but SSH disconnected, reconnecting to SSH"
    );
    connect(serviceState.connectionConfig);
  } else {
    console.log(
      "[SSH Service] Socket connected but no connection config available"
    );
  }
};

// Get the current terminal instance
export const getTerminal = (): Terminal | null => {
  return serviceState.terminal;
};

// Restart shell session properly
export const restartShell = (): void => {
  if (!serviceState.isConnected || !serviceState.socket) {
    console.warn(
      "[SSH Service] Cannot restart shell: not connected to SSH server"
    );
    return;
  }

  console.log("[SSH Service] Requesting shell restart");
  serviceState.lastActivityTime = Date.now();

  // First clear any pending data in the terminal
  if (serviceState.terminal) {
    // Add a visual separator
    serviceState.terminal.writeln(
      "\r\n\x1b[1;33m--- Shell session restarted ---\x1b[0m\r\n"
    );
  }

  // Request server to restart the shell
  serviceState.socket.emit("ssh-restart-shell");

  // Reset terminal size after a short delay
  setTimeout(() => {
    sendInitialResize();
  }, 500);

  // Process any remaining data
  if (serviceState.dataBuffer.length > 0) {
    processDataBuffer();
  }

  // Clear any pending commands
  clearCommandQueue("Shell restarted");
};

// Refresh connection to handle state transitions
export const refreshConnection = (): void => {
  if (!serviceState.isConnected || !serviceState.socket) {
    console.warn(
      "[SSH Service] Cannot refresh connection: not connected to SSH server"
    );
    return;
  }

  console.log("[SSH Service] Refreshing SSH connection");
  serviceState.lastActivityTime = Date.now();

  // Process any remaining data
  if (serviceState.dataBuffer.length > 0) {
    processDataBuffer();
  }

  // Clear terminal display
  if (serviceState.terminal) {
    // Add a visual separator
    serviceState.terminal.writeln(
      "\r\n\x1b[1;34m--- Refreshing SSH connection ---\x1b[0m\r\n"
    );
  }

  // Notify server about refresh request
  serviceState.socket.emit("ssh-refresh-connection");

  // Make sure terminal dimensions are correct
  sendInitialResize();
};

// Execute a command on the SSH connection and return the result
export const executeCommand = async (
  command: string,
  options?: CommandOptions
): Promise<string> => {
  const mergedOptions = { ...DEFAULT_COMMAND_OPTIONS, ...options };
  let retryCount = 0;

  const executeWithRetry = async (): Promise<string> => {
    try {
      return await executeSingleCommand(command, mergedOptions);
    } catch (error) {
      retryCount++;

      // If we have retries left, try again after delay
      if (retryCount <= (mergedOptions.retry || 0)) {
        console.log(
          `[SSH Service] Command failed, retrying (${retryCount}/${mergedOptions.retry})...`
        );

        // Wait for retryDelay before trying again
        await new Promise((resolve) =>
          setTimeout(resolve, mergedOptions.retryDelay || 1000)
        );
        return executeWithRetry();
      }

      // No retries left, re-throw the error
      throw error;
    }
  };

  return executeWithRetry();
};

// Internal method to execute a single command
const executeSingleCommand = (
  command: string,
  options: CommandOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!serviceState.socket || !serviceState.isConnected) {
      reject(new Error("SSH not connected"));
      return;
    }

    // Generate a unique ID for this command execution
    const executionId = `cmd_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Create a timeout for the command
    const timeout = setTimeout(() => {
      // Remove this command from the queue
      serviceState.commandQueue = serviceState.commandQueue.filter(
        (item) => item.id !== executionId
      );
      reject(new Error("Command execution timed out"));
    }, options.timeout || 30000);

    // Add to command queue
    serviceState.commandQueue.push({
      id: executionId,
      resolve,
      reject,
      timeout,
    });

    // Send the command execution request with background flag
    serviceState.socket.emit("ssh-execute-command", {
      command,
      executionId,
      sessionId: serviceState.persistentId,
      stream: options.stream || false,
      background: options.background || false, // Include background flag
    });

    serviceState.lastActivityTime = Date.now();
  });
};

// Queue a command to be executed in batch mode for better performance
export const queueCommandForBatch = (
  command: string,
  priority: "high" | "normal" | "low" = "normal"
): void => {
  if (!serviceState.socket || !serviceState.isConnected) {
    console.warn("[SSH Service] Cannot queue command: not connected");
    return;
  }

  queueCommand(command, priority);
};

// Get the status of command queues - this is the public API
export const getQueueStatus = (): {
  high: number;
  normal: number;
  low: number;
  total: number;
} => {
  return getInternalQueueStatus();
};

// Advanced executeCommandBatch method with prioritized queuing
export const executeCommandBatch = async (
  commands: string[],
  priority: "high" | "normal" | "low" = "normal"
): Promise<Map<string, string>> => {
  if (!commands || commands.length === 0) {
    return new Map<string, string>();
  }

  return new Promise((resolve, reject) => {
    if (!serviceState.socket || !serviceState.isConnected) {
      reject(new Error("SSH not connected"));
      return;
    }

    // Generate batch ID
    const batchId = `batch_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Send the batch request
    serviceState.socket.emit("ssh-execute-batch", {
      commands,
      batchId,
      sessionId: serviceState.persistentId,
      priority,
    });

    serviceState.lastActivityTime = Date.now();

    // Create timeout handler
    const timeoutHandler = setTimeout(() => {
      serviceState.socket?.off("command-batch-result", resultHandler);
      reject(new Error("Batch execution timed out"));
    }, Math.max(60000, commands.length * 10000)); // 60 seconds or 10s per command, whichever is larger

    // Create result handler
    const resultHandler = (data: {
      batchId: string;
      results: Array<{ command: string; output: string; error?: string }>;
    }) => {
      if (data.batchId === batchId) {
        clearTimeout(timeoutHandler);
        serviceState.socket?.off("command-batch-result", resultHandler);

        const resultMap = new Map<string, string>();
        let hasErrors = false;

        data.results.forEach((result) => {
          if (result.error) {
            hasErrors = true;
            console.warn(
              `[SSH Service] Command error in batch: ${result.command} - ${result.error}`
            );
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

    serviceState.socket.on("command-batch-result", resultHandler);
  });
};

// Execute a command in the background (will not appear in terminal)
export const executeBackgroundCommand = async (
  command: string,
  options?: CommandOptions
): Promise<string> => {
  const mergedOptions = {
    ...DEFAULT_COMMAND_OPTIONS,
    ...options,
    background: true, // Force background flag
  };

  return executeCommand(command, mergedOptions);
};

// Execute multiple commands in the background
export const executeBackgroundBatch = async (
  commands: string[],
  priority: "high" | "normal" | "low" = "normal"
): Promise<Map<string, string>> => {
  if (!commands || commands.length === 0) {
    return new Map<string, string>();
  }

  return new Promise((resolve, reject) => {
    if (!serviceState.socket || !serviceState.isConnected) {
      reject(new Error("SSH not connected"));
      return;
    }

    // Generate batch ID
    const batchId = `batch_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Send the batch request with background flag
    serviceState.socket.emit("ssh-execute-batch", {
      commands,
      batchId,
      sessionId: serviceState.persistentId,
      priority,
      background: true, // Always run in background
    });

    serviceState.lastActivityTime = Date.now();

    // Create timeout handler
    const timeoutHandler = setTimeout(() => {
      serviceState.socket?.off("command-batch-result", resultHandler);
      reject(new Error("Batch execution timed out"));
    }, Math.max(60000, commands.length * 10000)); // 60 seconds or 10s per command, whichever is larger

    // Create result handler
    const resultHandler = (data: {
      batchId: string;
      results: Array<{
        command: string;
        output: string;
        error?: string;
        background?: boolean;
      }>;
      background?: boolean;
    }) => {
      if (data.batchId === batchId) {
        clearTimeout(timeoutHandler);
        serviceState.socket?.off("command-batch-result", resultHandler);

        const resultMap = new Map<string, string>();
        let hasErrors = false;

        data.results.forEach((result) => {
          if (result.error) {
            hasErrors = true;
            console.warn(
              `[SSH Service] Command error in batch: ${result.command} - ${result.error}`
            );
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

    serviceState.socket.on("command-batch-result", resultHandler);
  });
};

// Get performance metrics
export const getPerformanceMetrics = (): {
  renderTimes: number[];
  avgRenderTime: number;
  dataVolume: number;
  frameDrops: number;
  throttledCount: number;
  renderCount: number;
} => {
  const avgRenderTime =
    serviceState.performanceMetrics.renderTimes.length > 0
      ? serviceState.performanceMetrics.renderTimes.reduce((a, b) => a + b, 0) /
        serviceState.performanceMetrics.renderTimes.length
      : 0;

  return {
    renderTimes: [...serviceState.performanceMetrics.renderTimes],
    avgRenderTime,
    dataVolume: serviceState.performanceMetrics.dataVolume,
    frameDrops: serviceState.performanceMetrics.frameDrops,
    throttledCount: serviceState.performanceMetrics.throttledCount,
    renderCount: serviceState.performanceMetrics.renderCount,
  };
};

// Get batch execution metrics - this is the public API
export const getBatchMetrics =
  (): typeof serviceState.batchManagerState.metrics => {
    return getInternalBatchMetrics();
  };

// Get diagnostics information
export const getDiagnostics = (): {
  connected: boolean;
  connecting: boolean;
  sessionId: string | null;
  queueStatus: ReturnType<typeof getQueueStatus>;
  socketConnected: boolean;
  lastActivity: Date;
  bufferSize: number;
  performanceMode: PerformanceMode;
  highLoad: boolean;
  metrics: ReturnType<typeof getPerformanceMetrics>;
} => {
  return {
    connected: serviceState.isConnected,
    connecting: serviceState.isConnecting,
    sessionId: serviceState.persistentId,
    queueStatus: getQueueStatus(),
    socketConnected: serviceState.socket?.connected || false,
    lastActivity: new Date(serviceState.lastActivityTime),
    bufferSize: serviceState.dataBuffer.length,
    performanceMode: serviceState.performanceMode,
    highLoad: serviceState.isHighLoad,
    metrics: getPerformanceMetrics(),
  };
};

// Get the current socket instance
export const getSocket = (): Socket | null => {
  return serviceState.socket;
};

// Add these to the ssh-service.ts exports
export const killProcess = async (pid: number, signal: number = 15): Promise<string> => {
  if (!serviceState.isConnected) {
    throw new Error("SSH not connected");
  }
  
  console.log(`[SSH Service] Killing process ${pid} with signal ${signal}`);
  
  try {
    // Execute kill command with minimum timeout
    const killCommand = `kill -${signal} ${pid} 2>&1 || echo "Kill failed"`;
    const output = await executeCommand(killCommand, { 
      timeout: 3000, // Very short timeout
      background: false,
      priority: "high" // Use high priority queue
    });
    
    // Don't wait for verification, let UI update immediately
    // But start a background check to update the process list if needed
    setTimeout(async () => {
      try {
        await executeCommand(`ps -p ${pid} > /dev/null 2>&1 || systemctl reset-failed`, { 
          background: true,
          timeout: 1000
        });
        
        // Force refresh process list in background
        if (serviceState.socket) {
          serviceState.socket.emit("refresh-processes");
        }
      } catch (checkError) {
        // Ignore background check errors
      }
    }, 500); // Shorter check delay
    
    return output;
  } catch (error) {
    console.error(`[SSH Service] Kill command failed:`, error);
    
    // Don't try with sudo automatically, return the error
    throw error;
  }
};

export const reniceProcess = async (pid: number, priority: number): Promise<string> => {
  if (!serviceState.isConnected) {
    throw new Error("SSH not connected");
  }
  
  // Validate priority (-20 to 19, with -20 being highest priority and 19 lowest)
  if (priority < -20 || priority > 19) {
    throw new Error("Priority must be between -20 and 19");
  }
  
  console.log(`[SSH Service] Renicing process ${pid} to priority ${priority}`);
  return executeCommand(`renice ${priority} -p ${pid}`, { background: false });
};

// Initialize the service
initService();

// Export all the functions
export default {
  setTerminal,
  setPerformanceMode,
  connect,
  disconnect,
  sendData,
  resize,
  onConnected,
  onData,
  onError,
  onDisconnected,
  isSSHConnected,
  isSSHConnecting,
  setDebugMode,
  cleanup,
  reconnect,
  getTerminal,
  restartShell,
  refreshConnection,
  killProcess,
  reniceProcess,
  executeCommand,
  queueCommand: queueCommandForBatch,
  getQueueStatus,
  getSocket,
  executeCommandBatch,
  getPerformanceMetrics,
  getBatchMetrics,
  getDiagnostics,
  executeBackgroundCommand,
  executeBackgroundBatch,
};
