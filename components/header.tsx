"use client"

import { useRouter } from "next/navigation"
import { Terminal, LogOut, BarChart2, Settings, ChevronDown } from "lucide-react"
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
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

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

  // Fetch user profile details from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return
      
      try {
        // Check if profiles table exists by attempting to select a single row
        const { error: tableCheckError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)
        
        // If table doesn't exist or there's another issue, create a local profile instead
        if (tableCheckError) {
          console.log('Profiles table might not exist:', tableCheckError.message)
          // Use user data directly without attempting to fetch from profiles
          setUserProfile({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            role: 'User'
          })
          return
        }
        
        // Now try to get the specific user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          
        if (error) {
          if (error.code === 'PGRST116') { // Record not found error code
            console.log('User profile not found, will create one if profiles table exists')
            
            // Create a profile for this user if the table exists but the profile doesn't
            try {
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([
                  { 
                    id: user.id, 
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    role: 'User',
                    created_at: new Date().toISOString()
                  }
                ])
                .select()
                
              if (insertError) {
                console.error('Error creating profile:', insertError)
                // Fall back to using auth user data
                setUserProfile({
                  id: user.id,
                  email: user.email,
                  full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                  role: 'User'
                })
              } else {
                console.log('Created new profile:', newProfile)
                setUserProfile(newProfile[0])
              }
            } catch (insertErr) {
              console.error('Exception creating profile:', insertErr)
              // Fall back to using auth user data
              setUserProfile({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                role: 'User'
              })
            }
          } else {
            console.error('Error fetching user profile:', error)
            // Fall back to using auth user data
            setUserProfile({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              role: 'User'
            })
          }
          return
        }
        
        console.log('Found existing profile:', data)
        setUserProfile(data)
        
        // If there's an avatar URL in the profile, get a public URL for it
        if (data?.avatar_url) {
          try {
            const { data: publicUrlData } = await supabase
              .storage
              .from('avatars')
              .getPublicUrl(data.avatar_url)
              
            setAvatarUrl(publicUrlData.publicUrl)
          } catch (avatarErr) {
            console.error('Error getting avatar URL:', avatarErr)
          }
        }
      } catch (err) {
        console.error('Exception in profile fetch:', err)
        // Fall back to using auth user data in case of any exception
        setUserProfile({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          role: 'User'
        })
      }
    }
    
    fetchUserProfile()
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
            href="/dashboard" 
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

        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-4">
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
              {/* Subtle background hover effect */}
              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#6be5fd]/5 to-[#3fdaa4]/5 
                           transition-all duration-300 group-hover:h-full rounded-md -z-0"></div>
              {/* Bottom border animation */}
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
              {/* Subtle background hover effect */}
              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#3fdaa4]/5 to-[#6be5fd]/5 
                           transition-all duration-300 group-hover:h-full rounded-md -z-0"></div>
              {/* Bottom border animation */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3fdaa4] to-[#6be5fd] 
                           transition-all duration-300 group-hover:w-full"></div>
            </Link>
          </nav>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-8 gap-2 group">
                  <div className="flex items-center space-x-2 rounded-md px-2 py-1 
                                  hover:bg-gradient-to-r hover:from-[#1e1e1e] hover:to-[#252525] 
                                  transition-all duration-300 ease-in-out relative overflow-hidden">
                    <Avatar className="h-8 w-8 border border-zinc-800/50 group-hover:border-[#6be5fd]/30 transition-all duration-300">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="bg-[#1e1e1e] text-[#6be5fd] text-xs group-hover:bg-[#1b2029] transition-colors duration-300">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                      <p className="text-sm font-medium text-[#d8dee9] group-hover:text-white transition-all duration-300">
                        {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-[#6272a4] line-clamp-1 group-hover:text-[#8295c2] transition-all duration-300">
                        {/* {userProfile?.email} */}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#6272a4] group-hover:text-[#d8dee9] transition-colors duration-300 group-hover:rotate-180" />
                    
                    {/* Subtle glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6be5fd]/0 via-[#6be5fd]/5 to-[#3fdaa4]/0 
                                opacity-0 group-hover:opacity-100 rounded-md blur-sm transition-all duration-500"></div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1e1e1e] border-zinc-800/50 text-[#d8dee9]
                                          animate-in slide-in-from-top-5 duration-200">
                <DropdownMenuLabel className="text-xs text-[#6272a4]">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800/50" />
                <DropdownMenuItem 
                  className="text-[#d8dee9] focus:bg-[#282a36] focus:text-[#d8dee9] cursor-pointer
                            group relative overflow-hidden hover:bg-gradient-to-r hover:from-[#282a36]/80 hover:to-[#282a36]/60
                            transition-all duration-300"
                  onClick={() => router.push('/profile')}
                >
                  <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#6be5fd]/10 to-transparent 
                                 group-hover:w-full transition-all duration-500"></div>
                  <Avatar className="h-4 w-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-[#1e1e1e] text-[#6be5fd] text-[10px] group-hover:bg-[#1b2029] transition-colors duration-300">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[#d8dee9] focus:bg-[#282a36] focus:text-[#d8dee9] cursor-pointer
                            group relative overflow-hidden hover:bg-gradient-to-r hover:from-[#282a36]/80 hover:to-[#282a36]/60
                            transition-all duration-300"
                  onClick={() => router.push('/settings')}
                >
                  <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#70e1e8]/10 to-transparent 
                                 group-hover:w-full transition-all duration-500"></div>
                  <Settings className="h-4 w-4 mr-2 text-[#70e1e8] relative z-10 group-hover:rotate-45 group-hover:scale-110 transition-all duration-300" />
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800/50" />
                <DropdownMenuItem 
                  className="text-[#ec6a88] focus:bg-[#282a36] focus:text-[#ec6a88] cursor-pointer
                            group relative overflow-hidden hover:bg-gradient-to-r hover:from-[#282a36]/80 hover:to-[#282a36]/60
                            transition-all duration-300"
                  onClick={handleLogout}
                >
                  <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#ec6a88]/10 to-transparent 
                                 group-hover:w-full transition-all duration-500"></div>
                  <LogOut className="h-4 w-4 mr-2 relative z-10 group-hover:translate-x-[-2px] group-hover:scale-110 transition-all duration-300" />
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
