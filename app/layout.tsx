import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"
import { GoogleMapsProvider } from "@/contexts/google-maps-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TennisMatch - Find Tennis Partners",
  description: "Connect with tennis players in your area for casual matches, practice sessions, and more.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get Google Maps API key from environment variable
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCpXFSrurpD0j2Rv8yjuVQzsUIWEZlpbDs"

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <GoogleMapsProvider apiKey={googleMapsApiKey}>
            <div className="flex flex-col min-h-screen">
              <nav className="border-b bg-white">
                <div className="container mx-auto px-4">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#a3e635] flex items-center justify-center text-black text-lg font-bold">
                        T
                      </div>
                      <Link href="/" className="text-xl font-bold">
                        TennisMatch
                      </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                      <Link href="/events" className="text-sm font-medium hover:text-[#65a30d]">
                        Browse Events
                      </Link>
                      <Link href="/map" className="text-sm font-medium hover:text-[#65a30d] flex items-center gap-1">
                        <Map className="h-4 w-4" />
                        <span>Map View</span>
                      </Link>
                      <Link href="/events/create" className="text-sm font-medium hover:text-[#65a30d]">
                        Create Event
                      </Link>
                      <Link href="/players" className="text-sm font-medium hover:text-[#65a30d]">
                        Find Players
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link href="/login">
                        <Button variant="outline">Log in</Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">Sign up</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
              <main className="flex-1">{children}</main>
            </div>
          </GoogleMapsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'