import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Terminal, Gauge, Shield, Zap, Code, Server } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#121212] z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#161616] to-[#121212] z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#3fdaa4]/10 via-transparent to-transparent blur-3xl opacity-20 z-0"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#6be5fd]/5 blur-3xl opacity-20 z-0"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#3fdaa4]/10 via-transparent to-transparent blur-3xl opacity-20 z-0"></div>
        </div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1e1e1e] border border-[#3fdaa4]/20 mb-6">
              <span className="text-[#3fdaa4] text-sm font-medium">System Monitoring Reimagined</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#d8dee9] via-[#ffffff] to-[#d8dee9]">
              Modern System Monitoring & Control
            </h1>
            
            <p className="text-[#a8aebb] text-lg md:text-xl max-w-3xl mb-10">
              SysPulse provides real-time monitoring, intuitive terminal access, and comprehensive analytics 
              for all your systems in one secure dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] text-[#161616] font-medium shadow-lg shadow-[#3fdaa4]/20 hover:shadow-xl hover:shadow-[#3fdaa4]/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/docs" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 rounded-lg border border-[#6be5fd]/30 bg-[#161616]/50 text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#6be5fd]/50 transition-all duration-300">
                  View Documentation
                </button>
              </Link>
            </div>
            
            <div className="mt-16 max-w-5xl w-full">
              <div className="relative rounded-xl overflow-hidden border border-[#3fdaa4]/20 shadow-2xl shadow-[#3fdaa4]/5">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6be5fd]/50 to-transparent"></div>
                <div className="bg-[#161616] rounded-xl overflow-hidden">
                  <div className="h-6 bg-[#1e1e1e] flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    </div>
                  </div>
                  <div className="p-4 h-[300px] overflow-hidden bg-[#121212] border-t border-[#3fdaa4]/10 flex items-center justify-center text-[#6be5fd]">
                    <Terminal size={120} className="opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#161616]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#d8dee9] mb-4">Powerful Features</h2>
            <p className="text-[#a8aebb] max-w-2xl mx-auto">
              SysPulse combines best-in-class monitoring with intuitive controls 
              to keep your systems running smoothly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center mb-5 group-hover:bg-[#3fdaa4]/20 transition-colors duration-300">
                <Gauge className="h-6 w-6 text-[#3fdaa4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#d8dee9] mb-3">Real-time Monitoring</h3>
              <p className="text-[#a8aebb]">
                Track CPU, memory, disk, and network performance with millisecond precision and customizable alerts.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#6be5fd]/10 hover:border-[#6be5fd]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center mb-5 group-hover:bg-[#6be5fd]/20 transition-colors duration-300">
                <Terminal className="h-6 w-6 text-[#6be5fd]" />
              </div>
              <h3 className="text-xl font-semibold text-[#d8dee9] mb-3">Interactive Terminal</h3>
              <p className="text-[#a8aebb]">
                Access and control your systems through our secure web-based terminal with command history and autocomplete.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center mb-5 group-hover:bg-[#3fdaa4]/20 transition-colors duration-300">
                <Shield className="h-6 w-6 text-[#3fdaa4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#d8dee9] mb-3">Enterprise Security</h3>
              <p className="text-[#a8aebb]">
                End-to-end encryption, role-based access control, and detailed audit logs for maximum security.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#6be5fd]/10 hover:border-[#6be5fd]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center mb-5 group-hover:bg-[#6be5fd]/20 transition-colors duration-300">
                <Zap className="h-6 w-6 text-[#6be5fd]" />
              </div>
              <h3 className="text-xl font-semibold text-[#d8dee9] mb-3">Instant Alerts</h3>
              <p className="text-[#a8aebb]">
                Configure smart notifications via email, SMS, or webhook when systems need attention.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#3fdaa4]/10 hover:border-[#3fdaa4]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center mb-5 group-hover:bg-[#3fdaa4]/20 transition-colors duration-300">
                <Code className="h-6 w-6 text-[#3fdaa4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#d8dee9] mb-3">API Integration</h3>
              <p className="text-[#a8aebb]">
                Comprehensive API for seamless integration with your existing tools and workflows.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#6be5fd]/10 hover:border-[#6be5fd]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center mb-5 group-hover:bg-[#6be5fd]/20 transition-colors duration-300">
                <Server className="h-6 w-6 text-[#6be5fd]" />
              </div>
              <h3 className="text-xl font-semibold text-[#d8dee9] mb-3">Multi-server Support</h3>
              <p className="text-[#a8aebb]">
                Monitor and manage hundreds of servers from a single unified dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#121212] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#3fdaa4]/5 via-transparent to-transparent blur-3xl opacity-30 z-0"></div>
          <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-gradient-to-br from-[#6be5fd]/5 via-transparent to-transparent blur-3xl opacity-30 z-0"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#d8dee9] mb-6">
              Ready to take control of your systems?
            </h2>
            <p className="text-[#a8aebb] text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of system administrators who trust SysPulse 
              for reliable monitoring and control.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] text-[#161616] font-medium shadow-lg shadow-[#3fdaa4]/20 hover:shadow-xl hover:shadow-[#3fdaa4]/30 transition-all duration-300">
                  Get Started For Free
                </button>
              </Link>
              <Link href="/docs" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 rounded-lg border border-[#6be5fd]/30 bg-[#161616]/50 text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#6be5fd]/50 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161616] py-10 border-t border-[#3fdaa4]/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Terminal className="h-5 w-5 text-[#6be5fd] mr-2" />
              <span className="text-[#d8dee9] font-bold text-lg">
                Sys<span className="text-[#6be5fd]">Pulse</span>
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="/docs" className="text-[#a8aebb] hover:text-[#d8dee9] transition-colors">
                Documentation
              </Link>
              <Link href="/login" className="text-[#a8aebb] hover:text-[#d8dee9] transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-[#a8aebb] hover:text-[#d8dee9] transition-colors">
                Register
              </Link>
            </div>
            <div className="mt-6 md:mt-0 text-[#a8aebb] text-sm">
              © {new Date().getFullYear()} SysPulse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
