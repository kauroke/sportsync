"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define user type
export interface User {
  id: string
  name: string
  email: string
  image?: string
  provider?: "facebook" | "email"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  facebookLogin: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  facebookLogin: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, this would check with your backend
        const storedUser = localStorage.getItem("tennis_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to restore session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // Login function
  const login = (userData: User) => {
    setUser(userData)
    // In a real app, this would set cookies or tokens
    localStorage.setItem("tennis_user", JSON.stringify(userData))
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("tennis_user")
    router.push("/")
  }

  // Facebook login function
  const facebookLogin = async () => {
    try {
      setIsLoading(true)

      // In a real app, this would use the Facebook SDK
      // For demo purposes, we'll simulate a successful login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data from Facebook
      const facebookUser: User = {
        id: `fb_${Math.random().toString(36).substring(2, 15)}`,
        name: "John Doe",
        email: "john.doe@example.com",
        image: "/placeholder.svg?height=200&width=200",
        provider: "facebook",
      }

      login(facebookUser)
      router.push("/events")
    } catch (error) {
      console.error("Facebook login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, facebookLogin }}>{children}</AuthContext.Provider>
  )
}

