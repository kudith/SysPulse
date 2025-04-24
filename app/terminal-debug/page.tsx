"use client"

import { SimpleTerminal } from "@/components/terminal/simple-terminal";

export default function TerminalDebugPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Terminal Debug Page</h1>
      <div className="border border-gray-700 rounded overflow-hidden">
        <SimpleTerminal />
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>This is a simple terminal to test if keyboard input works at all.</p>
        <p>If this works but the SSH terminal doesn't, the issue is with SSH communication.</p>
        <p>If this also doesn't work, there's an issue with xterm.js initialization.</p>
      </div>
    </div>
  );
}