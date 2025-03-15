"use client"

// Add these imports at the top of the file
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Clock, Map, Trophy, ArrowRight, ChevronRight } from "lucide-react"
import { CreateEventButton } from "@/components/create-event-button"
import { Logo } from "@/components/logo"

// Add this style block right after the imports
const animationStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes pulse-subtle {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }
  
  @keyframes slide-in {
    0% { transform: translateX(-10px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes player-move-left {
    0%, 100% { transform: translate(0, -50%); }
    45%, 55% { transform: translate(-15px, -50%); }
  }
  
  @keyframes player-move-right {
    0%, 100% { transform: translate(0, -50%); }
    45%, 55% { transform: translate(15px, -50%); }
  }
  
  @keyframes ball-move {
  0%, 100% { 
    transform: translate(calc(-50% + 100px), -50%); 
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% { 
    transform: translate(calc(-50% - 100px), -50%); 
    animation-timing-function: cubic-bezier(0.8, 0, 0.2, 1);
  }
}
  
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 4s ease-in-out infinite;
  }
  
  .animate-slide-in {
    animation: slide-in 0.6s ease-out forwards;
  }
  
  .animate-player-left {
    animation: player-move-left 2s ease-in-out infinite;
  }
  
  .animate-player-right {
    animation: player-move-right 2s ease-in-out infinite;
  }
  
  .animate-ball {
    animation: ball-move 4s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>
        {animationStyles}
      </style>
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0f172a] text-white overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Simple gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0f172a] opacity-90"></div>

          {/* Minimal pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-5"></div>

          {/* Elegant accent lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#a3e635]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#a3e635]/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8 text-center md:text-left z-10">
              <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                  Connect with Tennis{" "}
                  <span className="text-[#a3e635] block md:inline relative">
                    Partners Nearby
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#a3e635]/50 hidden md:block"></span>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0 mt-6">
                  Join our community of tennis enthusiasts to find partners, organize matches, and improve your game.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <CreateEventButton
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl shadow-lg shadow-[#a3e635]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#a3e635]/30 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#a3e635]/0 via-[#a3e635]/30 to-[#a3e635]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Create Event</span>
                </CreateEventButton>

                <Link href="/events">
                  <Button
                    size="lg"
                    className="bg-white text-[#1e293b] hover:bg-gray-100 text-base px-8 py-6 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100/0 via-gray-100/50 to-gray-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative flex items-center">
                      Find Events <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tennis court animation - hidden on mobile */}
            <div className="hidden md:flex flex-1 justify-center relative z-10">
              {/* Tennis court animation with simplified design */}
              <div className="relative w-full max-w-md aspect-[2.1/1]">
                {/* Court base */}
                <div className="absolute inset-0 rounded-lg bg-[#1a5e3b] shadow-xl overflow-hidden">
                  {/* Court outer boundary - only the outline */}
                  <div className="absolute inset-3 border-2 border-white/70"></div>

                  {/* Net */}
                  <div className="absolute left-1/2 top-3 bottom-3 w-0.5 bg-white/90 z-20">
                    <div className="absolute inset-0 border-dashed border-x border-white/50"></div>
                  </div>

                  {/* Court texture */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMWE1ZTNiIi8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMC41IiBmaWxsPSIjMTg1NDM1Ii8+PC9zdmc+')] opacity-50"></div>
                </div>

                {/* Players represented as abstract shapes with horizontal movement */}
                <div
                  className="absolute top-1/2 left-[8%] w-12 h-12 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] opacity-80 shadow-lg animate-player-left transform -translate-y-1/2"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute top-1/2 right-[8%] w-12 h-12 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] opacity-80 shadow-lg animate-player-right transform -translate-y-1/2"
                  style={{ animationDelay: "0s" }}
                ></div>

                {/* Tennis ball that bounces between players */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-[#FFFF00] shadow-md z-20 animate-ball">
                  {/* Ball texture */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRkZGRjAwIi8+PHBhdGggZD0iTTAgMCBDIDIwIDAgMjAgMjAgMCAyMCIgc3Ryb2tlPSIjZmZmZmZmMjAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 md:h-24"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a3e635]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <span className="inline-block px-3 py-1 rounded-full bg-[#a3e635]/10 text-[#65a30d] text-sm font-medium mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Simple Steps to Find Your <span className="text-[#65a30d]">Tennis Partner</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Find tennis partners, join matches, and improve your game with our easy-to-use platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-[#65a30d]" />,
                title: "Create or Join Events",
                description:
                  "Schedule a tennis session or join existing events. Specify your skill level, location, and preferences.",
              },
              {
                icon: <Map className="w-8 h-8 text-[#65a30d]" />,
                title: "Find Nearby Players",
                description:
                  "Discover tennis enthusiasts in your area with our interactive map and matching algorithm.",
              },
              {
                icon: <Trophy className="w-8 h-8 text-[#65a30d]" />,
                title: "Play & Improve",
                description:
                  "Meet at the court, play your match, and track your progress while making new tennis friends.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all hover:border-[#a3e635]/50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#a3e635]/0 to-[#a3e635]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 relative">
                  {feature.icon}
                  <div className="absolute inset-0 rounded-2xl border border-[#a3e635]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#65a30d] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center text-[#65a30d] font-medium">
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background tennis ball pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2NWEzMGQiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,500+", label: "Matches Played" },
              { value: "1,200+", label: "Active Players" },
              { value: "50+", label: "Tennis Courts" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl font-bold text-[#65a30d] mb-2">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#a3e635]/5 rounded-full"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#a3e635]/5 rounded-full"></div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#a3e635]/10 text-[#65a30d] text-sm font-medium mb-4">
                UPCOMING EVENTS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Join a Tennis Event</h2>
              <p className="text-gray-600 max-w-xl">Find and join tennis events happening in your area</p>
            </div>
            <Link href="/events" className="mt-4 md:mt-0">
              <Button variant="outline" className="border-[#a3e635] text-[#65a30d] hover:bg-[#a3e635]/10">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Weekend Doubles Tournament",
                level: "Intermediate",
                date: "Saturday, June 15, 2024",
                time: "9:00 AM - 1:00 PM",
                location: "Sydney Olympic Park Tennis Centre",
                players: "6/8",
              },
              {
                title: "Morning Singles Practice",
                level: "Advanced",
                date: "Sunday, June 16, 2024",
                time: "7:00 AM - 9:00 AM",
                location: "Rushcutters Bay Tennis",
                players: "1/2",
              },
              {
                title: "Beginner's Tennis Clinic",
                level: "Beginner",
                date: "Monday, June 17, 2024",
                time: "6:00 PM - 8:00 PM",
                location: "Centennial Park Tennis",
                players: "4/6",
              },
            ].map((event, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:border-[#a3e635]/50 group"
              >
                <div className="h-48 bg-gradient-to-r from-[#a3e635]/20 to-[#84cc16]/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a3e635]/0 via-[#a3e635]/30 to-[#a3e635]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform relative z-10">
                    🎾
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-xl group-hover:text-[#65a30d] transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="inline-block px-3 py-1 bg-[#a3e635]/10 text-[#65a30d] text-xs font-medium rounded-full">
                          {event.level} Level
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-5 h-5 text-[#65a30d]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-5 h-5 text-[#65a30d]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-5 h-5 text-[#65a30d]" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Users className="w-5 h-5 text-[#65a30d]" />
                      <span>{event.players} players joined</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#a3e635] text-black hover:bg-[#84cc16] group-hover:shadow-md transition-all text-base py-6">
                    Join Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0f172a] text-white relative overflow-hidden">
        {/* Background elements - simplified */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-5"></div>

          {/* Simple accent line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#a3e635]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#a3e635]/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your next tennis match?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join our community of tennis enthusiasts and never play alone again.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <CreateEventButton
                size="lg"
                className="text-base px-8 py-6 rounded-xl shadow-lg shadow-[#a3e635]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#a3e635]/30 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#a3e635]/0 via-[#a3e635]/30 to-[#a3e635]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative">Create Your First Event</span>
              </CreateEventButton>

              <Link href="/events?view=map">
                <Button
                  size="lg"
                  className="bg-white text-[#1e293b] hover:bg-gray-100 text-base px-8 py-6 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100/0 via-gray-100/50 to-gray-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative flex items-center">
                    Explore Map <Map className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="md:w-1/3">
              <div className="flex items-center gap-3 mb-6">
                <Logo size="lg" darkMode={true} />
              </div>
              <p className="mb-6 text-gray-400 text-lg">
                Connect with tennis players in your area for casual matches, practice sessions, and more.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a3e635] hover:text-black transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a3e635] hover:text-black transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21.543 7.031a1 1 0 00-1.086-.353L2.926 7.312a1 1 0 00-.924.924l2.108 8.738a1 1 0 00.924.924h7.057a1 1 0 00.924-.924l2.108-8.738a1 1 0 00-.924-.924H5.035l-.833 3.458 11.757-2.822-.833 3.458 5.841-1.401z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Find Events
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tennis Courts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="mb-6">Stay up to date with the latest tennis events and news.</p>
              <form>
                <div className="flex flex-col">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="bg-gray-800 border border-gray-700 rounded-md py-3 px-4 mb-4 focus:outline-none focus:border-[#a3e635] text-white"
                  />
                  <Button className="bg-[#a3e635] text-black hover:bg-[#84cc16]">Subscribe</Button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 Tennis Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

