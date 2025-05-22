"use client";

import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { motion } from "framer-motion";
import sshService from "@/lib/ssh-service";
import systemMonitoring from "@/lib/system-monitoring/system-stats";
import type { ResourceData } from "@/lib/types";
import { ReactElement } from "react";

export function ResourceGraph({ refreshTrigger = 0 }) {
  // Add current time state
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [cpuHistory, setCpuHistory] = useState<ResourceData[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<ResourceData[]>([]);
  const [activeTab, setActiveTab] = useState("cpu");
  const [connected, setConnected] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  // Track if component is mounted
  const isMounted = useRef(true);

  // Add function to render the most recent data point as animated
  // Fix: Properly type the props and ensure it always returns an SVG ReactElement
  const renderDot = (props: any): ReactElement<SVGElement> => {
    const { cx, cy, index, dataLength } = props;

    // Only highlight the last point (most recent)
    if (index === dataLength - 1) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={props.stroke}
          stroke="none"
          className="animate-pulse"
        />
      );
    }
    // Return an empty SVG element instead of null
    return <circle cx={0} cy={0} r={0} fill="none" />;
  };

  // Subscribe to system monitoring service to get real-time updates
  useEffect(() => {
    // Update the time display every second
    const timeInterval = setInterval(() => {
      if (isMounted.current) {
        setCurrentTime(new Date().toLocaleTimeString());
      }
    }, 1000);

    // Check initial connection status - IMPROVED VERSION
    const checkConnection = () => {
      const isConnected = sshService.isSSHConnected();
      
      // Only log and update if the state actually changes
      if (isConnected !== connected) {
        console.log("Connection status changed to:", isConnected);
        setConnected(isConnected);
        
        if (isConnected) {
          console.log("ResourceGraph: Triggering initial data refresh after connection");
          // If we just detected connection, refresh stats
          setTimeout(() => {
            systemMonitoring.refreshStats().then(stats => {
              // Force update with latest data
              setCpuHistory([...stats.cpu]);
              setMemoryHistory([...stats.memory]);
              setUpdateCounter(prev => prev + 1);
            });
          }, 500);
        }
      }
    };

    // Check immediately on mount
    checkConnection();

    // Also check periodically as a safety measure
    const connectionCheckInterval = setInterval(checkConnection, 1000);

    // Set up event listeners for SSH connection changes
    const handleConnected = () => {
      if (!isMounted.current) return;
      console.log("ResourceGraph: SSH connected event received");
      setConnected(true);

      // Add a small delay to ensure connection is ready
      setTimeout(() => {
        systemMonitoring.refreshStats(); // Fetch data immediately on connection
      }, 500);
    };

    const handleDisconnected = () => {
      if (!isMounted.current) return;
      console.log("ResourceGraph: SSH disconnected event received");
      setConnected(false);
    };

    sshService.onConnected(handleConnected);
    sshService.onDisconnected(handleDisconnected);

    // Subscribe to system monitoring updates
    const unsubscribe = systemMonitoring.subscribe((stats) => {
      if (!isMounted.current) return;

      // Make sure we have valid arrays with data
      const validCpuData = Array.isArray(stats.cpu) && stats.cpu.length > 0;
      const validMemoryData = Array.isArray(stats.memory) && stats.memory.length > 0;

      console.log("Resource graph received update:", {
        cpuPoints: stats.cpu.length,
        memoryPoints: stats.memory.length,
        latestCpu: validCpuData ? stats.cpu[stats.cpu.length - 1]?.value : 'none',
        latestMemory: validMemoryData ? stats.memory[stats.memory.length - 1]?.value : 'none',
        timestamp: new Date().toLocaleTimeString(),
      });

      // Make deep copies of arrays to ensure React detects the change
      setCpuHistory([...stats.cpu]);
      setMemoryHistory([...stats.memory]);

      // Force a re-render
      setUpdateCounter(prev => prev + 1);

      // Update connected status if needed (data receipt confirms connection)
      if (!connected && sshService.isSSHConnected()) {
        setConnected(true);
      }
    });

    // Setup fallback polling for when WebSocket fails
    const pollInterval = setInterval(() => {
      if (sshService.isSSHConnected()) {
        systemMonitoring
          .refreshStats()
          .catch((err) => {
            console.log("Fallback polling error:", err);
          });
      }
    }, 3000); // Poll every 3 seconds as fallback

    // Get initial data
    if (sshService.isSSHConnected()) {
      const stats = systemMonitoring.getCurrentStats();
      setCpuHistory(stats.cpu);
      setMemoryHistory(stats.memory);
    }

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      unsubscribe();
      clearInterval(pollInterval);
      clearInterval(timeInterval);
      clearInterval(connectionCheckInterval); // Clear the new interval
      sshService.onConnected(() => {});
      sshService.onDisconnected(() => {});
    };
  }, []);

  // Add effect to handle refresh triggers
  useEffect(() => {
    if (refreshTrigger > 0 && sshService.isSSHConnected()) {
      systemMonitoring
        .refreshStats()
        .catch((err) => console.error("Manual refresh error:", err));
    }
  }, [refreshTrigger]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#282a36] p-3 border border-zinc-700/30 rounded-md text-[#f8f8f2] shadow-xl">
          <p className="text-[#6be5fd] font-mono text-xs">{`${label}`}</p>
          <p className="text-sm font-medium mt-1">
            <span
              className={
                payload[0].name === "CPU" ? "text-[#6be5fd]" : "text-[#c792ea]"
              }
            >
              {`${payload[0].name}: `}
            </span>
            <span
              className={`${
                Number(payload[0].value) > 70
                  ? "text-[#ec6a88]"
                  : Number(payload[0].value) > 50
                  ? "text-[#fbc3a7]"
                  : "text-[#3fdaa4]"
              }`}
            >
              {`${Number(payload[0].value).toFixed(1)}%`}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="relative">
      {!connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]/60 z-10 rounded-lg backdrop-blur-sm">
          <div className="text-[#f8f8f2] text-center p-4">
            <p className="mb-2 text-[#ec6a88]">Not connected to a system</p>
            <p className="text-sm text-[#d8dee9]/70">
              Connect via SSH to view real-time system statistics
            </p>
          </div>
        </div>
      )}

      {/* Add current time display */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-[#a8aebb]">
          Current time:{" "}
          <span className="text-[#6be5fd] font-mono">{currentTime}</span>
        </span>
      </div>

      <Tabs
        defaultValue="cpu"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="bg-[#282a36] border-b border-zinc-800/30 mb-6 w-full flex justify-start">
          <TabsTrigger
            value="cpu"
            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#6be5fd] data-[state=active]:border-b-2 data-[state=active]:border-[#6be5fd] text-[#d8dee9]/70 px-6 py-2 rounded-none transition-all"
          >
            CPU Usage
          </TabsTrigger>
          <TabsTrigger
            value="memory"
            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#c792ea] data-[state=active]:border-b-2 data-[state=active]:border-[#c792ea] text-[#d8dee9]/70 px-6 py-2 rounded-none transition-all"
          >
            Memory Usage
          </TabsTrigger>
        </TabsList>

        {/* Use updateCounter in the key to force re-renders */}
        <TabsContent
          value="cpu"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          key={`cpu-${updateCounter}`}
        >
          {cpuHistory.length === 0 && (
            <div className="flex items-center justify-center h-[250px] text-[#6be5fd]">
              No CPU data available yet
            </div>
          )}
          {cpuHistory.length > 0 && (
            <div className="text-xs text-[#6be5fd] mb-2">
              {`${cpuHistory.length} data points available (latest: ${cpuHistory[cpuHistory.length-1]?.value.toFixed(1)}%)`}
            </div>
          )}
          <motion.div
            className="h-[250px] w-full"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cpuHistory}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2e3b" />
                <XAxis
                  dataKey="time"
                  stroke="#4c566a"
                  tick={{ fill: "#d8dee9", fontSize: 12 }}
                  axisLine={{ stroke: "#4c566a" }}
                  tickLine={{ stroke: "#4c566a" }}
                  interval={Math.ceil(cpuHistory.length / 5) - 1} // Show 5 evenly distributed ticks
                  minTickGap={10}
                  tickFormatter={(value) =>
                    value.split(":")[0] +
                    ":" +
                    value.split(":")[1] +
                    ":" +
                    value.split(":")[2]
                  }
                />
                <YAxis
                  stroke="#4c566a"
                  tick={{ fill: "#d8dee9", fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={{ stroke: "#4c566a" }}
                  tickLine={{ stroke: "#4c566a" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="CPU"
                  stroke="#6be5fd"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#6be5fd", strokeWidth: 0 }}
                  animationDuration={0}
                  isAnimationActive={false}
                  // Fixed: Removed duplicate dot prop and use only the custom renderer
                  dot={(props) =>
                    renderDot({
                      ...props,
                      dataLength: cpuHistory.length,
                      stroke: "#6be5fd",
                    })
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>

        {/* Use updateCounter in the key to force re-renders */}
        <TabsContent
          value="memory"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          key={`memory-${updateCounter}`}
        >
          {memoryHistory.length === 0 && (
            <div className="flex items-center justify-center h-[250px] text-[#6be5fd]">
              No Memory data available yet
            </div>
          )}
          {memoryHistory.length > 0 && (
            <div className="text-xs text-[#6be5fd] mb-2">
              {`${memoryHistory.length} data points available (latest: ${memoryHistory[memoryHistory.length-1]?.value.toFixed(1)}%)`}
            </div>
          )}
          <motion.div
            className="h-[250px] w-full"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={memoryHistory}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2e3b" />
                <XAxis
                  dataKey="time"
                  stroke="#4c566a"
                  tick={{ fill: "#d8dee9", fontSize: 12 }}
                  axisLine={{ stroke: "#4c566a" }}
                  tickLine={{ stroke: "#4c566a" }}
                  interval={Math.ceil(memoryHistory.length / 5) - 1} // Show 5 evenly distributed ticks
                  minTickGap={10}
                  tickFormatter={(value) =>
                    value.split(":")[0] +
                    ":" +
                    value.split(":")[1] +
                    ":" +
                    value.split(":")[2]
                  }
                />
                <YAxis
                  stroke="#4c566a"
                  tick={{ fill: "#d8dee9", fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={{ stroke: "#4c566a" }}
                  tickLine={{ stroke: "#4c566a" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Memory"
                  stroke="#c792ea"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#c792ea", strokeWidth: 0 }}
                  animationDuration={0}
                  isAnimationActive={false}
                  // Fixed: Removed duplicate dot prop and use only the custom renderer
                  dot={(props) =>
                    renderDot({
                      ...props,
                      dataLength: memoryHistory.length,
                      stroke: "#c792ea",
                    })
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}