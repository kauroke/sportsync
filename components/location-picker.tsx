"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

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
const createTennisIcon = () => {
  return new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

// Component to handle map clicks and marker placement
function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null)

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)

      // Reverse geocode to get address
      reverseGeocode(e.latlng.lat, e.latlng.lng)
        .then((address) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng, address)
        })
        .catch((err) => {
          console.error("Error getting address:", err)
          onLocationSelect(
            e.latlng.lat,
            e.latlng.lng,
            `Location at ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`,
          )
        })
    },
  })

  // Simple reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // In a real app, you would use a geocoding service like Google Maps, Mapbox, or OpenStreetMap
      // For this example, we'll return a placeholder address
      return `Tennis Court at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      console.error("Geocoding error:", error)
      return `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  return position === null ? null : <Marker position={position} icon={createTennisIcon()} />
}

// Main location picker component
export default function LocationPicker({
  onLocationSelect,
  initialLocation = { lat: 40.7831, lng: -73.9712 },
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLocation?: { lat: number; lng: number }
}) {
  const [mapReady, setMapReady] = useState(false)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    fixLeafletIcon()
    setMapReady(true)
  }, [])

  if (!mapReady) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <MapContainer
        center={[initialLocation.lat, initialLocation.lng]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker onLocationSelect={onLocationSelect} />

        {/* Instructions overlay */}
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control leaflet-bar bg-white p-2 m-2 text-xs shadow-md rounded-md">
            Click on the map to set your event location
          </div>
        </div>
      </MapContainer>
    </div>
  )
}

