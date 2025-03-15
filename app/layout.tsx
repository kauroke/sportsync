import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleMapsProvider } from "@/contexts/google-maps-context"
import { AuthProvider } from "@/contexts/auth-context"
import { NavBar } from "@/components/nav-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Court - Find Tennis Partners",
  description: "Connect with tennis players in your area for casual matches, practice sessions, and more.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get Google Maps API key from environment variable
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 
   if (!googleMapsApiKey) {
     throw new Error('Google Maps API key is not defined in environment variables')
   }
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <GoogleMapsProvider apiKey={googleMapsApiKey}>
              <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-1">{children}</main>
              </div>
            </GoogleMapsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'