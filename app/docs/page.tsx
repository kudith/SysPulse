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
                  SysPulse dapat mengirimkan notifikasi melalui berbagai saluran, seperti:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Email</h4>
                    <p className="text-[#a8aebb]">
                      Notifikasi terperinci dikirim ke alamat email yang ditentukan, dengan grafik dan informasi diagnostik.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">SMS</h4>
                    <p className="text-[#a8aebb]">
                      Pesan teks singkat untuk peringatan kritis yang memerlukan tindakan segera.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Webhook</h4>
                    <p className="text-[#a8aebb]">
                      Kirim data peringatan ke URL webhook untuk integrasi dengan sistem pihak ketiga.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Aplikasi Pesan</h4>
                    <p className="text-[#a8aebb]">
                      Integrasi dengan Slack, Microsoft Teams, Telegram, dan platform komunikasi lainnya.
                    </p>
                  </div>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Mengonfigurasi Peringatan</h3>
                <p>
                  Untuk mengonfigurasi peringatan baru, anda dapat mengikuti langkah-langkah berikut ini:
                </p>
                
                <ol>
                  <li>- Buka bagian "Pemberitahuan" dari menu utama</li>
                  <li>- Klik tombol "Tambah Peringatan Baru"</li>
                  <li>- Pilih jenis peringatan yang ingin anda buat</li>
                  <li>- Konfigurasi kriteria peringatan:
                    <ul>
                      <li className="ml-6">1. Pilih server yang akan dipantau</li>
                      <li className="ml-6">2. Pilih metrik untuk memicu peringatan</li>
                      <li className="ml-6">3. Tetapkan kondisi dan ambang batas</li>
                      <li className="ml-6">4. Tentukan durasi (berapa lama kondisi harus bertahan)</li>
                    </ul>
                  </li>
                  <li>- Konfigurasikan saluran pemberitahuan (email, SMS, webhook, dll.)</li>
                  <li>- Tetapkan tingkat keparahan (informasi, peringatan, kritis)</li>
                  <li>- Tambahkan instruksi penyelesaian masalah opsional</li>
                  <li>- Klik "Simpan" untuk mengaktifkan peringatan</li>
                </ol>
                
                <div className="not-prose bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-2">Praktik Terbaik Peringatan</h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      <strong>Hindari kelelahan peringatan</strong> - Jangan mengatur terlalu banyak peringatan atau ambang batas yang terlalu rendah
                    </li>
                    <li>
                      <strong>Tetapkan peringatan yang dapat ditindaklanjuti</strong> - Setiap peringatan harus memerlukan tindakan tertentu 
                    </li>
                    <li>
                      <strong>Gunakan tingkat keparahan dengan tepat</strong> - Simpan notifikasi "kritis" untuk masalah yang benar-benar memerlukan perhatian segera
                    </li>
                    <li>
                      <strong>Sertakan konteks</strong> - Tambahkan informasi yang cukup untuk memahami mengapa peringatan dipicu
                    </li>
                    <li>
                      <strong>Tinjau secara berkala</strong> - Evaluasi ulang peringatan secara teratur untuk menghilangkan false positive
                    </li>
                  </ul>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Riwayat Peringatan</h3>
                <p>
                  SysPulse menyimpan riwayat lengkap semua peringatan yang dipicu, sehingga memungkinkan anda untuk:
                </p>
                <ul>
                  <li>- Melihat pola dalam masalah yang terjadi berulang</li>
                  <li>- Menganalisis metrik pada saat peringatan dipicu</li>
                  <li>- Melacak resolusi dan waktu respons</li>
                  <li>- Mengidentifikasi area untuk perbaikan</li>
                </ul>
                <p>
                  Untuk mengakses riwayat peringatan, buka bagian "Pemberitahuan" dan klik tab "Riwayat".
                  Anda dapat memfilter berdasarkan server, jenis peringatan, tingkat keparahan, dan rentang tanggal.
                </p>
              </div>
            </section>
            
            {/* Koneksi SSH Section */}
            <section id="koneksi-ssh" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Koneksi SSH</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse menggunakan protokol SSH (Secure Shell) untuk terhubung ke server jarak jauh secara aman.
                  Bagian ini membahas cara melakukan koneksi SSH dan pemecahan masalah umum.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Informasi yang Diperlukan</h3>
                <p>Untuk melakukan koneksi SSH ke server, Anda memerlukan informasi berikut:</p>
                <ul>
                  <li><strong>- Host</strong>: Alamat IP atau nama domain server target</li>
                  <li><strong>- Port</strong>: Port SSH (default: 22)</li>
                  <li><strong>- Username</strong>: Nama pengguna untuk login ke server</li>
                  <li><strong>- Private Key</strong>: Kunci pribadi untuk autentikasi (atau password jika autentikasi password diaktifkan)</li>
                </ul>
                
                <h3 className='font-bold text-[#6be5fd] mt-4'>Langkah-langkah Koneksi</h3>
                <ol>
                  <li>- Navigasi ke halaman "Koneksi" di menu utama</li>
                  <li>- Klik tombol "Tambah Koneksi" atau "Hubungkan"</li>
                  <li>- Masukkan detail koneksi dalam formulir:
                    <ul>
                      <li className="ml-4">1. Host: alamat IP atau hostname server</li>
                      <li className="ml-4">2. Port: biasanya 22 (default)</li>
                      <li className="ml-4">3. Username: nama pengguna SSH Anda</li>
                      <li className="ml-4">4. Private Key: tempel kunci pribadi anda atau unggah file kunci</li>
                      <li className="ml-4">Jika menggunakan passphrase, aktifkan opsi dan masukkan passphrase</li>
                    </ul>
                  </li>
                  <li>- Klik "Hubungkan" untuk memulai koneksi</li>
                  <li>- Setelah terhubung, anda akan dibawa ke dashboard atau halaman terminal</li>
                </ol>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Mendapatkan Private Key</h3>
                <p>
                  Jika Anda belum memiliki private key, berikut cara mendapatkannya:
                </p>
                <ul>
                  <li>
                    <strong>- Pada Linux/macOS</strong>: Kunci privat biasanya tersimpan di <code>~/.ssh/id_rsa</code>
                  </li>
                  <li>
                    <strong>- Pada Windows</strong>: Jika menggunakan PuTTY, kunci tersimpan sebagai file .ppk, 
                    perlu dikonversi ke format OpenSSH
                  </li>
                  <li>
                    <strong>- Untuk VM cloud</strong>: Kunci biasanya diunduh saat pertama kali membuat instance
                  </li>
                  <li>
                    <strong>- Membuat kunci baru</strong>: Gunakan perintah: <code>ssh-keygen -t rsa -b 4096</code>
                  </li>
                </ul>
                
                <div className="not-prose bg-[#1e1e1e] p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Tips Format Kunci</h4>
                  <p className="text-[#a8aebb] mb-4">
                    SysPulse mendukung format kunci OpenSSH dan PEM. Jika Anda menggunakan kunci dalam format lain,
                    Anda mungkin perlu mengonversinya terlebih dahulu. Kunci privat harus dimulai dengan
                    <code className="bg-[#282a36] px-2 py-0.5 mx-1 rounded text-[#ff79c6]">-----BEGIN RSA PRIVATE KEY-----</code>
                    atau format serupa lainnya.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Pemecahan Masalah Koneksi</h3>
                <p>
                  Berikut ini adalah masalah koneksi SSH yang umum terjadi beserta solusinya:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Connection Refused</p>
                    <ul className="list-disc pl-5 mt-1 space-y-2 text-[#a8aebb]">
                      <li>Pastikan server SSH berjalan di server target</li>
                      <li>Verifikasi port yang benar (biasanya 22)</li>
                      <li>Periksa firewall atau aturan grup keamanan</li>
                      <li>Pastikan alamat IP server benar</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Permission Denied</p>
                    <ul className="list-disc pl-5 mt-1 space-y-2 text-[#a8aebb]">
                      <li>Verifikasi username yang benar</li>
                      <li>Pastikan private key yang benar digunakan</li>
                      <li>Verifikasi passphrase jika digunakan</li>
                      <li>Periksa bahwa kunci publik terdaftar di server</li>
                    </ul>
                  </div>
                </div>
                
                <p className="mt-6">
                  Untuk bantuan lebih lanjut dengan koneksi SSH, klik ikon bantuan pada halaman koneksi
                  untuk melihat panduan mendetail.
                </p>
              </div>
            </section>
            
            {/* Ngrok Section */}
            <section id="ngrok" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-[#c792ea]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Penggunaan Ngrok</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Ngrok adalah layanan yang memungkinkan Anda mengekspos server lokal ke internet melalui tunnel aman.
                  Ini sangat berguna jika Anda ingin mengakses server yang berada di balik NAT atau firewall.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Mengapa Menggunakan Ngrok dengan SysPulse?</h3>
                <p>
                  Saat menjalankan server di lingkungan lokal atau jaringan privat, anda mungkin tidak memiliki IP publik tetap.
                  Oleh karena itu Ngrok membantu mengatasi masalah ini dengan membuat tunnel aman sehingga SysPulse dapat terhubung ke server anda.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Langkah-langkah Pengaturan Ngrok</h3>
                <ol>
                  <li>
                    <strong>- Instal Ngrok</strong>
                    <p>Kunjungi <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer">ngrok.com</a> untuk mengunduh dan instal Ngrok</p>
                  </li>
                  <li>
                    <strong>- Daftar Akun Ngrok</strong>
                    <p>Buat akun dan dapatkan token autentikasi Anda</p>
                  </li>
                  <li>
                    <strong>- Autentikasi Ngrok</strong>
                    <p>Jalankan perintah: <code>ngrok authtoken YOUR_AUTH_TOKEN</code></p>
                  </li>
                  <li>
                    <strong>- Buat Tunnel SSH</strong>
                    <p>Untuk membuat tunnel SSH, jalankan: <code>ngrok tcp 22</code></p>
                  </li>
                </ol>
                
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-6">
                  <h4 className="text-[#6be5fd] font-semibold text-lg mb-3">Contoh Output Ngrok</h4>
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
                    Dalam contoh ini, gunakan <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">8.tcp.ngrok.io</code> sebagai host dan{' '}
                    <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">12345</code> sebagai port dalam formulir koneksi SSH SysPulse.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Penggunaan Ngrok pada SysPulse</h3>
                <p>
                  Setelah tunnel Ngrok berjalan, anda dapat mengikuti langkah-langkah berikut untuk terhubung menggunakan SysPulse:
                </p>
                <ol>
                  <li>- Buka halaman koneksi SSH di SysPulse</li>
                  <li>- Di kolom host, masukkan URL Ngrok yang diberikan (mis., <code>8.tcp.ngrok.io</code>)</li>
                  <li>- Di kolom port, masukkan port yang diberikan Ngrok (mis., <code>12345</code>)</li>
                  <li>- Masukkan username dan private key Anda seperti biasa</li>
                  <li>- Klik "Hubungkan" untuk memulai koneksi</li>
                </ol>
                
                <div className="bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Catatan Penting
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Alamat tunnel Ngrok <strong>berubah setiap kali Anda memulai ulang</strong> Ngrok dengan akun gratis
                    </li>
                    <li>
                      Untuk alamat tetap, pertimbangkan untuk berlangganan paket berbayar Ngrok
                    </li>
                    <li>
                      Sesi Ngrok akan kedaluwarsa setelah beberapa jam dalam paket gratis
                    </li>
                    <li>
                      Pastikan server SSH Anda berjalan di port yang Anda tentukan (default: 22)
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
                <h2 className="text-2xl font-bold text-[#d8dee9]">Koneksi ke VM Cloud</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse dapat dengan mudah terhubung ke Virtual Machine (VM) yang dihosting di penyedia cloud populer.
                  Bagian ini menjelaskan cara terhubung ke VM dari berbagai penyedia cloud.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Amazon Web Services (AWS) EC2</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di AWS Console, pastikan anda berjalan di instance EC2</li>
                    <li>Catat Public DNS atau Public IP Address instance</li>
                    <li>Pastikan grup keamanan mengizinkan lalu lintas SSH (port 22)</li>
                    <li>Gunakan file .pem yang diunduh saat membuat instance sebagai private key</li>
                    <li>
                      Username default tergantung pada AMI yang digunakan:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Amazon Linux/RHEL: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code></li>
                        <li>Ubuntu: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ubuntu</code></li>
                        <li>Debian: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">admin</code> atau <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">debian</code></li>
                        <li>SUSE: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code> atau <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">root</code></li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Google Cloud Platform (GCP)</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di konsol GCP, navigasi ke Compute Engine {'>'}  Instances VM</li>
                    <li>Catat alamat IP eksternal dari instance VM Anda</li>
                    <li>Pastikan aturan firewall mengizinkan lalu lintas SSH (port 22)</li>
                    <li>
                      Untuk autentikasi, Anda memiliki dua opsi:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Gunakan kunci SSH yang ditambahkan melalui metadata project atau instance</li>
                        <li>Gunakan OS Login jika diaktifkan di project anda</li>
                      </ul>
                    </li>
                    <li>Username biasanya adalah nama akun Google Anda atau nama yang dikonfigurasi saat membuat instance</li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Microsoft Azure</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di portal Azure, navigasi ke Virtual Machines</li>
                    <li>Pilih VM Linux Anda dan catat alamat IP publik</li>
                    <li>Pastikan Network Security Group (NSG) mengizinkan lalu lintas SSH (port 22)</li>
                    <li>Gunakan username yang Anda konfigurasikan saat membuat VM</li>
                    <li>
                      Untuk autentikasi, Anda dapat menggunakan:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Kunci SSH yang Anda konfigurasi saat pembuatan VM</li>
                        <li>Autentikasi kata sandi jika dikonfigurasi</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Digital Ocean</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di panel kontrol Digital Ocean, navigasi ke Droplets</li>
                    <li>Pilih Droplet Anda dan catat alamat IP</li>
                    <li>Username default biasanya adalah <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">root</code></li>
                    <li>Gunakan kunci SSH yang dikonfigurasi saat membuat Droplet</li>
                    <li>Jika Anda memilih autentikasi kata sandi, cek email untuk detail login</li>
                  </ol>
                </div>
                
                <div className="bg-[#3fdaa4]/10 p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#3fdaa4] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Tips Keamanan
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Selalu gunakan autentikasi berbasis kunci, hindari autentikasi berbasis kata sandi jika memungkinkan
                    </li>
                    <li>
                      Batasi akses SSH hanya dari alamat IP yang diketahui melalui grup keamanan atau aturan firewall
                    </li>
                    <li>
                      Pertimbangkan untuk mengubah port SSH default (22) ke port non-standar untuk mengurangi serangan otomatis
                    </li>
                    <li>
                      Aktifkan multi-factor authentication (MFA) di akun cloud Anda untuk lapisan keamanan tambahan
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
              <h2 className="text-2xl font-bold text-[#d8dee9]">Lanjutan</h2>
            </div>
            <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <Code className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="integrasiApi" className="text-xl font-semibold text-[#6be5fd]">Integrasi API</h3>
              </div>
              <p>
                SysPulse menyediakan API internal untuk mengambil dan mengelola data server secara efisien.
                API ini digunakan oleh antarmuka pengguna untuk menampilkan informasi proses, sistem, dan eksekusi perintah langsung melalui koneksi SSH yang aman.
              </p>
              <ul>
                <li className="ml-6"><code>GET /process</code> - Mengambil daftar proses aktif dari server yang terhubung.</li>
                <li className="ml-6"><code>POST /kill</code> - Menghentikan proses berdasarkan PID yang diberikan.</li>
                <li className="ml-6"><code>GET /system</code> - Menyediakan statistik penggunaan CPU, memori, dan disk secara real-time.</li>
              </ul>
              <p>
                API tidak terbuka untuk publik dan hanya dapat diakses selama sesi pengguna aktif berlangsung, menjaga keamanan dari penyalahgunaan eksternal.
              </p>

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <Shield className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="keamanan" className="text-xl font-semibold text-[#6be5fd]">Keamanan</h3>
              </div>
              <p>
                Keamanan adalah prioritas utama dalam SysPulse. Sistem ini dibangun untuk memastikan bahwa semua data koneksi bersifat temporer dan aman.
              </p>
              <ul>
                <li>Private key tidak pernah disimpan di server — hanya digunakan saat sesi berlangsung.</li>
                <li>Autentikasi menggunakan SSH Key, bukan password, untuk meminimalkan risiko serangan brute-force.</li>
                <li>Session akan otomatis ditutup setelah periode tidak aktif untuk mencegah akses tidak sah.</li>
                <li>Input dari pengguna tidak disimpan ke database atau log tanpa izin eksplisit.</li>
              </ul>
              <p>
                Kami sangat menyarankan pengguna untuk menggunakan key dengan passphrase aktif dan selalu menjaga hak akses server dengan benar.
              </p>

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <HelpCircle className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="pemecahanMasalah" className="text-xl font-semibold text-[#6be5fd]">Pemecahan Masalah</h3>
              </div>
              <p>
                Jika anda mengalami kendala teknis saat menggunakan SysPulse, berikut beberapa solusi cepat yang bisa dicoba:
              </p>
              <ul>
                <li><strong>- Koneksi SSH gagal:</strong> Verifikasi host, port, username, dan kunci privat Anda.</li>
                <li><strong>- Tidak muncul data di dashboard:</strong> Pastikan server merespons perintah seperti <code>ps</code> dan <code>top</code>.</li>
                <li><strong>- Kunci tidak cocok:</strong> Gunakan format OpenSSH dan hindari karakter aneh hasil copy-paste.</li>
                <li><strong>- Proses tidak bisa dihentikan:</strong> Mungkin memerlukan hak sudo. Coba gunakan user dengan izin lebih tinggi.</li>
                <li><strong>- Sistem tidak responsif:</strong> Refresh halaman, atau coba putuskan koneksi dan sambung ulang.</li>
              </ul>
              <p>
                Jika permasalahan belum terselesaikan, silakan hubungi tim pengembang melalui halaman bantuan atau kirimkan log dari halaman browser Anda.
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