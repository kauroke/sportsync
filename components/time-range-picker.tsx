"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeRangePickerProps {
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
}

export function TimeRangePicker({ startTime, endTime, onStartTimeChange, onEndTimeChange }: TimeRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const hourFormatted = hour.toString().padStart(2, "0")
        const minuteFormatted = minute.toString().padStart(2, "0")
        const time = `${hourFormatted}:${minuteFormatted}`
        const displayTime = formatTimeForDisplay(time)
        options.push({ value: time, label: displayTime })
      }
    }
    return options
  }

  // Format time for display (12-hour format)
  const formatTimeForDisplay = (time: string) => {
    if (!time) return ""

    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Format time range for button display
  const formatTimeRange = () => {
    if (!startTime && !endTime) return "Any Time"

    if (startTime && endTime) {
      return `${formatTimeForDisplay(startTime)} - ${formatTimeForDisplay(endTime)}`
    }

    if (startTime) return `From ${formatTimeForDisplay(startTime)}`
    if (endTime) return `Until ${formatTimeForDisplay(endTime)}`

    return "Any Time"
  }

  // Handle time selection
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = e.target.value
    onStartTimeChange(newStartTime)

    // If end time is earlier than start time, update end time
    if (endTime && newStartTime > endTime) {
      onEndTimeChange(newStartTime)
    }
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndTime = e.target.value
    onEndTimeChange(newEndTime)

    // If start time is later than end time, update start time
    if (startTime && newEndTime < startTime) {
      onStartTimeChange(newEndTime)
    }
  }

  // Clear time range
  const clearTimeRange = () => {
    onStartTimeChange("")
    onEndTimeChange("")
    setIsOpen(false)
  }

  // Apply time range
  const applyTimeRange = () => {
    setIsOpen(false)
  }

  const timeOptions = generateTimeOptions()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startTime && !endTime && "text-muted-foreground",
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatTimeRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Time</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={startTime}
              onChange={handleStartTimeChange}
            >
              <option value="">Any Time</option>
              {timeOptions.map((option) => (
                <option key={`start-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">End Time</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={endTime}
              onChange={handleEndTimeChange}
            >
              <option value="">Any Time</option>
              {timeOptions.map((option) => (
                <option key={`end-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={clearTimeRange}>
              Clear
            </Button>
            <Button size="sm" onClick={applyTimeRange} className="bg-[#a3e635] text-black hover:bg-[#84cc16]">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

