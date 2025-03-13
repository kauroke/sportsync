"use client"

import type React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface CreateEventButtonProps extends ButtonProps {
  showIcon?: boolean
  children?: React.ReactNode
}

export function CreateEventButton({ showIcon = true, children, ...props }: CreateEventButtonProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handleClick = () => {
    if (user) {
      // If logged in, go to create event page
      router.push("/events/create")
    } else {
      // If not logged in, store redirect and go to login page
      localStorage.setItem("redirectAfterLogin", "/events/create")
      router.push("/login")
    }
  }

  return (
    <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]" onClick={handleClick} {...props}>
      {showIcon && <Plus className="mr-2 h-4 w-4" />}
      {children || "Create Event"}
    </Button>
  )
}

