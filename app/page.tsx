'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Terminal, Gauge, Shield, Zap, Code, Server, ChevronRight } from 'lucide-react'
import { AnimatedTerminal } from './components/animated-terminal'
import { WaveAnimation } from './components/wave-animation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [stars, setStars] = useState<Array<{top: string, left: string, opacity: number, animation: string}>>([]);
  const [gridCells, setGridCells] = useState<Array<{opacity: number, animation: string}>>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Generate random stars for the background
    const newStars = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.7,
      animation: `twinkle ${3 + Math.random() * 7}s infinite ${Math.random() * 5}s`
    }));
    setStars(newStars);
    
    // Generate random grid cells for the CTA section
    const newGridCells = Array.from({ length: 12 * 6 }).map(() => ({
      opacity: Math.random() * 0.5 + 0.1,
      animation: `pulse ${2 + Math.random() * 4}s infinite ${Math.random() * 2}s`
    }));
    setGridCells(newGridCells);
    
    // Set loaded state
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#090909] z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#161616] to-[#121212] z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#3fdaa4]/10 via-transparent to-transparent blur-3xl opacity-20 z-0"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-[#6be5fd]/5 blur-3xl opacity-20 z-0"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#3fdaa4]/10 via-transparent to-transparent blur-3xl opacity-20 z-0"></div>
          
          {/* Animated particles */}
          <div className="stars absolute inset-0 z-0">
            {stars.map((star, i) => (
              <div 
                key={i} 
                className="star absolute w-1 h-1 rounded-full bg-white" 
                style={{
                  top: star.top,
                  left: star.left,
                  opacity: star.opacity,
                  animation: star.animation
                }}
              />
            ))}
          </div>
        </div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1e1e1e] border border-[#3fdaa4]/20 mb-6 backdrop-blur-lg">
              <span className="text-[#3fdaa4] text-sm font-medium tracking-wide">System Monitoring Reimagined</span>
            </div>
            
            <div className="mb-6">
              <h1 className="text-4xl max-w-3xl md:text-6xl font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#6be5fd] via-[#3fdaa4] to-[#d8dee9] animate-gradient">
                Modern System Monitoring & Control
              </h1>
            </div>
            
            <p className="text-[#a8aebb] text-lg md:text-xl max-w-3xl mb-10" style={{ 
              opacity: isLoaded ? 0 : 1,
              animation: isLoaded ? 'fadeIn 0.8s ease-out 0.8s forwards' : 'none'
            }}>
              SysPulse provides real-time monitoring, intuitive terminal access, and comprehensive analytics 
              for all your systems in one secure dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" style={{
              opacity: isLoaded ? 0 : 1,
              animation: isLoaded ? 'fadeIn 0.8s ease-out 1.2s forwards' : 'none'
            }}>
              <Link href="/register" className="w-full sm:w-auto group">
                <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] text-[#161616] font-medium shadow-lg shadow-[#3fdaa4]/20 hover:shadow-xl hover:shadow-[#3fdaa4]/30 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden">
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#6be5fd] via-white to-[#3fdaa4] blur-md"></div>
                </button>
              </Link>
              <Link href="/docs" className="w-full sm:w-auto group">
                <button className="w-full px-6 py-3 rounded-lg border border-[#6be5fd]/30 bg-[#161616]/50 text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#6be5fd]/50 transition-all duration-300 relative overflow-hidden flex items-center justify-center">
                  <span className="relative z-10">View Documentation</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#6be5fd]/5"></div>
                </button>
              </Link>
            </div>
            
            <div className="mt-20 max-w-5xl w-full" style={{
              opacity: isLoaded ? 0 : 1,
              animation: isLoaded ? 'slideUp 0.8s ease-out 1.5s forwards' : 'none'
            }}>
              <AnimatedTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#121212] relative overflow-hidden">
        <WaveAnimation />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#d8dee9] mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4]">
                Powerful Features
              </span>
            </h2>
            <p className="text-[#a8aebb] max-w-2xl mx-auto">
              SysPulse combines best-in-class monitoring with intuitive controls 
              to keep your systems running smoothly.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {/* Feature 1 */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#3fdaa4]/10 flex items-center justify-center mr-4">
                    <Gauge className="h-8 w-8 text-[#3fdaa4]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#3fdaa4]">Real-time Monitoring</h3>
                </div>
                
                <div className="h-0.5 w-16 bg-gradient-to-r from-[#3fdaa4] to-transparent mb-6"></div>
                
                <p className="text-[#a8aebb] text-lg">
                  Track CPU, memory, disk, and network performance with millisecond precision and customizable alerts.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#6be5fd]/10 flex items-center justify-center mr-4">
                    <Terminal className="h-8 w-8 text-[#6be5fd]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#6be5fd]">Interactive Terminal</h3>
                </div>
                
                <div className="h-0.5 w-16 bg-gradient-to-r from-[#6be5fd] to-transparent mb-6"></div>
                
                <p className="text-[#a8aebb] text-lg">
                  Access and control your systems through our secure web-based terminal with command history and autocomplete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#3fdaa4]/5 via-transparent to-transparent blur-3xl opacity-30"></div>
          <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-gradient-to-br from-[#6be5fd]/5 via-transparent to-transparent blur-3xl opacity-30"></div>
          
          {/* Dynamic grid pattern */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-0.5 opacity-10">
            {gridCells.map((cell, i) => (
              <div 
                key={i} 
                className="bg-white" 
                style={{
                  opacity: cell.opacity,
                  animation: cell.animation
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#d8dee9] mb-6 leading-tight">
              Ready to <span className="text-[#6be5fd]">take control</span> of your systems?
            </h2>
            <p className="text-[#a8aebb] text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of system administrators who trust SysPulse 
              for reliable monitoring and control.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto group">
                <button className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] text-[#161616] font-medium shadow-lg shadow-[#3fdaa4]/20 hover:shadow-xl hover:shadow-[#3fdaa4]/30 transition-all duration-300 relative overflow-hidden">
                  <span className="relative z-10">Get Started For Free</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#6be5fd] via-white to-[#3fdaa4] blur-md"></div>
                </button>
              </Link>
              <Link href="/docs" className="w-full sm:w-auto group">
                <button className="w-full px-8 py-4 rounded-lg border border-[#6be5fd]/30 bg-[#161616]/50 text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#6be5fd]/50 transition-all duration-300 relative overflow-hidden">
                  <span className="relative z-10">Learn More</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#6be5fd]/5"></div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
