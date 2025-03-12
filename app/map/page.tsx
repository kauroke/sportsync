"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, MapPin, Clock, Search, List } from "lucide-react"
import dynamic from "next/dynamic"

// Import map component dynamically to avoid SSR issues with Google Maps
const GoogleMapComponent = dynamic(() => import("@/components/google-map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-12rem)] bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

// Sample tennis events data with coordinates (Sydney, Australia)
const sampleEvents = [
  {
    id: 1,
    title: "Casual Hitting Session",
    type: "casual",
    skillLevel: "Beginner",
    date: "Saturday, June 15, 2024",
    time: "9:00 AM - 11:00 AM",
    location: "Sydney Olympic Park Tennis Centre",
    players: "2/4",
    coordinates: { lat: -33.8467, lng: 151.0665 },
  },
  {
    id: 2,
    title: "Practice Match",
    type: "practice",
    skillLevel: "Intermediate",
    date: "Sunday, June 16, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Rushcutters Bay Tennis",
    players: "1/2",
    coordinates: { lat: -33.8744, lng: 151.2326 },
  },
  {
    id: 3,
    title: "Doubles Play",
    type: "doubles",
    skillLevel: "Advanced",
    date: "Monday, June 17, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Centennial Park Tennis Centre",
    players: "3/4",
    coordinates: { lat: -33.8932, lng: 151.2324 },
  },
  {
    id: 4,
    title: "Morning Rally Session",
    type: "casual",
    skillLevel: "Intermediate",
    date: "Tuesday, June 18, 2024",
    time: "7:00 AM - 9:00 AM",
    location: "Bondi Tennis Courts",
    players: "1/2",
    coordinates: { lat: -33.8915, lng: 151.2767 },
  },
  {
    id: 5,
    title: "Weekend Tournament",
    type: "practice",
    skillLevel: "Advanced",
    date: "Saturday, June 22, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Manly Tennis Club",
    players: "6/8",
    coordinates: { lat: -33.7969, lng: 151.2842 },
  },
]

export default function MapViewPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [viewportWidth, setViewportWidth] = useState<number>(0)

  useEffect(() => {
    // Set initial viewport width
    setViewportWidth(window.innerWidth)

    // Update viewport width on resize
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = viewportWidth < 768

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Find Tennis Events</h1>
            <p className="text-gray-600">Discover tennis events on the map</p>
          </div>
          <div className="flex gap-2">
            <Link href="/events">
              <Button variant="outline" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>List View</span>
              </Button>
            </Link>
            <Link href="/events/create">
              <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">Create Event</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search by location" className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="all">All Levels</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual Hitting</SelectItem>
                <SelectItem value="practice">Practice Match</SelectItem>
                <SelectItem value="doubles">Doubles Play</SelectItem>
                <SelectItem value="all">All Types</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="weekend">This Weekend</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="all">Any Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Map and Event List */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Map takes 2/3 of the space on desktop, full width on mobile */}
          <div className={`${isMobile ? "order-2" : "md:col-span-2"}`}>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm h-[calc(100vh-12rem)]">
              <GoogleMapComponent
                events={sampleEvents}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />
            </div>
          </div>

          {/* Event list takes 1/3 of the space on desktop, full width on mobile */}
          <div className={`${isMobile ? "order-1" : ""}`}>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Nearby Events</h2>
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                {sampleEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`cursor-pointer transition-all ${selectedEvent === event.id ? "border-[#a3e635] ring-1 ring-[#a3e635]" : "hover:border-gray-300"}`}
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-lg">
                          🎾
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-xs text-gray-500">{event.skillLevel} Level</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{event.players} players</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link href={`/events/${event.id}`}>
                          <Button size="sm" className="w-full bg-[#a3e635] text-black hover:bg-[#84cc16]">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

