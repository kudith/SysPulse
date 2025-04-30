'use client'

import { useEffect, useState, useRef } from 'react';

export const AnimatedTerminal = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullTextRef = useRef(`$ ssh admin@server.syspulse.dev
Password: ********
Connected to SysPulse Server v1.3.4

$ syspulse status
✓ System monitoring active
✓ CPU usage: 12.4%
✓ Memory: 3.2GB / 16GB
✓ Disk: 234GB / 1TB
✓ Network: 24MB/s ↓ 8MB/s ↑

$ syspulse scan --all
Scanning all systems...
[================] 100%
No vulnerabilities detected!

$ syspulse optimize
Optimizing system performance...
Cleaning temp files...
Adjusting process priorities...
Complete! System performance improved by 23%

$ _`);
  const charIndexRef = useRef(0);
  const TYPING_SPEED = 30; // milliseconds per character
  const terminalRef = useRef<HTMLDivElement>(null);

  // Typing effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (charIndexRef.current < fullTextRef.current.length) {
        setText(fullTextRef.current.substring(0, charIndexRef.current + 1));
        charIndexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#3fdaa4]/20 shadow-2xl shadow-[#3fdaa4]/10 bg-[#161616] group">
      {/* Terminal top reflection */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6be5fd]/50 to-transparent"></div>
      
      {/* Side reflections */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-[#6be5fd]/50 via-transparent to-[#3fdaa4]/30"></div>
      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-[#6be5fd]/50 via-transparent to-[#3fdaa4]/30"></div>
      
      {/* Terminal header */}
      <div className="h-7 bg-[#1a1a1a] flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xs text-[#6be5fd]/70">
          terminal@syspulse
        </div>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="p-6 h-[380px] overflow-hidden bg-[#0c0c0c] border-t border-[#3fdaa4]/10 font-mono text-sm"
      >
        <pre className="text-[#a8aebb] whitespace-pre-wrap">
          {text}
          <span className={`text-[#6be5fd] ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </pre>
      </div>
      
      {/* Terminal glow effect that intensifies on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6be5fd]/0 via-transparent to-[#3fdaa4]/0 group-hover:from-[#6be5fd]/5 group-hover:to-[#3fdaa4]/5 transition-all duration-700 pointer-events-none"></div>
      
      {/* Bottom reflection */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3fdaa4]/50 to-transparent"></div>
    </div>
  );
}; 