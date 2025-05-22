"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Bug } from "lucide-react";
import "xterm/css/xterm.css";

export function SimpleTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Add a log entry
  const addLog = (message: string) => {
    console.log(`[Debug Terminal] ${message}`);
    setLogs((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const initializeDebugTerminal = async () => {
      try {
        addLog("Loading xterm.js");

        // Import terminal
        const { Terminal } = await import("xterm");
        const { FitAddon } = await import("xterm-addon-fit");

        addLog("Creating terminal instance");

        // Create terminal with simple configuration
        const term = new Terminal({
          cursorBlink: true,
          fontFamily: "monospace",
          fontSize: 16,
          theme: {
            background: "#121212",
            foreground: "#A9B7C6",
            cursor: "#ffffff",
          },
        });

        // Create fit addon
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        xtermRef.current = term;

        addLog("Opening terminal");

        // Open terminal in container
        if (terminalRef.current) {
          term.open(terminalRef.current);
        } else {
          addLog("Terminal container not found");
          return;
        }

        // Set up data handler for local echo
        term.onData((data) => {
          addLog(`Key pressed: ${JSON.stringify(data)}`);
          term.write(data);
        });

        // Display welcome message
        term.writeln("\r\n\x1b[1;33m==== DEBUG TERMINAL ====\x1b[0m");
        term.writeln("Type anything to verify keyboard input is working.");
        term.writeln("Press Enter to execute commands.\r\n");

        // Focus terminal
        setTimeout(() => {
          try {
            fitAddon.fit();
            term.focus();
            setIsReady(true);
            addLog("Initialization complete");
          } catch (err) {
            addLog(`Error: ${err}`);
          }
        }, 100);
      } catch (err) {
        addLog(`Initialization error: ${err}`);
      }
    };

    initializeDebugTerminal();
  }, []);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between bg-gray-900 p-2 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Bug size={16} className="text-yellow-500" />
          <span className="font-mono text-sm text-gray-300">
            Debug Terminal
          </span>
        </div>
        <div className="text-gray-500 text-xs">Local Echo Mode</div>
      </div>

      <div className="relative flex-1">
        <div
          ref={terminalRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />

        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 z-10">
            <Terminal className="animate-pulse text-blue-500 mb-2" size={32} />
            <p className="text-gray-300 text-sm">
              Initializing debug terminal...
            </p>
          </div>
        )}
      </div>

      {/* Log panel */}
      <div className="bg-gray-900 border-t border-gray-800 p-2 h-24 overflow-y-auto">
        <h4 className="text-xs text-gray-500 mb-1">Debug Logs:</h4>
        <div className="space-y-1">
          {logs.slice(-5).map((log, i) => (
            <div key={i} className="text-xs text-gray-400">
              <span className="text-gray-600">
                [{new Date().toLocaleTimeString()}]
              </span>{" "}
              {log}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
