"use client"

import type React from "react"

import { useState } from "react"
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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteEvent } from "@/lib/events"

interface DeleteEventDialogProps {
  eventId: number
  eventTitle: string
  trigger?: React.ReactNode
  variant?: "button" | "icon"
  size?: "default" | "sm" | "lg" | "icon"
}

export function DeleteEventDialog({
  eventId,
  eventTitle,
  trigger,
  variant = "button",
  size = "default",
}: DeleteEventDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteEvent(eventId)
      setIsOpen(false)
      router.push("/events")
    } catch (err) {
      console.error("Error deleting event:", err)
      setError("Failed to delete event. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const defaultTrigger =
    variant === "icon" ? (
      <Button
        variant="outline"
        size={size === "icon" ? "icon" : size}
        className="text-red-500 hover:text-red-700"
        title="Delete Event"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ) : (
      <Button variant="outline" size={size} className="text-red-500 border-red-300 hover:bg-red-50">
        <Trash2 className="h-5 w-5 mr-2" /> Cancel Event
      </Button>
    )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Event
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{eventTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

