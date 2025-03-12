import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, MessageSquare, Share2, Edit } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteEventDialog } from "@/components/delete-event-dialog"
import { useEffect, useState } from "react"
import { getEvent, approveJoinRequest, denyJoinRequest } from "@/lib/events"
import type { Event as EventType } from "@/lib/events"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the event data based on the ID
  const eventId = params.id

  // Determine if the current user is the creator of this event
  // In a real app, this would be based on authentication
  const isCreator = true // For demo purposes, assume the user is the creator

  const [event, setEvent] = useState<EventType | undefined>(undefined)

  useEffect(() => {
    async function fetchEvent() {
      const fetchedEvent = await getEvent(Number(eventId))
      setEvent(fetchedEvent as EventType)
    }
    fetchEvent()
  }, [eventId])

  if (!event) {
    return <div>Loading...</div>
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
                  <Badge className="bg-[#a3e635] text-black mb-2">Practice Match</Badge>
                  <h1 className="text-3xl font-bold mb-2">Intermediate Singles Practice</h1>
                  <p className="text-gray-600">Hosted by Kenneth Uro</p>
                </div>
                <div className="flex items-start gap-2">
                  {isCreator && (
                    <>
                      <Link href={`/events/${eventId}/edit`}>
                        <Button variant="outline" size="icon" title="Edit Event">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteEventDialog
                        eventId={Number.parseInt(eventId)}
                        eventTitle="Intermediate Singles Practice"
                        variant="icon"
                        size="icon"
                      />
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
                      <p className="font-medium">Saturday, June 15, 2024</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Clock className="h-8 w-8 text-[#65a30d]" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">9:00 AM - 11:00 AM</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-[#65a30d]" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">Sydney Olympic Park Tennis Centre</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <p className="text-gray-700 mb-4">
                  Looking for an intermediate player for a practice match. We'll play best of 3 sets with a 10-point
                  tiebreaker for the third set if needed. I'm a 3.5 NTRP player looking to improve my game and get some
                  good rallies going.
                </p>
                <p className="text-gray-700">
                  Please bring your own water and tennis balls. The courts have good lighting and are well-maintained.
                  There's parking available nearby.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Players</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex" />
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Alex Thompson</p>
                      <p className="text-sm text-gray-500">Host • Intermediate</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Sarah Lee</p>
                      <p className="text-sm text-gray-500">Joined • Intermediate</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-center">
                      <p className="font-medium text-gray-500">Open Spot</p>
                      <p className="text-sm text-gray-400">1 spot remaining</p>
                    </div>
                  </div>
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
                    <DeleteEventDialog
                      eventId={Number.parseInt(eventId)}
                      eventTitle="Intermediate Singles Practice"
                      size="lg"
                    />
                  </div>
                ) : (
                  <Button size="lg" className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
                    <Users className="h-5 w-5 mr-2" /> Join This Event
                  </Button>
                )}
              </div>

              {isCreator && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Join Requests</h2>
                  <div className="space-y-4">
                    {event.joinRequests.map((request: { userId: string; status: string }) => (
                      <div key={request.userId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{request.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.userId}</p>
                            <p className="text-sm text-gray-500">Status: {request.status}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => approveJoinRequest(Number(eventId), request.userId)}
                            disabled={request.status === "approved"}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => denyJoinRequest(Number(eventId), request.userId)}
                            disabled={request.status === "denied"}
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

