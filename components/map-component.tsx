"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Fix Leaflet marker icon issues
const fixLeafletIcon = () => {
  // Fix the default icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Custom marker icon for tennis events
const createTennisIcon = (selected: boolean) => {
  return new L.Icon({
    iconUrl: selected
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

// Component to handle map view updates
function MapUpdater({
  events,
  selectedEvent,
}: {
  events: any[]
  selectedEvent: number | null
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedEvent) {
      const event = events.find((e) => e.id === selectedEvent)
      if (event) {
        map.flyTo(event.coordinates, 14, {
          animate: true,
          duration: 1,
        })
      }
    } else {
      // If no event is selected, fit the map to show all events
      if (events.length > 0) {
        const bounds = L.latLngBounds(events.map((event) => event.coordinates))
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [selectedEvent, events, map])

  return null
}

// Main map component
export default function MapComponent({
  events,
  selectedEvent,
  setSelectedEvent,
}: {
  events: any[]
  selectedEvent: number | null
  setSelectedEvent: (id: number | null) => void
}) {
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    fixLeafletIcon()
    setMapReady(true)
  }, [])

  if (!mapReady) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  // Default center on NYC
  const defaultCenter: [number, number] = [40.7831, -73.9712]

  return (
    <MapContainer center={defaultCenter} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.coordinates}
          icon={createTennisIcon(selectedEvent === event.id)}
          eventHandlers={{
            click: () => {
              setSelectedEvent(event.id)
            },
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-semibold text-base">{event.title}</h3>
              <p className="text-xs text-gray-600">{event.skillLevel} Level</p>
              <div className="text-xs space-y-1 my-2">
                <p>{event.date}</p>
                <p>{event.time}</p>
                <p>{event.location}</p>
                <p>{event.players} players</p>
              </div>
              <Link href={`/events/${event.id}`}>
                <Button size="sm" className="w-full mt-2 text-xs bg-[#a3e635] text-black hover:bg-[#84cc16]">
                  View Details
                </Button>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapUpdater events={events} selectedEvent={selectedEvent} />
    </MapContainer>
  )
}

