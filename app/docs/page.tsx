"use client"

import Link from 'next/link';
import { Terminal, Server, Gauge, Shield, Code, Settings, ArrowRight, Clock, Bookmark, Search, Github, Database, Bell, Wifi, Coffee, HelpCircle, Cpu, Activity, HardDrive, ExternalLink, Zap, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Docs() {
  const [activeId, setActiveId] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0); 

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let closestSection: string | null = null;
      let minDistance = Infinity;
  
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
  
        if (top <= 100 && Math.abs(top) < minDistance) {
          minDistance = Math.abs(top);
          closestSection = section.id;
        }
      });
  
      if (closestSection) {
        setActiveId(closestSection);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // panggil langsung untuk inisialisasi awal
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);  

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#161616] text-[#d8dee9]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-[#d8dee9] mb-4">SysPulse Documentation</h1>
          <p className="text-[#a8aebb] text-lg mb-8">
           Learn how to monitor and manage your system with SysPulse’s comprehensive features and tools.
          </p>

          {/* Search box */}
          <div className="relative mb-10">
            <div className="flex items-center border border-[#3fdaa4]/30 bg-[#161616] rounded-lg overflow-hidden">
              <div className="pl-4">
                <Search className="h-5 w-5 text-[#6be5fd]" />
              </div>
              <input
                type="text"
                placeholder="Cari dokumentasi..."
                className="w-full py-3 px-4 bg-transparent text-[#d8dee9] placeholder-[#a8aebb] outline-none"
              />
              <button className="px-5 py-3 bg-[#3fdaa4]/10 text-[#3fdaa4] font-medium hover:bg-[#3fdaa4]/20 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Start</h3>
                <ul className="space-y-2">
                  <li>
                  <Link 
                    href="#pengenalan" 
                    className={`block px-3 py-1.5 rounded-md transition-colors ${
                      activeId === 'pengenalan' 
                        ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                        : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                    }`}
                  >
                    Introduction
                  </Link>

                  </li>
                  <li>
                    <Link 
                      href="#instalasi" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'instalasi' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Getting Started with the Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#panduan-cepat" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'panduan-cepat' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Quick Start Guide
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Main Features</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#dashboard" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'dashboard' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#terminal" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'terminal' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Terminal
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#pemantauan" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'pemantauan' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                      >
                      Monitoring
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#pemberitahuan" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'pemberitahuan' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Alerts & Notifications
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Connections</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#koneksi-ssh" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'koneksi-ssh' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      SSH Connections
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#ngrok" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'ngrok' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Ngrok Setup
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#vm-cloud" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'vm-cloud' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      VM Cloud
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Advanced</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#integrasiApi" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'api' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      API Integration
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#keamanan" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'keamanan' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#pemecahanMasalah" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'pemecahan-masalah' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Troubleshooting
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-12">
            {/* Pengenalan Section */}
            <section id="pengenalan" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Introduction</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse is a comprehensive system monitoring and management platform designed for 
                  system administrators, DevOps engineers, and IT professionals. The platform 
                  provides real-time insights into your server performance, secure terminal access, and advanced automation tools.
                </p>
                
                <h3 className="font-bolder text-[#6be5fd] mt-4">Main Features</h3>
                <ul>
                  <li>- Real-time system monitoring with customizable dashboards</li>
                  <li>- Secure web-based terminal access to your servers</li>
                  <li>- Alerting and notification system for critical events</li>
                  <li>- Historical data analytics and reporting</li>
                  <li>- Role-based access control for team collaboration</li>
                  <li>- API integration for workflow automation</li>
                </ul>
              </div>
            </section>
            
            {/* Instalasi Section */}
            <section id="instalasi" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center">
                  <Server className="h-5 w-5 text-[#3fdaa4]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Getting Started with the Dashboard</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse is a web-based system monitoring platform that requires no special installation.
                  Simply access it through your browser and start monitoring your servers by following these steps.
                </p>
                
                <h3>Initial Preparation</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-3">
                    <li>
                      <strong className="text-[#d8dee9]">Create Account</strong>
                        <p className="mt-1">Sign up for a new SysPulse account or log in with your existing account on the hompage</p>
                    </li>
                    <li>
                      <strong className="text-[#d8dee9]">Access the Dashboard</strong>
                        <p className="mt-1">After logging in, you will be redirected to the main dashboard displaying a system overview.</p>
                    </li>
                    <li>
                      <strong className="text-[#d8dee9]">Add SSH Connection</strong>
                      <p className="mt-1">To monitor your server, you need to add an SSH connection using the provided form</p>
                    </li>
                  </ol>
                </div>
                
                <h3 className=" font-bold text-[#d8dee9] text-[#6be5fd]">SSH Connection Form</h3>
                <p>
                  To connect your server to SysPulse, fill out the SSH form with the following information:
                </p>
                
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6 text-[green]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Connection Information</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Host:</strong>
                          <p className="mt-1">Your server's IP address or hostname</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Username:</strong>
                          <p className="mt-1">Username for SSH login</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Port:</strong>
                          <p className="mt-1">SSH port(default: 22)</p>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Authentication</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Private Key:</strong>
                          <p className="mt-1">Paste your SSH private key or upload from a file</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Passphrase (optional):</strong>
                          <p className="mt-1">If your private key is protected with a passphrase</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-[#282a36] p-4 rounded-md">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="h-5 w-5 text-[#ff79c6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#ff79c6] font-medium">Security Note</span>
                    </div>
                    <p className="text-[#a8aebb]">Your private key is only used for the connection and is never stored on the SysPulse server. Always use a key with limited permissions and enable a passphrase for extra security.</p>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#6be5fd]">Connection Steps</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-4">
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">1</div>
                        <span className="text-[#d8dee9] font-medium">Open SSH Page</span>
                      </div>
                      <p className="mt-1 ml-8">Navigate to the "Connections" menu in the main navigation panel and select "Add Server"</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">2</div>
                        <span className="text-[#d8dee9] font-medium">Fill Connection Form</span>
                      </div>
                      <p className="mt-1 ml-8">Enter your server connection details (host, username, port, and private key)</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">3</div>
                        <span className="text-[#d8dee9] font-medium">Connect</span>
                      </div>
                      <p className="mt-1 ml-8">Click the "Connect" button and wait until the connection is successfully established</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">4</div>
                        <span className="text-[#d8dee9] font-medium">Access Dashboard</span>
                      </div>
                      <p className="mt-1 ml-8">Once connected, you will see the server monitoring dashboard</p>
                    </li>
                  </ol>
                </div>
              </div>
            </section>
            
            {/* Panduan Cepat Section */}
            <section id="panduan-cepat" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#c792ea]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Quick Start Guide</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  After successfully connecting, you can immediately use SysPulse features. This quick guide will help you 
                  understand how to use the monitoring dashboard and access the main features.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Dashboard Navigation</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Main Navigation Panel</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Dashboard</strong>
                          <p className="mt-1">Overview of all server metrics in a unified view</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Terminal</strong>
                          <p className="mt-1">Web-based terminal access to manage the server</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Monitoring</strong>
                          <p className="mt-1">Detailed view of system metrics (CPU, memory, disk, network)</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Alert</strong>
                          <p className="mt-1">Manage and configure system alerts</p>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Server Settings</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Connections</strong>
                          <p className="mt-1">Manage server SSH connections</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Security</strong>
                          <p className="mt-1">Security and server access setting</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Logs</strong>
                          <p className="mt-1">View and analyze server system logs</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Preference</strong>
                          <p className="mt-1">Customize dashboard appearance and settings</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Dashboard Usage</h3>
                <p>
                  The SysPulse dashboard is designed to provide a complete overview of your server's health, including:
                </p>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-4">
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">View Key Metrics</span>
                      </div>
                      <p className="mt-1">The dashboard displays widgets with important metrics such as CPU, memory, and disk usage</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Customize Layout</span>
                      </div>
                      <p className="mt-1">Drag-and-drop widget untuk menyusun ulang, serta ubah ukuran dengan menarik sudut widget</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Add Widgets</span>
                      </div>
                      <p className="mt-1">Click the "+" button in the top right corner to add new widgets to the dashboard</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Detailed Insights</span>
                      </div>
                      <p className="mt-1">Click widget to view details and historical graphs for that metric</p>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd]">Web Terminal</h3>
                <p>
                  Access a web-based terminal to manage your server without a separate SSH client:
                </p>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">How to Access</h4>
                      <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                        <li>Click the "Terminal" menu in the navigation panel</li>
                        <li>Or click the "Terminal" button on the server detail page</li>
                        <li>The terminal will open in a new window</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Common Commands</h4>
                      <div className="bg-[#121212] p-3 rounded-md text-[#d8dee9] font-mono text-sm overflow-x-auto">
                        <div className="grid grid-cols-[1fr,auto] gap-x-4 gap-y-2">
                          <span>clear</span>
                          <span className="text-[#6272a4]"># Clear screen</span>
                          <span>exit</span>
                          <span className="text-[#6272a4]"># Exit the terminal</span>
                          <span>htop</span>
                          <span className="text-[#6272a4]"># Interactive process monitor</span>
                          <span>df -h</span>
                          <span className="text-[#6272a4]"># Check disk space</span>
                          <span>free -m</span>
                          <span className="text-[#6272a4]"># Check memory usage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="dashboard" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Dashboard</h2>
              </div>
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  The dashboard is the visual control center in SysPulse that provides a real-time overview of your server condition. Here, users can interactively monitor core performance metrics such as CPU, RAM, disk, and network.
                </p>
                <ul>
                  <li>- Provides graphs and visualizations of system resource usage</li>
                  <li>- Shows SSH connection status and the identity of the active server</li>
                  <li>- Quick access to other monitoring functions such as Terminal and Processes</li>
                  <li>- Displays instant notifications if there are anomalies or system alerts</li>
                </ul>
                <p>
                  This dashboard is designed to be adaptive and responsive, ensuring an intuitive monitoring experience for both technical and non-technical users.
                </p>
             </div>
            </section>
            
            {/* Terminal Section */}
            <section id="terminal" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#ff79c6]/10 flex items-center justify-center">
                  <Terminal className="h-5 w-5 text-[#ff79c6]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Terminal</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  The SysPulse terminal provides secure web-based access to your server from anywhere.
                  This feature allows you to manage your system remotely through a familiar terminal interface.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Terminal Main Features</h3>
                <ul>
                    <li><strong>- Web-based Terminal Access</strong>: Access your server from any browser without a separate SSH client</li>
                    <li><strong>- Persistent Sessions</strong>: Terminal sessions remain active even if you close your browser and return later</li>
                    <li><strong>- Command History</strong>: Access a complete command history for quick reference</li>
                    <li><strong>- File Transfer</strong>: Upload and download files directly from the terminal</li>
                    <li><strong>- Session Sharing</strong>: Share terminal sessions with other users for collaboration</li>
                </ul>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Using the Terminal</h3>
                <p>
                  After connected to the   server, you can access the terminal as follows:
                </p>
                <ol>
                  <li>- Open the Server page from the main navigation</li>
                  <li>- Select the server you want to access</li>
                  <li>- Click the "Terminal" button in the server control panel</li>
                  <li>- The interactive terminal will open in a new window</li>
                </ol>
                
                <div className="not-prose bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-3">Security Warning</h4>
                  <p className="text-[#a8aebb] mb-4">
                    When using the web terminal, always log out of your session when finished to prevent unauthorized access.
                    SysPulse will automatically terminate inactive sessions after 30 minutes, but best practice is to log out manually.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Useful Commands</h3>
                <p>Here are special SysPulse system commands available in the terminal:</p>
                <pre className="bg-[#121212] p-4 rounded-md text-[#d8dee9] overflow-x-auto">
                  <code>
                    clear           # Clear the terminal screen<br/>
                    exit            # Exit the terminal session<br/>
                    upload &lt;file&gt;   # Upload file to the server<br/>
                    download &lt;file&gt; # Download a file from the server<br/>
                    help            # Show help for available commands
                  </code>
                </pre>
              </div>
            </section>

             {/* Pemantauan Section */}
            <section id="pemantauan" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-[#3fdaa4]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Sistem Monitoring</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  The SysPulse system monitoring feature provides real-time visibility into your server performance.
                  You can monitor various metrics, set up custom dashboards, and receive alerts when issues occur.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Monitored Metrics</h3>
                <p>
                   SysPulse collects and displays a variety of system metrics, including:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-4">
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                        <Cpu className="h-4 w-4 text-[#c792ea]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">CPU</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>CPU usage (total and per core)</li>
                      <li>Load average (1, 5, and 15 minutes)</li>
                      <li>CPU time (user, system, idle, iowait)</li>
                      <li>Top processes by CPU usage</li>
                      <li>CPU temperature (if supported by hardware)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                        <Server className="h-4 w-4 text-[#6be5fd]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">Memory</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Physical memory usage (total, used, free)</li>
                      <li>Swap usage</li> 
                      <li>Buffers and cache</li>
                      <li>Top processes by memory usage</li>
                      <li>Memory usage grouped by application</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ff79c6]/10 flex items-center justify-center">
                        <HardDrive className="h-4 w-4 text-[#ff79c6]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">Disk</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Disk usage (total, used, free)</li>
                      <li>IOPS (input/output operations per second)</li>
                      <li>Disk throughput (read/write)</li>
                      <li>Disk response time</li>
                      <li>Inode usage</li>
                      <li>SMART status for disk health monitoring</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center">
                        <Wifi className="h-4 w-4 text-[#3fdaa4]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">Network</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Network bandwidth (inbound/outbound)</li>
                      <li>Network packets (sent/received)</li>
                      <li>Active connections</li>
                      <li>Network port status</li>
                      <li>TCP/UDP statistics</li>
                      <li>Network latency</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Custom Dashboard</h3>
                <p>
                  SysPulse allows you to create custom dashboards to monitor the metrics that matter most to you, with the following steps:
                </p>
                <ol>
                  <li>- Navigate to the "Dashboard" section in the main menu</li>
                  <li>- Click the "Create New Dashboard" button</li>
                  <li>- Name your dashboard and choose a layout</li>
                  <li>- Add widgets by clicking the "+" button in the dashboard area</li>
                  <li>- For each widget, select:
                    <ul>
                      <li className="ml-6">1. Metric type (CPU, memory, disk, etc.)</li>
                      <li className="ml-6">2. Server to monitor</li>
                      <li className="ml-6">3. Time interval (real-time, last 1 hour, 1 day, etc.)</li>
                      <li className="ml-6">4. Visualization type (chart, gauge, table, etc.)</li>
                    </ul>
                  </li>
                      <li>- Arrange the layout by dragging and dropping widgets</li>
                      <li>- Click "Save" to save your dashboard</li>
                </ol>
                
                <div className="bg-[#282a36] p-5 rounded-lg border border-zinc-800/50 mt-6">
                    <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Dashboard Example</h4>
                  <div className="flex justify-center bg-[#161616] p-4 rounded-md">
                    <div className="w-full h-64 flex items-center justify-center text-[#a8aebb]">
                      [System monitoring dashboard illustration]
                    </div>
                  </div>
                  <p className="text-[#a8aebb] mt-4">
                    Example of a server monitoring dashboard with widgets for CPU, memory, disk, and network metrics.
                    The dashboard can be fully configured to display the most relevant metrics for your use case.
                  </p>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Viewing History and Trends</h3>
                <p>
                  SysPulse stores historical data for all collected metrics, allowing you to:
                </p>
                <ul>
                  <li>- View long-term performance trends</li>
                  <li>- Identify recurring issues</li>
                  <li>- Plan capacity based on historical data</li>
                  <li>- Compare current performance with previous periods</li>
                </ul>
                
                <p>
                  
                  To view historical data, open any dashboard widget and adjust the time range using the range selector in the top right corner.
                  You can select a preset time interval or specify a custom date/time range.
                </p>
                
                <h3 className="mt-8 text-[#6be5fd]">Monitoring Agent Settings</h3>
                <p>
                  The SysPulse monitoring agent runs on your server to collect performance metrics, including:
                </p>
                <ul>
                  <li>
                    <strong>- Collection Interval</strong>: Adjust how often metrics are collected (default: every 10 seconds)
                  </li>
                  <li>
                    <strong>- Data Retention</strong>: Configure how long historical data is stored
                  </li>
                  <li>
                    <strong>- Metric Filter</strong>: Select specific metrics you want to collect
                  </li>
                  <li>
                    <strong>- Custom Scripts</strong>: Add custom monitoring scripts for specific application metrics
                  </li>
                </ul>
                
                <p>
                  To access agent settings, navigate to Settings → Monitoring → Agent and select the server you want to configure.
                </p>
                
                <div className="bg-[#3fdaa4]/10 p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#3fdaa4] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Optimization Tips
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Adjust the collection interval based on your needs - shorter intervals provide more detailed monitoring but require more resources
                    </li>
                    <li>
                      For servers with limited resources, consider collecting only essential metrics
                    </li>
                    <li>
                      Use aggregate views to monitor multiple servers at once
                    </li>
                    <li>
                      Create separate dashboards for different use cases (production vs. development monitoring)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Pemberitahuan Section */}
            <section id="pemberitahuan" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#ff79c6]/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-[#ff79c6]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Alerts & Notifications</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  The SysPulse notification system allows you to receive alerts about potential issues 
                  before they impact your system. You can configure alerts for various conditions 
                  and receive them through multiple channels.
                </p>
                
                <h3 className="mt-4 text-[#6be5fd]">Alert Types</h3>
                <p>
                  SysPulse supports various types of alerts based on collected metrics, including:
                </p>
                
                <ul>
                  <li>
                    <strong>- Threshold Alerts</strong>: Triggered when a metric exceeds a certain value
                    <ul>
                      <li>Example: CPU &gt; 90% for 5 minutes</li>
                      <li>Example: Free disk space &lt; 10%</li>
                    </ul>
                  </li>
                  <li>
                    <strong>- Change Alerts</strong>: Triggered when a metric changes by a certain amount within a time interval
                    <ul>
                      <li>Example: Memory usage increases &gt; 30% within 10 minutes</li>
                      <li>Example: Network traffic drops &gt; 90% (possible connectivity issue)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>- Status Alerts</strong>: Triggered when a service status changes
                    <ul>
                      <li>Example: Web service stopped</li>
                      <li>Example: Server becomes unreachable</li>
                    </ul>
                  </li>
                  <li>
                    <strong>- Anomaly Alerts</strong>: Triggered when a metric behaves abnormally
                    <ul>
                      <li>Example: Unusual CPU usage pattern compared to historical baseline</li>
                      <li>Example: Sudden spike in network connections</li>
                    </ul>
                  </li>
                </ul>
                
                <h3 className="mt-6 text-[#6be5fd]">Notification Method</h3>
                <p>
                  SysPulse can send notifications through various channels, such as:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Email</h4>
                    <p className="text-[#a8aebb]">
                      Detailed notifications are sent to the specified email address, including charts and diagnostic information.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">SMS</h4>
                    <p className="text-[#a8aebb]">
                      Short text messages for critical alerts that require immediate action.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Webhook</h4>
                    <p className="text-[#a8aebb]">
                      Send alert data to a webhook URL for integration with third-party systems.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Aplikasi Pesan</h4>
                    <p className="text-[#a8aebb]">
                      Integration with Slack, Microsoft Teams, Telegram, and other communication platforms.
                    </p>
                  </div>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Mengonfigurasi Peringatan</h3>
                <p>
                  To configure a new alert, you can follow these steps:
                </p>
                
                <ol>
                  <li>- Open the "Notifications" section from the main menu</li>
                  <li>- Click the "Add New Alert" button"</li>
                  <li>- Choose the type of alert you want to create</li>
                  <li>- Configure the alert criteria:
                    <ul>
                      <li className="ml-6">1. Select the server to monitor</li>
                      <li className="ml-6">2. Choose the metric to trigger the alert</li>
                      <li className="ml-6">3. Set the condition and threshold</li>
                      <li className="ml-6">4. pecify the duration (how long the condition must persist)</li>
                    </ul>
                  </li>
                  <li>- Configure notification channels (email, SMS, webhook, etc.)</li>
                  <li>- Set the severity level (info, warning, critical)</li>
                  <li>- Add optional troubleshooting instructions</li>
                  <li>- Click "Save" to activate the alert</li>
                </ol>
                
                <div className="not-prose bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-2">Best Practices for Alerts</h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      <strong>Avoid alert fatigue</strong> - Don't set too many alerts or thresholds that are too low
                    </li>
                    <li>
                      <strong>Set actionable alerts</strong> - Every alert should require a specific action
                    </li>
                    <li>
                      <strong>Use severity levels appropriately</strong> - Reserve "critical" notifications for issues that truly require immediate attention
                    </li>
                    <li>
                      <strong>Include context</strong> - Add enough information to understand why the alert was triggered
                    </li>
                    <li>
                      <strong>Review regularly</strong> - Periodically re-evaluate alerts to eliminate false positives
                    </li>
                  </ul>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Alert History</h3>
                <p>
                  SysPulse keeps a complete history of all triggered alerts, allowing you to:
                </p>
                <ul>
                  <li>- Identify patterns in recurring issues</li>
                  <li>- Analyze metrics at the time the alert was triggered</li>
                  <li>- Track resolution and response times</li>
                  <li>- Identify areas for improvement</li>
                </ul>
                <p>
                  To access alert history, open the "Notifications" section and click the "History" tab.
                  You can filter by server, alert type, severity level, and date range.
                </p>
              </div>
            </section>
            
            {/* Koneksi SSH Section */}
            <section id="koneksi-ssh" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">SSH Connection</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse uses the SSH (Secure Shell) protocol to securely connect to remote servers.
                  This section explains how to establish an SSH connection and troubleshoot common issues.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Required Information</h3>
                <p>To establish an SSH connection to a server, you will need the following information:</p>
                <ul>
                  <li><strong>- Host</strong>: The IP address or domain name of the target server</li>
                  <li><strong>- Port</strong>: SSH port (default: 22)</li>
                  <li><strong>- Username</strong>: The username to log in to the server</li>
                  <li><strong>- Private Key</strong>: Private key for authentication (or password if password authentication is enabled)</li>
                </ul>
                
                <h3 className='font-bold text-[#6be5fd] mt-4'>Connection Steps</h3>
                <ol>
                  <li>- Navigate to the "Connections" page in the main menu</li>
                  <li>- Click the "Add Connection" or "Connect" button</li>
                  <li>- Enter the connection details in the form:
                    <ul>
                      <li className="ml-4">1. Host: server IP address or hostname</li>
                      <li className="ml-4">2. Port: usually 22 (default)</li>
                      <li className="ml-4">3. Username: your SSH username</li>
                      <li className="ml-4">4. Private Key: paste your private key or upload the key file</li>
                      <li className="ml-4">If using a passphrase, enable the option and enter your passphrase</li>
                    </ul>
                  </li>
                  <li>- Click "Connect" to start the connection</li>
                  <li>- Once connected, you will be taken to the dashboard or terminal page</li>
                </ol>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Get the Private Key</h3>
                <p>
                  If you don't have a private key yet, here's how to get one:
                </p>
                <ul>
                  <li>
                    <strong>- On Linux/macOS</strong>: The private key is usually stored at <code>~/.ssh/id_rsa</code>
                  </li>
                  <li>
                    <strong>- On Windows</strong>: If using PuTTY, the key is saved as a .ppk file 
                    and needs to be converted to OpenSSH format
                  </li>
                  <li>
                    <strong>- For cloud VMs</strong>: The key is usually downloaded when you first create the instance
                  </li>
                  <li>
                    <strong>- To generate a new key</strong>: Use the command: <code>ssh-keygen -t rsa -b 4096</code>
                  </li>
                </ul>
                
                <div className="not-prose bg-[#1e1e1e] p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Key Format Tips</h4>
                  <p className="text-[#a8aebb] mb-4">
                    SysPulse supports OpenSSH and PEM key formats. If you are using a key in another format,
                    you may need to convert it first. The private key should start with
                    <code className="bg-[#282a36] px-2 py-0.5 mx-1 rounded text-[#ff79c6]">-----BEGIN RSA PRIVATE KEY-----</code>
                    or a similar format.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Connection Troubleshooting</h3>
                <p>
                  Here are some common SSH connection issues and their solutions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Connection Refused</p>
                    <ul className="list-disc pl-5 mt-1 space-y-2 text-[#a8aebb]">
                      <li>Make sure the SSH server is running on the target server</li>
                      <li>Verify the correct port (usually 22)</li>
                      <li>Check firewall or security group rules</li>
                      <li>Ensure the server IP address is correct</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Permission Denied</p>
                    <ul className="list-disc pl-5 mt-1 space-y-2 text-[#a8aebb]">
                      <li>Verify the correct username</li>
                      <li>Make sure the correct private key is used</li>
                      <li>Verify the passphrase if used</li>
                      <li>Check that the public key is registered on the server</li>
                    </ul>
                  </div>
                </div>
                
                <p className="mt-6">
                  For further assistance with SSH connections, 
                  click the help icon on the connection page to view detailed guidance.
                </p>
              </div>
            </section>
            
            {/* Ngrok Section */}
            <section id="ngrok" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-[#c792ea]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Ngrok Usage</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Ngrok is a service that allows you to expose your local server to the internet through a secure tunnel.
                  This is especially useful if you want to access a server that is behind NAT or a firewall.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Why Use Ngrok with SysPulse?</h3>
                <p>
                  When running a server in a local environment or private network, you may not have a static public IP.
                  Ngrok helps solve this problem by creating a secure tunnel so SysPulse can connect to your server.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Ngrok Setup Steps</h3>
                <ol>
                  <li>
                    <strong>- Install Ngrok</strong>
                    <p>Visit <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer">ngrok.com</a> to download and install Ngrok</p>
                  </li>
                  <li>
                    <strong>- Register a Ngrok Account</strong>
                    <p>Create an account and get your authentication token</p>
                  </li>
                  <li>
                    <strong>- Authenticate Ngrok</strong>
                    <p>Run the command: <code>ngrok authtoken YOUR_AUTH_TOKEN</code></p>
                  </li>
                  <li>
                    <strong>- Create an SSH Tunnel</strong>
                    <p>To create an SSH tunnel, run: <code>ngrok tcp 22</code></p>
                  </li>
                </ol>
                
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-6">
                  <h4 className="text-[#6be5fd] font-semibold text-lg mb-3">Ngrok Output Example</h4>
                  <div className="bg-[#121212] p-4 rounded-md text-[#d8dee9] overflow-x-auto">
                    <pre><code>ngrok by @inconshreveable                                                (Ctrl+C to quit)
                                                                                              
Session Status                online                                                           
Account                       your-email@example.com (Plan: Free)                              
Version                       3.4.0                                                            
Region                        Asia Pacific (ap)                                                
Latency                       21ms                                                             
Web Interface                 http://127.0.0.1:4040                                           
Forwarding                    tcp://8.tcp.ngrok.io:12345 {'>'}  localhost:22                      
                                                                                              
Connections                   ttl     opn     rt1     rt5     p50     p90                     
                              0       0       0.00    0.00    0.00    0.00</code></pre>
                  </div>
                  <p className="text-[#a8aebb] mt-4">
                    Dalam contoh ini, gunakan <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">8.tcp.ngrok.io</code> as host and{' '}
                    <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">12345</code> as the port in the SysPulse SSH connection form.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Using Ngrok with SysPulse</h3>
                <p>
                  After the Ngrok tunnel is running, you can follow these steps to connect using SysPulse:
                </p>
                <ol>
                  <li>- Open the SSH connection page in SysPulse</li>
                  <li>- In the host field, enter the provided Ngrok URL (e.g., <code>8.tcp.ngrok.io</code>)</li>
                  <li>- In the port field, enter the port given by Ngrok (e.g., <code>12345</code>)</li>
                  <li>- Enter your username and private key as usual</li>
                  <li>- Click "Connect" to start the connection</li>
                </ol>
                
                <div className="bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Important Notes
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      The Ngrok tunnel address <strong>changes every time you restart</strong> Ngrok with a free account
                    </li>
                    <li>
                      For a static address, consider subscribing to a paid Ngrok plan
                    </li>
                    <li>
                      Ngrok sessions will expire after a few hours on the free plan
                    </li>
                    <li>
                      Make sure your SSH server is running on the port you specify (default: 22)
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* VM Cloud Section */}
            <section id="vm-cloud" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Connecting to Cloud VMs</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse can easily connect to Virtual Machines (VMs) hosted on popular cloud providers.
                  This section explains how to connect to VMs from various cloud providers.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Amazon Web Services (AWS) EC2</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Connection Steps</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>In the AWS Console, make sure you are running an EC2 instance</li>
                    <li>Note the instance's Public DNS or Public IP Address</li>
                    <li>Ensure the security group allows SSH traffic (port 22)</li>
                    <li>Use the .pem file downloaded when creating the instance as the private key</li>
                    <li>
                      The default username depends on the AMI used:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Amazon Linux/RHEL: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code></li>
                        <li>Ubuntu: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ubuntu</code></li>
                        <li>Debian: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">admin</code> or <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">debian</code></li>
                        <li>SUSE: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code> or <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">root</code></li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Google Cloud Platform (GCP)</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Connection Steps</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>In the GCP console, navigate to Compute Engine {'>'}  Instances VM</li>
                    <li>Note the external IP address of your VM instance</li>
                    <li>Ensure firewall rules allow SSH traffic (port 22)</li>
                    <li>
                      For authentication, you have two options:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Use an SSH key added via project or instance metadata</li>
                        <li>Use OS Login if enabled on your project</li>
                      </ul>
                    </li>
                    <li>The username is usually your Google account name or the name configured when creating the instance</li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Microsoft Azure</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Connection Steps</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>In the Azure portal, navigate to Virtual Machines</li>
                    <li>Select your Linux VM and note the public IP address</li>
                    <li>Ensure the Network Security Group (NSG) allows SSH traffic (port 22)</li>
                    <li>Use the username you configured when creating the VM</li>
                    <li>
                      For authentication, you can use:
                      <ul className="list-disc pl-5 mt-1">
                        <li>The SSH key you configured during VM creation</li>
                        <li>Password authentication if configured</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Digital Ocean</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Connection Steps</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>In the Digital Ocean control panel, navigate to Droplets</li>
                    <li>Select your Droplet and note the IP address</li>
                    <li>The default username is usually <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">root</code></li>
                    <li>Use the SSH key configured when creating the Droplet</li>
                    <li>If you chose password authentication, check your email for login details</li>
                  </ol>
                </div>
                
                <div className="bg-[#3fdaa4]/10 p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#3fdaa4] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Security Tips
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Always use key-based authentication; avoid password-based authentication whenever possible
                    </li>
                    <li>
                      Restrict SSH access to known IP addresses only via security groups or firewall rules
                    </li>
                    <li>
                      Consider changing the default SSH port (22) to a non-standard port to reduce automated attacks
                    </li>
                    <li>
                      Enable multi-factor authentication (MFA) on your cloud account for an extra layer of security
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            
            {/* Lanjutan Section */}
            <section id="lanjutan" className="scroll-mt-24">
             <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-[#6be5fd]" />
              </div>
              <h2 className="text-2xl font-bold text-[#d8dee9]">Advance</h2>
            </div>
            <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <Code className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="integrasiApi" className="text-xl font-semibold text-[#6be5fd]">API Integration</h3>
              </div>
              <p>
                SysPulse provides an internal API to efficiently retrieve and manage server data.
                This API is used by the user interface to display process information, system stats, and execute commands directly through a secure SSH connection.
              </p>
              <ul>
                <li className="ml-6"><code>GET /process</code> - Retrieves the list of active processes from the connected server.</li>
                <li className="ml-6"><code>POST /kill</code> - Terminates a process based on the given PID.</li>
                <li className="ml-6"><code>GET /system</code> - Provides real-time statistics for CPU, memory, and disk usage.</li>
              </ul>
              <p>
                The API is not public and can only be accessed during an active user session, ensuring security from external misuse.
              </p>

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <Shield className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="keamanan" className="text-xl font-semibold text-[#6be5fd]">Security</h3>
              </div>
              <p>
                Security is a top priority in SysPulse. The system is designed to ensure that all connection data is temporary and secure.
              </p>
              <ul>
                <li>The private key is never stored on the server — it is only used during the session.</li>
                <li>Authentication uses SSH Key instead of passwords to minimize the risk of brute-force attacks.</li>
                <li>Sessions are automatically closed after a period of inactivity to prevent unauthorized access.</li>
                <li>User input is not stored in the database or logs without explicit permission.</li>
              </ul>
              <p>
                We strongly recommend users to use a key with an active passphrase and always maintain proper server access permissions.
              </p>

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <HelpCircle className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="pemecahanMasalah" className="text-xl font-semibold text-[#6be5fd]">Troubleshooting</h3>
              </div>
              <p>
                If you're experiencing technical issues while using SysPulse, here are some quick solutions you can try:
              </p>
              <ul>
                <li><strong>- SSH connection failed:</strong>  Verify your host, port, username, and private key.</li>
                <li><strong>- Data isn't appearing on the dashboard.:</strong> Ensure the server is responding to commands like <code>ps</code> and <code>top</code>.</li>
                <li><strong>- Key does'nt match:</strong> Use OpenSSH format and avoid strange characters from copy-pasting.</li>
                <li><strong>- Process cannot be stopped:</strong> This might require sudo privileges. Try using a user with higher permissions.</li>
                <li><strong>- System unresponsive:</strong> Refresh the page, or try disconnecting and reconnecting.</li>
              </ul>
              <p>
                If the problem persists, please contact the development team via the help page or send logs from your browser page.
              </p>

             </div>
            </section>
            
            {/* Documentation Navigation */}
            <div className="pt-8 mt-8 border-t border-[#3fdaa4]/10 flex justify-between">
              <Link 
                href="#pengenalan" 
                className="px-4 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#a8aebb] hover:text-[#d8dee9] hover:border-[#3fdaa4]/40 flex items-center transition-colors"
              >
                <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
                <span>Previous: Introduction</span>
              </Link>
              <Link 
                href="#pemantauan" 
                className="px-4 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#a8aebb] hover:text-[#d8dee9] hover:border-[#3fdaa4]/40 flex items-center transition-colors"
              >
                <span>Next: Monitoring</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 mb-4">
              <div className="text-sm text-[#a8aebb]">
                <span className="hover:text-[#d8dee9] cursor-pointer">Home</span>
                <span className="mx-2">/</span>
                <span className="text-[#6be5fd] font-medium">Dokumentation</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Was this page helpful */}
      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-5xl mx-auto border-t border-[#3fdaa4]/10 pt-8">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-[#d8dee9] mb-4">Was this documentation helpful?</h3>

            <div className="flex space-x-4">
            <button
              onClick={() => alert('Thank you for your feedback! We are glad this documentation was helpful for you.')}
              className="px-6 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#3fdaa4]/40 transition-colors"
            >
              Yes, very helpful
            </button>

            <button
              onClick={() => {
                if (confirm('We are sorry. Would you like to give suggestions or feedback directly to the developer?')) {
                  window.location.href = '/feedback';
                }
            }}
            className="px-6 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#3fdaa4]/40 transition-colors"
          >
            No, I need more info
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
}