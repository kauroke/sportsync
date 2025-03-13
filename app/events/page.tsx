"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Users, MapPin, Clock, List, Map, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateEventButton } from "@/components/create-event-button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { TimeRangePicker } from "@/components/time-range-picker"
import { cn } from "@/lib/utils"
import { format, isAfter, isBefore, isEqual, startOfDay, endOfDay } from "date-fns"
import { getEvents, type Event } from "@/lib/events"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { LocationSearch } from "@/components/location-search"

// Import map component dynamically to avoid SSR issues with Google Maps
const GoogleMapComponent = dynamic(() => import("@/components/google-map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-12rem)] bg-gray-100 animate-pulse flex items-center justify-center rounded-md">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

// Define filter types
type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

type TimeRange = {
  start: string
  end: string
}

type Filters = {
  location: string
  skillLevel: string
  eventType: string
  dateRange: DateRange
  timeRange: TimeRange
}

export default function EventsPage() {
  // State for events and loading
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [viewportWidth, setViewportWidth] = useState<number>(0)

  // State for filters
  const [filters, setFilters] = useState<Filters>({
    location: "",
    skillLevel: "all",
    eventType: "all",
    dateRange: { from: undefined, to: undefined },
    timeRange: { start: "", end: "" },
  })

  // State for active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // State for view mode
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  // Update the useEffect to check for view parameter in URL

  // Add this near the top of the component, after the state declarations
  useEffect(() => {
    // Check URL for view parameter
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get("view")
    if (viewParam === "map") {
      setViewMode("map")
    }
  }, [])

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        const allEvents = await getEvents()
        setEvents(allEvents)
        setFilteredEvents(allEvents)
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Handle viewport width for responsive design
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

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.location) count++
    if (filters.skillLevel !== "all") count++
    if (filters.eventType !== "all") count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.timeRange.start || filters.timeRange.end) count++
    setActiveFiltersCount(count)
  }, [filters])

  // Apply filters to events
  useEffect(() => {
    if (events.length === 0) return

    const filtered = events.filter((event) => {
      // Filter by location
      if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Filter by skill level
      if (filters.skillLevel !== "all" && event.skillLevel !== filters.skillLevel) {
        return false
      }

      // Filter by event type
      if (filters.eventType !== "all" && event.type !== filters.eventType) {
        return false
      }

      // Filter by date range
      if (filters.dateRange.from || filters.dateRange.to) {
        const eventDate = event.date

        if (filters.dateRange.from && isBefore(eventDate, startOfDay(filters.dateRange.from))) {
          return false
        }

        if (filters.dateRange.to && isAfter(eventDate, endOfDay(filters.dateRange.to))) {
          return false
        }
      }

      // Filter by time range
      if (filters.timeRange.start || filters.timeRange.end) {
        if (filters.timeRange.start && event.startTime < filters.timeRange.start) {
          return false
        }

        if (filters.timeRange.end && event.endTime > filters.timeRange.end) {
          return false
        }
      }

      return true
    })

    setFilteredEvents(filtered)
  }, [events, filters])

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: "",
      skillLevel: "all",
      eventType: "all",
      dateRange: { from: undefined, to: undefined },
      timeRange: { start: "", end: "" },
    })
  }

  // Determine if mobile view
  const isMobile = viewportWidth < 768

  // Format date range for display
  const formatDateRange = () => {
    if (!filters.dateRange.from && !filters.dateRange.to) return "Any Date"

    if (filters.dateRange.from && filters.dateRange.to) {
      if (isEqual(filters.dateRange.from, filters.dateRange.to)) {
        return format(filters.dateRange.from, "MMM d, yyyy")
      }
      return `${format(filters.dateRange.from, "MMM d")} - ${format(filters.dateRange.to, "MMM d, yyyy")}`
    }

    if (filters.dateRange.from) return `From ${format(filters.dateRange.from, "MMM d, yyyy")}`
    if (filters.dateRange.to) return `Until ${format(filters.dateRange.to, "MMM d, yyyy")}`

    return "Any Date"
  }

  // Format time range for display
  const formatTimeRange = () => {
    if (!filters.timeRange.start && !filters.timeRange.end) return "Any Time"

    if (filters.timeRange.start && filters.timeRange.end) {
      return `${filters.timeRange.start} - ${filters.timeRange.end}`
    }

    if (filters.timeRange.start) return `From ${filters.timeRange.start}`
    if (filters.timeRange.end) return `Until ${filters.timeRange.end}`

    return "Any Time"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tennis Events</h1>
            <p className="text-gray-600">Find and join tennis events in your area</p>
          </div>
          <div className="flex gap-2">
            <CreateEventButton />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <Tabs
            defaultValue="list"
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "list" | "map")}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>List View</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 bg-[#a3e635] text-black">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {/* Location Search */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Location</label>
                      <LocationSearch
                        value={filters.location}
                        onChange={(value) => handleFilterChange("location", value)}
                      />
                    </div>

                    {/* Skill Level */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Skill Level</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filters.skillLevel}
                        onChange={(e) => handleFilterChange("skillLevel", e.target.value)}
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Event Type */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Event Type</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filters.eventType}
                        onChange={(e) => handleFilterChange("eventType", e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="casual">Casual Hitting</option>
                        <option value="practice">Practice Match</option>
                        <option value="doubles">Doubles Play</option>
                        <option value="lesson">Group Lesson</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date Range</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateRange.from && !filters.dateRange.to && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formatDateRange()}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={filters.dateRange}
                            onSelect={(range) => handleFilterChange("dateRange", range)}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time Range */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Time Range</label>
                      <TimeRangePicker
                        startTime={filters.timeRange.start}
                        endTime={filters.timeRange.end}
                        onStartTimeChange={(time) =>
                          handleFilterChange("timeRange", { ...filters.timeRange, start: time })
                        }
                        onEndTimeChange={(time) => handleFilterChange("timeRange", { ...filters.timeRange, end: time })}
                      />
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:block bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-sm">
                Reset all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Location Search */}
            <LocationSearch value={filters.location} onChange={(value) => handleFilterChange("location", value)} />

            {/* Skill Level */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filters.skillLevel}
              onChange={(e) => handleFilterChange("skillLevel", e.target.value)}
            >
              <option value="all">All Skill Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Event Type */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filters.eventType}
              onChange={(e) => handleFilterChange("eventType", e.target.value)}
            >
              <option value="all">All Event Types</option>
              <option value="casual">Casual Hitting</option>
              <option value="practice">Practice Match</option>
              <option value="doubles">Doubles Play</option>
              <option value="lesson">Group Lesson</option>
            </select>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange.from && !filters.dateRange.to && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={(range) => handleFilterChange("dateRange", range)}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Time Range */}
            <TimeRangePicker
              startTime={filters.timeRange.start}
              endTime={filters.timeRange.end}
              onStartTimeChange={(time) => handleFilterChange("timeRange", { ...filters.timeRange, start: time })}
              onEndTimeChange={(time) => handleFilterChange("timeRange", { ...filters.timeRange, end: time })}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading events...</span>
          </div>
        ) : (
          <>
            {/* No Results */}
            {filteredEvents.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}

            {/* Results Count */}
            {filteredEvents.length > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                Found {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && filteredEvents.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-xl">
                            🎾
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-500 capitalize">{event.skillLevel} Level</p>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
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
                            <span>
                              {event.participants ? event.participants.length : 1}/{(event.playersNeeded || 0) + 1}{" "}
                              players joined
                            </span>
                          </div>
                        </div>
                        <Button className="w-full bg-[#a3e635] text-black hover:bg-[#84cc16]">View Details</Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Map View */}
            {viewMode === "map" && filteredEvents.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Map takes 2/3 of the space on desktop, full width on mobile */}
                <div className={`${isMobile ? "order-2" : "md:col-span-2"}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm h-[calc(100vh-12rem)]">
                    <GoogleMapComponent
                      events={filteredEvents.map((event) => ({
                        id: event.id,
                        title: event.title,
                        type: event.type,
                        skillLevel: event.skillLevel,
                        date: format(event.date, "EEEE, MMMM d, yyyy"),
                        time: `${event.startTime} - ${event.endTime}`,
                        location: event.location,
                        players: `${event.participants ? event.participants.length : 1}/${(event.playersNeeded || 0) + 1}`,
                        coordinates: event.coordinates,
                      }))}
                      selectedEvent={selectedEvent}
                      setSelectedEvent={setSelectedEvent}
                    />
                  </div>
                </div>

                {/* Event list takes 1/3 of the space on desktop, full width on mobile */}
                <div className={`${isMobile ? "order-1" : ""}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm p-4">
                    <h2 className="text-lg font-semibold mb-4">Events</h2>
                    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                      {filteredEvents.map((event) => (
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
                                <p className="text-xs text-gray-500 capitalize">{event.skillLevel} Level</p>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{format(event.date, "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-3 h-3" />
                                <span>
                                  {event.participants ? event.participants.length : 1}/{(event.playersNeeded || 0) + 1}{" "}
                                  players
                                </span>
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
            )}
          </>
        )}
      </div>
    </div>
  )
}

