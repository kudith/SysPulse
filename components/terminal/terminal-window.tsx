"use client"

import { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import sshService from "@/lib/ssh-service";
import 'xterm/css/xterm.css';

interface TerminalWindowProps {
  connected: boolean;
}

export const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(({ connected }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null); // Store terminal reference in a ref
  const fitAddonRef = useRef<any>(null); // Store fitAddon in a ref
  const weblinksAddonRef = useRef<any>(null); // Store weblinks addon
  const searchAddonRef = useRef<any>(null); // Store search addon
  const [isMounted, setIsMounted] = useState(false);
  const initAttemptedRef = useRef(false);
  const connectionErrorsRef = useRef(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Function to initialize terminal with better error handling and performance options
  const initializeTerminal = useCallback(async () => {
    try {
      // Import terminal modules with retry logic
      const importModules = async (retries = 3): Promise<[any, any, any, any]> => {
        try {
          const [
            { Terminal }, 
            { FitAddon }, 
            { WebLinksAddon },
            { SearchAddon }
          ] = await Promise.all([
            import('xterm'),
            import('xterm-addon-fit'),
            import('xterm-addon-web-links'),
            import('xterm-addon-search')
          ]);
          
          return [Terminal, FitAddon, WebLinksAddon, SearchAddon];
        } catch (err) {
          if (retries > 0) {
            console.warn(`Failed to load terminal modules, retrying (${retries} attempts left)...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return importModules(retries - 1);
          }
          throw err;
        }
      };
      
      console.log('Loading terminal modules...');
      const [Terminal, FitAddon, WebLinksAddon, SearchAddon] = await importModules();
      
      console.log('Creating terminal instance with optimal settings');
      
      // Create terminal with optimized config for performance
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 15,
        fontFamily: 'JetBrains Mono, Cascadia Code, monospace',
        theme: {
          background: '#161616',           
          foreground: '#d8dee9',           
          cursor: '#d8dee9',               
          cursorAccent: '#161616',         
          black: '#3b4252',                
          red: '#ec6a88',                  
          green: '#3fdaa4',                
          yellow: '#fbc3a7',               
          blue: '#6be5fd',                 
          magenta: '#c792ea',              
          cyan: '#70e1e8',                 
          white: '#d8dee9',                
          brightBlack: '#4c566a',          
          brightRed: '#ff8e99',            
          brightGreen: '#42f5aa',          
          brightYellow: '#ffd4be',         
          brightBlue: '#90f2ff',           
          brightMagenta: '#d8b9ff',        
          brightCyan: '#a6f8fd',           
          brightWhite: '#eceff4',          
          selectionBackground: '#3b4252',  
          selectionForeground: '#eceff4',  
        },
        scrollback: 5000,              // Increased scrollback for better UX
        cursorStyle: 'block',          
        cursorWidth: 2,                
        allowTransparency: false,      // Disable transparency for performance
        convertEol: true,              // Convert '\n' to '\r\n' for better compatibility
        disableStdin: false,           // Ensure input is enabled
        rendererType: 'canvas',        // Use canvas renderer for best performance
        screenReaderMode: false,       // Disable screen reader for performance
        fastScrollSensitivity: 10,     // Faster scrolling
        fastScrollModifier: 'alt',     // Use Alt key for fast scrolling
        rightClickSelectsWord: true,   // Better UX for text selection
        allowProposedApi: true,        // Enable proposed API features
        macOptionIsMeta: true,         // Better macOS compatibility
        macOptionClickForcesSelection: false, // Don't force selection on Option+click
        windowsMode: navigator.platform.indexOf('Win') !== -1, // Enable Windows-specific behaviors
      });

      // Create and load addons
      const fit = new FitAddon();
      term.loadAddon(fit);
      fitAddonRef.current = fit;
      
      // Add WebLinks addon for clickable links
      const weblinks = new WebLinksAddon((event, uri) => {
        // Open links in a new tab
        window.open(uri, '_blank');
      }, { 
        // Fix: Use a proper RegExp object instead of a string pattern with flags
        urlRegex: new RegExp('(https?:\\/\\/[^\\s]+)', 'i'),
        tooltipCallback: (text: string) => `Click to open: ${text}`,
        leaveCallback: () => {/* empty */},
        priority: 0
      });
      term.loadAddon(weblinks);
      weblinksAddonRef.current = weblinks;
      
      // Add search addon
      const searchAddon = new SearchAddon();
      term.loadAddon(searchAddon);
      searchAddonRef.current = searchAddon;
      
      // Store terminal reference
      xtermRef.current = term;

      if (!terminalRef.current) {
        throw new Error('Terminal container not found');
      }

      // Open terminal in DOM container - with error handling
      try {
        term.open(terminalRef.current);
        console.log('Terminal opened in container');
      } catch (err) {
        console.error('Error opening terminal:', err);
        
        // Try again after a delay
        setTimeout(() => {
          if (terminalRef.current && term) {
            try {
              term.open(terminalRef.current);
              console.log('Terminal opened on second attempt');
            } catch (retryErr) {
              console.error('Fatal error opening terminal on retry:', retryErr);
              setIsMounted(false);
              return;
            }
          }
        }, 500);
      }
      
      // Setup keyboard input handling with improved buffer and throttling
      let inputBuffer = '';
      let lastInputTime = 0;
      const INPUT_THROTTLE_MS = 5; // 5ms throttle for smoother input
      
      term.onData(data => {
        const now = Date.now();
        // Log key presses only for debugging
        if (data.length === 1) {
          console.log(`Key pressed: "${data.replace(/\n/g, '\\n').replace(/\r/g, '\\r')}"`);
        } else {
          console.log(`Special key: ${data.length} bytes`);
        }
        
        // If connected and enough time has passed, send data directly
        if (connected && sshService.isSSHConnected() && now - lastInputTime > INPUT_THROTTLE_MS) {
          sshService.sendData(data);
          lastInputTime = now;
        } 
        // Otherwise buffer the input
        else if (connected && sshService.isSSHConnected()) {
          inputBuffer += data;
          
          // If we have a buffer and haven't sent recently, send the buffer
          if (inputBuffer && now - lastInputTime > INPUT_THROTTLE_MS) {
            sshService.sendData(inputBuffer);
            inputBuffer = '';
            lastInputTime = now;
          }
        }
      });
      
      // Ensure any buffered input gets sent
      const flushInputInterval = setInterval(() => {
        if (inputBuffer && connected && sshService.isSSHConnected()) {
          sshService.sendData(inputBuffer);
          inputBuffer = '';
          lastInputTime = Date.now();
        }
      }, 16); // ~60fps, ensures responsive input
      
      // Register with SSH service
      sshService.setTerminal(term);
      console.log('Terminal registered with SSH service');
      
      // Welcome message
      term.writeln('\r\n\x1b[1;32m Terminal Initialized \x1b[0m');
      term.writeln('\r\n\x1b[90m Ready for SSH connection... \x1b[0m\r\n');
      
      // Mark as mounted to show terminal
      setIsMounted(true);
      
      // Create a ResizeObserver for dynamic resizing
      if (terminalRef.current && 'ResizeObserver' in window) {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        
        resizeObserverRef.current = new ResizeObserver(entries => {
          if (!terminalRef.current) return;
          
          // Rate limit resize operations for better performance
          window.requestAnimationFrame(() => {
            try {
              if (fit && term) {
                fit.fit();
                if (connected && sshService.isSSHConnected()) {
                  sshService.resize(term.cols, term.rows);
                }
              }
            } catch (err) {
              console.error('Error during ResizeObserver callback:', err);
            }
          });
        });
        
        resizeObserverRef.current.observe(terminalRef.current);
      }
      
      // Fit and focus terminal with better timing
      // Use requestAnimationFrame for smoother visual updates
      window.requestAnimationFrame(() => {
        try {
          fit.fit();
          term.focus();
          console.log('Terminal fitted and focused');
          
          // Send terminal dimensions to server if connected
          if (connected && sshService.isSSHConnected()) {
            sshService.resize(term.cols, term.rows);
          }
        } catch (err) {
          console.error('Error during initial fit:', err);
        }
      });
      
      // Setup error handler for connection issues
      sshService.onError((errorMsg) => {
        // Increment error count
        connectionErrorsRef.current += 1;
        
        console.error('SSH connection error:', errorMsg);
        
        // After multiple consecutive errors, suggest reconnecting
        if (connectionErrorsRef.current > 3) {
          term.writeln('\r\n\x1b[1;31m Multiple connection errors detected. Try refreshing the page or reconnecting. \x1b[0m\r\n');
        }
      });
      
      sshService.onConnected(() => {
        // Reset error counter when successfully connected
        connectionErrorsRef.current = 0;
      });
      
      // Clean up resources when component unmounts
      return () => {
        clearInterval(flushInputInterval);
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        }
      };
      
    } catch (err) {
      console.error('Critical error initializing terminal:', err);
      setIsMounted(false);
      
      // Try to recover
      setTimeout(() => {
        if (!initAttemptedRef.current) {
          console.log('Attempting terminal recovery after critical error');
          initAttemptedRef.current = false; // Allow another attempt
          initializeTerminal();
        }
      }, 2000);
    }
  }, [connected]);
  
  // Initialize terminal only once when component mounts
  useEffect(() => {
    // Prevent multiple initializations
    if (initAttemptedRef.current) return;
    initAttemptedRef.current = true;
    
    console.log('Starting terminal initialization');
    
    if (!terminalRef.current) {
      console.error('Terminal container element not found');
      return;
    }

    // Initialize the terminal
    initializeTerminal();
    
    // Cleanup function
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      
      if (xtermRef.current) {
        try {
          // Remove from SSH service before disposing
          sshService.setTerminal(null);
          xtermRef.current.dispose();
          console.log('Terminal disposed');
        } catch (err) {
          console.error('Error disposing terminal:', err);
        }
      }
    };
  }, []); // Initialize ONCE only
  
  // Handle connection status changes
  useEffect(() => {
    const term = xtermRef.current;
    if (!term || !isMounted) return;
    
    // Write connection status message
    if (connected && sshService.isSSHConnected()) {
      term.writeln('\r\n\x1b[1;32m Connected to SSH server \x1b[0m\r\n');
      // Reset error counter on successful connection
      connectionErrorsRef.current = 0;
    } else if (connected && !sshService.isSSHConnected()) {
      term.writeln('\r\n\x1b[1;33m Connecting to SSH server... \x1b[0m\r\n');
    } else {
      term.writeln('\r\n\x1b[1;31m Not connected to SSH server \x1b[0m\r\n');
    }
    
    // Focus the terminal
    term.focus();
    
    // Update terminal size
    const fit = fitAddonRef.current;
    if (fit) {
      try {
        // Use requestAnimationFrame for smoother visual updates
        window.requestAnimationFrame(() => {
          fit.fit();
          if (connected && sshService.isSSHConnected()) {
            sshService.resize(term.cols, term.rows);
          }
        });
      } catch (err) {
        console.error('Error resizing on connection change:', err);
      }
    }
  }, [connected, isMounted]);
  
  // Handle window resize
  useEffect(() => {
    const term = xtermRef.current;
    const fit = fitAddonRef.current;
    
    if (!term || !fit || !isMounted) return;
    
    // Use debounced resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        try {
          if (fit && term) {
            fit.fit();
            if (connected && sshService.isSSHConnected()) {
              sshService.resize(term.cols, term.rows);
            }
          }
        } catch (err) {
          console.error('Error handling window resize:', err);
        }
      }, 100); // 100ms debounce
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial resize
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [connected, isMounted]);
  
  // Click handler to focus terminal
  const handleClick = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.focus();
    }
  }, []);

  return (
    <div 
      ref={ref}
      className="flex-1 relative bg-[#161616]"
      onClick={handleClick}
    >
      <div 
        ref={terminalRef}
        className="absolute inset-0 p-2"
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          zIndex: 10
        }}
      />
      
      {!isMounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212] text-white/70 z-20">
          Initializing terminal...
        </div>
      )}
    </div>
  );
});

TerminalWindow.displayName = "TerminalWindow";