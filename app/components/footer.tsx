import Link from 'next/link'
import { Terminal, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#0a0a0a] to-[#121212] py-12 border-t border-[#3fdaa4]/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center">
              <Terminal className="h-6 w-6 text-[#6be5fd] mr-2" />
              <span className="text-[#d8dee9] font-bold text-xl">
                Sys<span className="text-[#6be5fd]">Pulse</span>
              </span>
            </div>
            <p className="text-[#a8aebb] text-sm">
              Real-time system monitoring and control with elegant dashboards and powerful tools.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:info@syspulse.dev" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[#d8dee9] font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Features</Link></li>
              <li><Link href="/pricing" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/roadmap" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Roadmap</Link></li>
              <li><Link href="/changelog" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#d8dee9] font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Documentation</Link></li>
              <li><Link href="/api" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">API Reference</Link></li>
              <li><Link href="/guides" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Guides</Link></li>
              <li><Link href="/blog" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#d8dee9] font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Careers</Link></li>
              <li><Link href="/contact" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Contact</Link></li>
              <li><Link href="/legal" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3fdaa4]/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#a8aebb] text-sm">
            © {new Date().getFullYear()} SysPulse. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-[#a8aebb] hover:text-[#6be5fd] transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 