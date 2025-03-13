"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Edit, MapPin, Plus, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getEvents, type Event } from "@/lib/events"
import { DeleteEventDialog } from "@/components/delete-event-dialog"

export default function MyEventsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true)
        const allEvents = await getEvents()

        // In a real app, we would filter by the actual user ID
        // For demo purposes, we'll just use some of the events
        setEvents(allEvents.slice(0, 2))
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setIsLoadingEvents(false)
      }
    }

    if (user) {
      loadEvents()
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Tennis Events</h1>
              <p className="text-gray-600">Manage your created and joined events</p>
            </div>
            <Link href="/events/create">
              <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="created">
            <TabsList className="mb-6">
              <TabsTrigger value="created">Created by Me</TabsTrigger>
              <TabsTrigger value="joined">Joined Events</TabsTrigger>
            </TabsList>

            <TabsContent value="created">
              {isLoadingEvents ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your events...</p>
                </div>
              ) : events.length > 0 ? (
                <div className="grid gap-6">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-xl">
                              🎾
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <p className="text-sm text-gray-500 capitalize">{event.skillLevel} Level</p>
                              <div className="space-y-1 mt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {event.date.toLocaleDateString("en-US", {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {event.startTime} - {event.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="w-4 h-4" />
                                  <span>2/{event.playersNeeded + 1} players joined</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex md:flex-col gap-2 self-end md:self-center">
                            <Link href={`/events/${event.id}/edit`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </Button>
                            </Link>
                            <DeleteEventDialog
                              eventId={event.id}
                              eventTitle={event.title}
                              trigger={
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-red-500 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Cancel
                                </Button>
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Events Created</CardTitle>
                    <CardDescription>You haven't created any tennis events yet.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Create your first event to find tennis partners in your area.</p>
                    <Link href="/events/create">
                      <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
                        <Plus className="mr-2 h-4 w-4" /> Create Event
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="joined">
              <Card>
                <CardHeader>
                  <CardTitle>Joined Events</CardTitle>
                  <CardDescription>Events you've joined will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">You haven't joined any events yet.</p>
                  <Link href="/events">
                    <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

