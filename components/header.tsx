"use client"

import { useRouter } from "next/navigation"
import { Terminal, LogOut, BarChart2, Settings, ChevronDown, BookOpen, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Add scroll effect detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)
    
    // Check initial scroll position
    handleScroll()
    
    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Use NextAuth user data directly
  useEffect(() => {
    if (user) {
      setUserProfile({
        id: user.id,
        email: user.email,
        full_name: user.name || user.email?.split('@')[0],
        image: user.image,
        role: 'User'
      })
    }
  }, [user])

  const handleLogout = async () => {
    await signOut()
    toast({
      title: "Logged out successfully",
      description: "Redirecting to login page...",
    })
  }
  
  // Extract the user's initials for the avatar fallback
  const getUserInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    
    return 'SP' // SysPulse default
  }

  return (
    <header className={`
      fixed top-0 left-0 right-0 w-full z-50
      transition-all duration-300 ease-in-out
      ${isScrolled 
        ? "bg-[#161616]/70 backdrop-blur-md shadow-lg" 
        : "bg-[#161616]"}
    `}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <div className="group flex items-center space-x-2 cursor-pointer relative">
          <Terminal className="h-6 w-6 font-bold text-[#6be5fd] group-hover:text-[#8ff4ff] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3" />
          <Link 
            href="/" 
            className="text-[#d8dee9] text-xl font-bold relative z-10 
                      transition-all duration-300 ease-in-out
                      group-hover:text-[#ffffff]
                      group-hover:tracking-wide"
          >
            Sys<span className="text-[#6be5fd] group-hover:text-[#8ff4ff] transition-all duration-300">Pulse</span>
          </Link>
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6be5fd]/0 via-[#6be5fd]/10 to-[#3fdaa4]/0 
                        rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          {/* Pulse animation */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6be5fd]/0 via-[#6be5fd]/5 to-[#3fdaa4]/0 
                        rounded-lg blur opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center p-1 text-[#d8dee9] hover:text-[#6be5fd] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                pathname === "/" 
                  ? "bg-[#1e1e1e] text-[#6be5fd]" 
                  : "text-[#d8dee9] hover:text-[#6be5fd]"
              }`}
            >
              <div className="flex items-center space-x-2 relative z-10">
                <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="group-hover:tracking-wide transition-all duration-300">Home</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#6be5fd]/5 to-[#3fdaa4]/5 
                           transition-all duration-300 group-hover:h-full rounded-md -z-0"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] 
                           transition-all duration-300 group-hover:w-full"></div>
            </Link>

            <Link 
              href="/docs" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                pathname === "/docs" 
                  ? "bg-[#1e1e1e] text-[#6be5fd]" 
                  : "text-[#d8dee9] hover:text-[#6be5fd]"
              }`}
            >
              <div className="flex items-center space-x-2 relative z-10">
                <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="group-hover:tracking-wide transition-all duration-300">Docs</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#6be5fd]/5 to-[#3fdaa4]/5 
                           transition-all duration-300 group-hover:h-full rounded-md -z-0"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] 
                           transition-all duration-300 group-hover:w-full"></div>
            </Link>

            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                    pathname === "/dashboard" 
                      ? "bg-[#1e1e1e] text-[#6be5fd]" 
                      : "text-[#d8dee9] hover:text-[#6be5fd]"
                  }`}
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    <BarChart2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="group-hover:tracking-wide transition-all duration-300">Dashboard</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#6be5fd]/5 to-[#3fdaa4]/5 
                               transition-all duration-300 group-hover:h-full rounded-md -z-0"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] 
                               transition-all duration-300 group-hover:w-full"></div>
                </Link>
                
                <Link 
                  href="/terminal" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                pathname === "/terminal" 
                  ? "bg-[#1e1e1e] text-[#3fdaa4]" 
                  : "text-[#d8dee9] hover:text-[#3fdaa4]"
              }`}
            >
              <div className="flex items-center space-x-2 relative z-10">
                <Terminal className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="group-hover:tracking-wide transition-all duration-300">Terminal</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#3fdaa4]/5 to-[#6be5fd]/5 
                           transition-all duration-300 group-hover:h-full rounded-md -z-0"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3fdaa4] to-[#6be5fd] 
                           transition-all duration-300 group-hover:w-full"></div>
            </Link>
              </>
            )}
          </nav>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 p-0 border-[#3fdaa4] bg-transparent hover:bg-[#3fdaa4]/10 transition-colors">
                  <Avatar className="h-9 w-9">
                    {userProfile?.image ? (
                      <AvatarImage 
                        src={userProfile.image} 
                        alt={userProfile.full_name || ""} 
                      />
                    ) : null}
                    <AvatarFallback className="bg-[#1e1e1e] text-[#3fdaa4] text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-[#3fdaa4] bg-[#161616] shadow-lg shadow-[#3fdaa4]/10">
                <DropdownMenuLabel className="text-[#3fdaa4]">
                  {userProfile?.full_name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#3fdaa4]/20" />
                <DropdownMenuItem 
                  onClick={() => router.push('/settings')}
                  className="text-[#d8dee9] hover:bg-[#3fdaa4]/10 cursor-pointer flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-[#d8dee9] hover:bg-[#3fdaa4]/10 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.push('/login')}
                variant="ghost"
                className="text-[#d8dee9] hover:text-[#ffffff] hover:bg-[#3fdaa4]/10 transition-all duration-300"
            >
              Login
            </Button>
              <Button
                onClick={() => router.push('/register')}
                className="bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] hover:from-[#8ff4ff] hover:to-[#5eefc0] text-[#161616] font-medium shadow-md hover:shadow-lg hover:shadow-[#3fdaa4]/20 transition-all duration-300"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#161616] border-t border-[#3fdaa4]/10 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/" 
                  ? "bg-[#1e1e1e] text-[#6be5fd]" 
                  : "text-[#d8dee9] hover:bg-[#1e1e1e]"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </div>
            </Link>

            <Link 
              href="/docs" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/docs" 
                  ? "bg-[#1e1e1e] text-[#6be5fd]" 
                  : "text-[#d8dee9] hover:bg-[#1e1e1e]"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5" />
                <span>Docs</span>
              </div>
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/dashboard" 
                      ? "bg-[#1e1e1e] text-[#6be5fd]" 
                      : "text-[#d8dee9] hover:bg-[#1e1e1e]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <BarChart2 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link 
                  href="/terminal" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/terminal" 
                      ? "bg-[#1e1e1e] text-[#3fdaa4]" 
                      : "text-[#d8dee9] hover:bg-[#1e1e1e]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Terminal className="h-5 w-5" />
                    <span>Terminal</span>
                  </div>
                </Link>
              </>
            )}

            {!user ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Button
                  onClick={() => {
                    router.push('/login')
                    setIsMobileMenuOpen(false)
                  }}
                  variant="outline"
                  className="w-full border-[#3fdaa4] text-[#d8dee9] hover:bg-[#3fdaa4]/10"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    router.push('/register')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-[#6be5fd] to-[#3fdaa4] text-[#161616]"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                variant="outline"
                className="w-full mt-4 border-[#3fdaa4] text-[#d8dee9] hover:bg-[#3fdaa4]/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
