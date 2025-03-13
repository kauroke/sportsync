"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Loader2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { joinEvent } from "@/lib/events"

interface JoinEventDialogProps {
  eventId: number
  eventTitle: string
}

export function JoinEventDialog({ eventId, eventTitle }: JoinEventDialogProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Check if we should auto-open the dialog (user just logged in to join this event)
  useEffect(() => {
    if (user) {
      const storedEventId = localStorage.getItem("joinEventAfterLogin")
      if (storedEventId && Number(storedEventId) === eventId) {
        // Clear the stored event ID
        localStorage.removeItem("joinEventAfterLogin")
        // Open the dialog
        setIsOpen(true)
      }
    }
  }, [user, eventId])

  const handleJoinEvent = async () => {
    // If user is not logged in, redirect to login page
    if (!user) {
      // Store the event ID in localStorage so we can redirect back after login
      localStorage.setItem("joinEventAfterLogin", eventId.toString())
      router.push("/login")
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      // Call the joinEvent function
      const result = await joinEvent(eventId, user.id)

      if (!result) {
        throw new Error("Failed to join event")
      }

      setSuccess(true)

      // Close the dialog after a short delay
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        // Refresh the page to show updated participants
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("Error joining event:", err)
      setError("Failed to join event. Please try again.")
    } finally {
      setIsJoining(false)
    }
  }

  // If user is not logged in, clicking the button redirects to login
  const handleButtonClick = () => {
    if (!user) {
      localStorage.setItem("joinEventAfterLogin", eventId.toString())
      router.push("/login")
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      {user ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
              <Users className="h-5 w-5 mr-2" /> Join This Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join Event</DialogTitle>
              <DialogDescription>Are you sure you want to join "{eventTitle}"?</DialogDescription>
            </DialogHeader>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Successfully joined the event!
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isJoining || success}>
                Cancel
              </Button>
              <Button
                className="bg-[#a3e635] text-black hover:bg-[#84cc16]"
                onClick={handleJoinEvent}
                disabled={isJoining || success}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : success ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Joined
                  </>
                ) : (
                  "Join Event"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button size="lg" className="bg-[#a3e635] text-black hover:bg-[#84cc16]" onClick={handleButtonClick}>
          <Users className="h-5 w-5 mr-2" /> Join This Event
        </Button>
      )}
    </>
  )
}

