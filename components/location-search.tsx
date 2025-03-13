"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useGoogleMaps } from "@/contexts/google-maps-context"

interface LocationSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function LocationSearch({
  value,
  onChange,
  placeholder = "Search by location",
  className = "",
}: LocationSearchProps) {
  const { isLoaded, placesError } = useGoogleMaps()
  const [inputValue, setInputValue] = useState(value)
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize autocomplete service
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined" && window.google && !placesError) {
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
      } catch (error) {
        console.error("Error initializing Places API:", error)
      }
    }
  }, [isLoaded, placesError])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length > 2 && autocompleteService.current && !placesError) {
      try {
        // Search for locations with a bias towards tennis courts
        autocompleteService.current.getPlacePredictions(
          {
            input: value,
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "au" }, // Restrict to Australia
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setPredictions(predictions)
              setShowPredictions(true)
            } else {
              setPredictions([])
              setShowPredictions(false)
            }
          },
        )
      } catch (error) {
        console.error("Places API error:", error)
      }
    } else {
      setPredictions([])
      setShowPredictions(false)
    }
  }

  // Handle prediction selection
  const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(prediction.description)
    onChange(prediction.description)
    setPredictions([])
    setShowPredictions(false)
  }

  // Clear input
  const clearInput = () => {
    setInputValue("")
    onChange("")
    setPredictions([])
    setShowPredictions(false)
  }

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPredictions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // If Google Maps is not loaded or has an error, fall back to regular input
  if (!isLoaded || placesError) {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => predictions.length > 0 && setShowPredictions(true)}
      />
      {inputValue && (
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={clearInput}
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Predictions dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <p className="text-sm">{prediction.description}</p>
              <p className="text-xs text-gray-500">{prediction.structured_formatting?.secondary_text || ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

