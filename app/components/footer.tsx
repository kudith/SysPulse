import Link from 'next/link'
import { Terminal, Github, Twitter, Mail, ChevronRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#0a0a0a] to-[#121212] py-10 border-t border-[#3fdaa4]/10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Logo and About Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logo */}
            <div className="flex items-center">
              <Terminal className="h-6 w-6 text-[#6be5fd] mr-2" />
              <span className="text-[#d8dee9] font-semibold text-xl">
                Sys<span className="text-[#6be5fd]">Pulse</span>
              </span>
            </div>
            
            {/* About Card */}
            <div className="bg-[#131313] p-5 rounded-lg border border-[#3fdaa4]/10">
              <h3 className="text-[#d8dee9] font-medium text-base mb-3">About SysPulse</h3>
              <p className="text-[#a8aebb] text-xs leading-relaxed">
                SysPulse is a state-of-the-art system monitoring platform designed for monitoring needs. 
                Our technology combines real-time metrics, intelligent notifications, and an intuitive dashboard.
              </p>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="lg:col-span-7 p-3">
            <h3 className="text-[#d8dee9] font-medium text-base mb-4">Quick Links</h3>
            
            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Dashboard Link */}
              <Link 
                href="/dashboard" 
                className="bg-[#131313] p-4 rounded-lg border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 group transition-all"
              >
                <div className="flex items-center text-[#d8dee9] font-medium text-sm group-hover:text-[#6be5fd]">
                  Dashboard
                  <ChevronRight className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[#a8aebb] text-xs mt-1.5">
                  System monitoring dashboard
                </p>
              </Link>
              
              {/* Docs Link */}
              <Link 
                href="/docs" 
                className="bg-[#131313] p-4 rounded-lg border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 group transition-all"
              >
                <div className="flex items-center text-[#d8dee9] font-medium text-sm group-hover:text-[#6be5fd]">
                  Docs
                  <ChevronRight className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[#a8aebb] text-xs mt-1.5">
                  Guides and references
                </p>
              </Link>
              
              {/* Terminal Link */}
              <Link 
                href="/terminal" 
                className="bg-[#131313] p-4 rounded-lg border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 group transition-all"
              >
                <div className="flex items-center text-[#d8dee9] font-medium text-sm group-hover:text-[#6be5fd]">
                  Terminal
                  <ChevronRight className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[#a8aebb] text-xs mt-1.5">
                  Command-line access
                </p>
              </Link>
            </div>
            
            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-[#d8dee9] font-medium text-base mb-4">Connect With Us</h3>
              <div className="flex space-x-3">
                <a 
                  href="https://github.com" 
                  className="bg-[#131313] p-2.5 rounded-lg text-[#a8aebb] hover:text-[#6be5fd] border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  className="bg-[#131313] p-2.5 rounded-lg text-[#a8aebb] hover:text-[#6be5fd] border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a 
                  href="mailto:info@syspulse.dev" 
                  className="bg-[#131313] p-2.5 rounded-lg text-[#a8aebb] hover:text-[#6be5fd] border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 transition-all"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-[#3fdaa4]/10 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#a8aebb] text-xs">
            © {new Date().getFullYear()} SysPulse. All rights reserved.
          </p>
          <p className="text-[#a8aebb] text-xs mt-2 md:mt-0">
            Built with precision for DevOps teams
          </p>
        </div>
      </div>
    </footer>
  )
} 