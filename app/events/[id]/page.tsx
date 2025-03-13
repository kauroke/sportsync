"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, MessageSquare, Share2, Edit, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteEventDialog } from "@/components/delete-event-dialog"
import { getEvent, type Event } from "@/lib/events"
import { useAuth } from "@/contexts/auth-context"
import { JoinEventDialog } from "@/components/join-event-dialog"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = Number.parseInt(params.id)
  const { user } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch event data
  useEffect(() => {
    async function loadEvent() {
      try {
        setIsLoading(true)
        const eventData = await getEvent(eventId)

        if (!eventData) {
          setError("Event not found")
          return
        }

        setEvent(eventData)
      } catch (err) {
        console.error("Error loading event:", err)
        setError("Failed to load event data")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  // Determine if the current user is the creator of this event
  const isCreator = user && event?.createdBy === user.id

  // Add this function to check if the user has already joined the event
  const hasUserJoined = user && event && event.participants ? event.participants.includes(user.id) : false

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold text-red-500 mb-2">Error</h1>
            <p className="text-gray-700 mb-4">{error || "Event not found"}</p>
            <Link href="/events">
              <Button variant="outline">Back to Events</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center">
            ← Back to Events
          </Link>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="bg-[#a3e635]/20 p-8">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <Badge className="bg-[#a3e635] text-black mb-2">
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                  <p className="text-gray-600">Hosted by {isCreator ? "You" : "Kenneth Yu"}</p>
                </div>
                <div className="flex items-start gap-2">
                  {isCreator && (
                    <>
                      <Link href={`/events/${eventId}/edit`}>
                        <Button variant="outline" size="icon" title="Edit Event">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteEventDialog eventId={eventId} eventTitle={event.title} variant="icon" size="icon" />
                    </>
                  )}
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-[#65a30d]" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {event.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Clock className="h-8 w-8 text-[#65a30d]" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-[#65a30d]" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <p className="text-gray-700 mb-4">{event.description || "No description provided."}</p>

                {event.equipment && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Equipment Provided:</h3>
                    <ul className="list-disc list-inside text-gray-700 ml-2">
                      {event.equipment.balls && <li>Tennis Balls</li>}
                      {event.equipment.rackets && <li>Extra Rackets</li>}
                      {event.equipment.water && <li>Water</li>}
                    </ul>
                  </div>
                )}

                {event.cost > 0 && <p className="mt-4 font-medium">Cost: ${event.cost.toFixed(2)} per player</p>}
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Players</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Host */}
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Host" />
                      <AvatarFallback>HO</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{isCreator ? "You" : "Kenneth Yu"}</p>
                      <p className="text-sm text-gray-500">
                        Host • {event.skillLevel.charAt(0).toUpperCase() + event.skillLevel.slice(1)}
                      </p>
                    </div>
                  </div>

                  {/* Other participants */}
                  {event.participants && event.participants.length > 1
                    ? event.participants.slice(1).map((participantId, index) => (
                        <div
                          key={participantId}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={`Participant ${index}`} />
                            <AvatarFallback>{participantId === user?.id ? "ME" : "P" + (index + 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participantId === user?.id ? "You" : `Player ${index + 1}`}</p>
                            <p className="text-sm text-gray-500">
                              Joined • {event.skillLevel.charAt(0).toUpperCase() + event.skillLevel.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))
                    : null}

                  {/* Open spots */}
                  {Array.from({ length: Math.max(0, event.playersNeeded - (event.participants?.length || 1)) }).map(
                    (_, index) => (
                      <div
                        key={`open-${index}`}
                        className="flex items-center justify-center gap-4 p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="text-center">
                          <p className="font-medium text-gray-500">Open Spot</p>
                          <p className="text-sm text-gray-400">
                            {event.playersNeeded - (event.participants?.length || 1)} spot
                            {event.playersNeeded - (event.participants?.length || 1) !== 1 ? "s" : ""} remaining
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Discussion</h2>
                <div className="space-y-4 mb-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Sarah Lee</p>
                        <p className="text-gray-700">Looking forward to this! Do we need to bring our own balls?</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex" />
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Alex Thompson</p>
                        <p className="text-gray-700">Yes, please bring a can if you have one. I'll bring some too!</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-3 min-h-[80px] resize-none"
                      placeholder="Write a message..."
                    ></textarea>
                    <Button size="sm" className="absolute bottom-3 right-3 bg-[#a3e635] text-black hover:bg-[#84cc16]">
                      <MessageSquare className="h-4 w-4 mr-2" /> Post
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                {isCreator ? (
                  <div className="flex gap-4">
                    <Link href={`/events/${eventId}/edit`}>
                      <Button size="lg" className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
                        <Edit className="h-5 w-5 mr-2" /> Edit Event
                      </Button>
                    </Link>
                    <DeleteEventDialog eventId={eventId} eventTitle={event.title} size="lg" />
                  </div>
                ) : hasUserJoined ? (
                  <Button size="lg" variant="outline" disabled>
                    <Check className="h-5 w-5 mr-2" /> You've Joined
                  </Button>
                ) : (
                  <JoinEventDialog eventId={eventId} eventTitle={event.title} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

