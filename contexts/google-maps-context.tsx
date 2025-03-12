"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the libraries we need to load
// Important: This must be declared outside the component to maintain referential equality
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"]

// Create a singleton loader to prevent multiple initializations
let loaderInitialized = false
let globalIsLoaded = false
let globalLoadError: Error | undefined = undefined

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: Error | undefined
  placesError: boolean
  setPlacesError: (error: boolean) => void
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
  placesError: false,
  setPlacesError: () => {},
})

export const useGoogleMaps = () => useContext(GoogleMapsContext)

interface GoogleMapsProviderProps {
  children: ReactNode
  apiKey: string
}

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [placesError, setPlacesError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded)
  const [loadError, setLoadError] = useState<Error | undefined>(globalLoadError)

  // Only initialize the loader if it hasn't been initialized yet
  useEffect(() => {
    if (!loaderInitialized && apiKey) {
      loaderInitialized = true

      // Load the Google Maps script manually
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true

      // Define the callback function
      window.initMap = () => {
        globalIsLoaded = true
        setIsLoaded(true)
      }

      // Handle errors
      script.onerror = (error) => {
        globalLoadError = new Error("Failed to load Google Maps API")
        setLoadError(globalLoadError)
      }

      document.head.appendChild(script)
    } else if (globalIsLoaded) {
      // If already loaded, update state
      setIsLoaded(true)
    } else if (globalLoadError) {
      // If already errored, update state
      setLoadError(globalLoadError)
    }
  }, [apiKey])

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, placesError, setPlacesError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

