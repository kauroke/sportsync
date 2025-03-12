import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, MapPin, Clock, Search, Plus } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tennis Events</h1>
            <p className="text-gray-600">Find and join tennis events in your area</p>
          </div>
          <Link href="/events/create">
            <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
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
                <SelectItem value="lesson">Group Lesson</SelectItem>
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

        {/* Events List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Link href={`/events/${i + 1}`} key={i}>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-xl">
                      🎾
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {["Casual Hitting Session", "Practice Match", "Doubles Play"][i % 3]}
                      </h3>
                      <p className="text-sm text-gray-500">{["Beginner", "Intermediate", "Advanced"][i % 3]} Level</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(Date.now() + i * 86400000).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"][i % 3]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {["Central Park Tennis Courts", "Riverside Tennis Club", "Memorial Park Courts"][i % 3]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{(i % 4) + 1}/4 players joined</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#a3e635] text-black hover:bg-[#84cc16]">View Details</Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-[#a3e635] text-black border-[#a3e635]">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

