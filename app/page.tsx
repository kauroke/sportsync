import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Clock, Map } from "lucide-react"
import { CreateEventButton } from "@/components/create-event-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-[#1e293b] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Find Tennis Partners <span className="text-[#a3e635]">Anytime</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Create or join casual tennis matches, hitting sessions, and practice games with players in your area.
              </p>
              <div className="flex flex-wrap gap-4">
                <CreateEventButton size="lg">Create Event</CreateEventButton>
                <Link href="/events">
                  <Button size="lg" className="bg-white text-[#1e293b] hover:bg-gray-100">
                    Find Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-full bg-[#a3e635]/20 flex items-center justify-center">
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#a3e635]/50 animate-spin-slow"></div>
                <div className="w-3/4 h-3/4 rounded-full bg-[#a3e635]/30 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full bg-[#a3e635] flex items-center justify-center text-5xl">
                    🎾
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#a3e635]/20 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-[#65a30d]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Event</h3>
              <p className="text-gray-600">
                Schedule a tennis session, specify your skill level, location, and available spots.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#a3e635]/20 flex items-center justify-center mb-4">
                <Map className="w-8 h-8 text-[#65a30d]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Events Nearby</h3>
              <p className="text-gray-600">
                Browse events on a map or get matched with players of similar skill levels in your area.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#a3e635]/20 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#65a30d]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Play Tennis</h3>
              <p className="text-gray-600">
                Meet at the court, play your match, and improve your game while making new friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-xl">
                      🎾
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Casual Hitting Session</h3>
                      <p className="text-sm text-gray-500">Intermediate Level</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Saturday, June 15, 2024</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>9:00 AM - 11:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Central Park Tennis Courts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>2/4 players joined</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#a3e635] text-black hover:bg-[#84cc16]">Join Event</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1e293b] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your next tennis match?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of tennis enthusiasts and never play alone again.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CreateEventButton size="lg">Sign Up Now</CreateEventButton>
            <Link href="/events?view=map">
              <Button size="lg" className="bg-white text-[#1e293b] hover:bg-gray-100">
                Explore Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#a3e635] flex items-center justify-center text-black text-lg font-bold">
                  T
                </div>
                <span className="text-white text-xl font-bold">TennisMatch</span>
              </div>
              <p className="mb-4">
                Connect with tennis players in your area for casual matches, practice sessions, and more.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="hover:text-white">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-white">
                      Find Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/map" className="hover:text-white">
                      Map View
                    </Link>
                  </li>
                  <li>
                    <Link href="/events/create" className="hover:text-white">
                      Create Event
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} TennisMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

