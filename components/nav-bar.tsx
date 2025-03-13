"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { UserNav } from "@/components/user-nav"
import { useState } from "react"

export function NavBar() {
  const { user, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium hover:text-[#65a30d]">
              Find Events
            </Link>
            <Link href="/events/create" className="text-sm font-medium hover:text-[#65a30d]">
              Create Event
            </Link>
            <Link href="/players" className="text-sm font-medium hover:text-[#65a30d]">
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
                    <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">Sign up</Button>
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
              className="block py-2 text-base font-medium hover:text-[#65a30d]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Events
            </Link>
            <Link
              href="/events/create"
              className="block py-2 text-base font-medium hover:text-[#65a30d]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Event
            </Link>
            <Link
              href="/players"
              className="block py-2 text-base font-medium hover:text-[#65a30d]"
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

