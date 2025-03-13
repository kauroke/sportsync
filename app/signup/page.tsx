"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Facebook } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const router = useRouter()
  const { login, facebookLogin, user } = useAuth()

  // Check if there's a redirect after signup
  useEffect(() => {
    // If user is already logged in, handle redirect
    if (user) {
      handleRedirectAfterSignup()
    }

    // Check if we need to redirect to join an event or create an event
    const eventId = localStorage.getItem("joinEventAfterLogin")
    const createEventRedirect = localStorage.getItem("redirectAfterLogin")

    if (eventId) {
      setRedirectUrl(`/events/${eventId}`)
    } else if (createEventRedirect) {
      setRedirectUrl(createEventRedirect)
    }
  }, [user, router])

  const handleRedirectAfterSignup = () => {
    // First check if user was trying to create an event
    const createEventRedirect = localStorage.getItem("redirectAfterLogin")
    if (createEventRedirect) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(createEventRedirect)
      return
    }

    // Then check if user was trying to join an event
    const eventId = localStorage.getItem("joinEventAfterLogin")
    if (eventId) {
      localStorage.removeItem("joinEventAfterLogin")
      router.push(`/events/${eventId}`)
      return
    }

    // Otherwise redirect to events page
    router.push("/events")
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would call your registration API
      // For demo purposes, we'll simulate a successful signup

      // Validate inputs
      if (!name || !email || !password) {
        throw new Error("Please fill in all required fields")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const user = {
        id: `user_${Math.random().toString(36).substring(2, 15)}`,
        name,
        email,
        provider: "email",
      } as const

      login(user)
      handleRedirectAfterSignup()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookSignup = async () => {
    setError(null)
    try {
      await facebookLogin()
      handleRedirectAfterSignup()
    } catch (err) {
      setError("Facebook signup failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            {redirectUrl
              ? redirectUrl.includes("/events/create")
                ? "Sign up to create an event"
                : "Sign up to join this event"
              : "Sign up to find tennis partners in your area"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#a3e635] text-black hover:bg-[#84cc16]" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={handleFacebookSignup}
            disabled={isLoading}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#65a30d] hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

