"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { UserNav } from "@/components/user-nav"
import { useState } from "react"

// Import the Logo component
import { Logo } from "@/components/logo"

// Add a custom style for the logo
const logoStyles = {
  ".clip-path-triangle": {
    clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
  },
  ".clip-path-triangle-2": {
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
  },
}

export function NavBar() {
  const { user, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="border-b bg-white">
      <style jsx global>{`
        .clip-path-triangle {
          clip-path: polygon(0 100%, 100% 100%, 100% 0);
        }
        .clip-path-triangle-2 {
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium hover:text-[#4CAF50]">
              Find Events
            </Link>
            <Link href="/events/create" className="text-sm font-medium hover:text-[#4CAF50]">
              Create Event
            </Link>
            <Link href="/players" className="text-sm font-medium hover:text-[#4CAF50]">
              Find Players
            </Link>
          </div>

          {/* Auth Buttons or User Nav */}
          <div className="flex items-center gap-4">
            {!isLoading &&
              (user ? (
                <UserNav />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Log in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-[#4CAF50] text-white hover:bg-[#43A047]">Sign up</Button>
                  </Link>
                </>
              ))}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              href="/events"
              className="block py-2 text-base font-medium hover:text-[#4CAF50]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Events
            </Link>
            <Link
              href="/events/create"
              className="block py-2 text-base font-medium hover:text-[#4CAF50]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Event
            </Link>
            <Link
              href="/players"
              className="block py-2 text-base font-medium hover:text-[#4CAF50]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Players
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

