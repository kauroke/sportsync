"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, Marker } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import { useGoogleMaps } from "@/contexts/google-maps-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Map container styles
const containerStyle = {
  width: "100%",
  height: "300px",
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

interface GoogleLocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLocation?: { lat: number; lng: number }
}

export default function GoogleLocationPicker({
  onLocationSelect,
  initialLocation = defaultCenter,
}: GoogleLocationPickerProps) {
  const { isLoaded, loadError, placesError, setPlacesError } = useGoogleMaps()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [markerPosition, setMarkerPosition] = useState(initialLocation)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const geocoder = useRef<google.maps.Geocoder | null>(null)
  const [manualAddress, setManualAddress] = useState("")

  // Initialize services after map loads
  useEffect(() => {
    if (isLoaded && map && window.google) {
      try {
        // Try to initialize Places API services
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        placesService.current = new window.google.maps.places.PlacesService(map)
        geocoder.current = new window.google.maps.Geocoder()
      } catch (error) {
        console.error("Error initializing Places API:", error)
        setPlacesError(true)
      }
    }
  }, [isLoaded, map, setPlacesError])

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  // Handle map unmount
  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Handle marker load
  const onMarkerLoad = useCallback((marker: google.maps.Marker) => {
    setMarker(marker)
  }, [])

  // Handle map click to place marker
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setMarkerPosition({ lat, lng })

        // If geocoder is available, use it to get the address
        if (geocoder.current) {
          try {
            geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                const address = results[0].formatted_address
                onLocationSelect(lat, lng, address)
                setSearchQuery(address)
              } else {
                onLocationSelect(lat, lng, `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
              }
            })
          } catch (error) {
            console.error("Geocoding error:", error)
            onLocationSelect(lat, lng, `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          }
        } else {
          // Fallback if geocoder is not available
          onLocationSelect(lat, lng, `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }
      }
    },
    [onLocationSelect],
  )

  // Handle search input change with debounce
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.length > 2 && autocompleteService.current) {
      try {
        // Bias towards tennis courts
        const request = {
          input: value + " tennis court",
          types: ["establishment"],
        }

        autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            // Get details for each prediction to display on the map
            const detailedResults: google.maps.places.PlaceResult[] = []

            predictions.forEach((prediction) => {
              if (placesService.current && prediction.place_id) {
                placesService.current.getDetails(
                  { placeId: prediction.place_id, fields: ["name", "formatted_address", "geometry"] },
                  (place, detailStatus) => {
                    if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place) {
                      detailedResults.push(place)
                      setSearchResults([...detailedResults])
                    }
                  },
                )
              }
            })

            setShowResults(true)
          } else {
            setSearchResults([])
            setShowResults(false)
          }
        })
      } catch (error) {
        console.error("Places API error:", error)
        setPlacesError(true)
      }
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, 500)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (!placesError) {
      debouncedSearch(value)
    }
  }

  // Handle search result selection
  const handleResultSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location && map) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      setMarkerPosition({ lat, lng })
      map.panTo({ lat, lng })
      map.setZoom(16)

      const address = place.formatted_address || place.name || `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      onLocationSelect(lat, lng, address)

      setSearchQuery(address)
      setShowResults(false)
    }
  }

  // Handle manual address input for fallback
  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualAddress(e.target.value)
  }

  // Set manual location
  const setManualLocation = () => {
    if (manualAddress.trim() && map) {
      onLocationSelect(markerPosition.lat, markerPosition.lng, manualAddress)
      setSearchQuery(manualAddress)
    }
  }

  if (loadError) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">Error loading Google Maps</p>
          <p className="text-gray-600 text-sm mt-2">Please check your API key and try again</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {placesError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Places API Error</AlertTitle>
          <AlertDescription>
            The Google Places API is not enabled for your API key. You can still select a location on the map, but
            search functionality is limited.
            <a
              href="https://developers.google.com/maps/documentation/javascript/places#enable-api"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 underline"
            >
              Learn how to enable the Places API
            </a>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placesError ? "Enter location name manually" : "Search for tennis courts or addresses"}
          className="pl-10"
          value={placesError ? manualAddress : searchQuery}
          onChange={placesError ? handleManualAddressChange : handleSearchChange}
          onFocus={() => !placesError && searchResults.length > 0 && setShowResults(true)}
        />

        {/* Search results dropdown */}
        {!placesError && showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((place, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleResultSelect(place)}
              >
                <p className="font-medium text-sm">{place.name}</p>
                <p className="text-xs text-gray-600">{place.formatted_address}</p>
              </div>
            ))}
          </div>
        )}

        {/* Manual address submit button (only shown when Places API has an error) */}
        {placesError && (
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#a3e635] text-black hover:bg-[#84cc16]"
            onClick={setManualLocation}
          >
            Set
          </Button>
        )}
      </div>

      <div className="border rounded-md overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialLocation}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
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
          <Marker
            position={markerPosition}
            icon={tennisIcon}
            draggable={true}
            onLoad={onMarkerLoad}
            onDragEnd={(e) => {
              if (e.latLng) {
                const lat = e.latLng.lat()
                const lng = e.latLng.lng()

                // Reverse geocode to get address if geocoder is available
                if (geocoder.current && !placesError) {
                  try {
                    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
                      if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                        const address = results[0].formatted_address
                        onLocationSelect(lat, lng, address)
                        setSearchQuery(address)
                      } else {
                        onLocationSelect(lat, lng, `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
                      }
                    })
                  } catch (error) {
                    console.error("Geocoding error:", error)
                    onLocationSelect(lat, lng, `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
                    setPlacesError(true)
                  }
                } else {
                  // If in manual mode, keep the manual address but update coordinates
                  const address =
                    placesError && manualAddress ? manualAddress : `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
                  onLocationSelect(lat, lng, address)
                }
              }
            }}
          />

          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-md shadow-md text-xs text-center">
            {placesError
              ? "Click or drag the marker on the map to set your event location"
              : "Click on the map or search for a location to set your event location"}
          </div>
        </GoogleMap>
      </div>
    </div>
  )
}

