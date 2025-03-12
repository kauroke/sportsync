"use client"

import { useState, useCallback, useEffect } from "react"
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGoogleMaps } from "@/contexts/google-maps-context"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Map container styles
const containerStyle = {
  width: "100%",
  height: "100%",
}

// Default center (Sydney, Australia)
const defaultCenter = {
  lat: -33.8688,
  lng: 151.2093,
}

// Tennis court icon
const tennisIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  scaledSize: { width: 40, height: 40, equals: () => false },
}

// Selected tennis court icon
const selectedTennisIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  scaledSize: { width: 45, height: 45, equals: () => false },
}

interface GoogleMapComponentProps {
  events: any[]
  selectedEvent: number | null
  setSelectedEvent: (id: number | null) => void
}

export default function GoogleMapComponent({ events, selectedEvent, setSelectedEvent }: GoogleMapComponentProps) {
  const { isLoaded, loadError, placesError } = useGoogleMaps()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [infoWindowEvent, setInfoWindowEvent] = useState<any | null>(null)
  const [google, setGoogle] = useState<typeof window.google | null>(null)

  useEffect(() => {
    if (isLoaded) {
      setGoogle(window.google)
    }
  }, [isLoaded])

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  // Handle map unmount
  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Fit map bounds to show all events
  useEffect(() => {
    if (map && events.length > 0 && !selectedEvent && google) {
      const bounds = new google.maps.LatLngBounds()

      events.forEach((event) => {
        bounds.extend(new google.maps.LatLng(event.coordinates.lat, event.coordinates.lng))
      })

      map.fitBounds(bounds)

      // Add some padding
      const listener = google.maps.event.addListenerOnce(map, "bounds_changed", () => {
        map.setZoom(map.getZoom() - 0.5)
      })

      return () => {
        google.maps.event.removeListener(listener)
      }
    }
  }, [map, events, selectedEvent, google])

  // Center map on selected event
  useEffect(() => {
    if (map && selectedEvent && google) {
      const event = events.find((e) => e.id === selectedEvent)
      if (event) {
        map.panTo({
          lat: event.coordinates.lat,
          lng: event.coordinates.lng,
        })
        map.setZoom(15)

        // Open info window for selected event
        setInfoWindowEvent(event)
      }
    }
  }, [map, selectedEvent, events, google])

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">Error loading Google Maps</p>
          <p className="text-gray-600 text-sm mt-2">Please check your API key and try again</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {placesError && (
        <Alert variant="warning" className="mb-2 mx-2 mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limited Functionality</AlertTitle>
          <AlertDescription>
            The Google Places API is not enabled for your API key. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-grow">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
              {
                featureType: "poi.sports_complex",
                elementType: "geometry",
                stylers: [{ visibility: "on" }, { color: "#c5e8a3" }],
              },
              {
                featureType: "poi.sports_complex",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
              },
            ],
          }}
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              position={{
                lat: event.coordinates.lat,
                lng: event.coordinates.lng,
              }}
              icon={selectedEvent === event.id ? selectedTennisIcon : tennisIcon}
              onClick={() => {
                setSelectedEvent(event.id)
                setInfoWindowEvent(event)
              }}
              animation={google?.maps?.Animation.DROP}
            />
          ))}

          {infoWindowEvent && (
            <InfoWindow
              position={{
                lat: infoWindowEvent.coordinates.lat,
                lng: infoWindowEvent.coordinates.lng,
              }}
              onCloseClick={() => setInfoWindowEvent(null)}
            >
              <div className="p-1 max-w-[250px]">
                <h3 className="font-semibold text-base">{infoWindowEvent.title}</h3>
                <p className="text-xs text-gray-600">{infoWindowEvent.skillLevel} Level</p>
                <div className="text-xs space-y-1 my-2">
                  <p>{infoWindowEvent.date}</p>
                  <p>{infoWindowEvent.time}</p>
                  <p>{infoWindowEvent.location}</p>
                  <p>{infoWindowEvent.players} players</p>
                </div>
                <Link href={`/events/${infoWindowEvent.id}`} className="block">
                  <Button size="sm" className="w-full mt-2 text-xs bg-[#a3e635] text-black hover:bg-[#84cc16]">
                    View Details
                  </Button>
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  )
}

