"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, Info, Check, Loader2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { getEvent, updateEvent, eventSchema } from "@/lib/events"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

// Import location picker map component dynamically to avoid SSR issues
const GoogleLocationPicker = dynamic(() => import("@/components/google-location-picker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 animate-pulse flex items-center justify-center rounded-md">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

// Form schema validation (reuse the event schema but make id optional for editing)
const eventFormSchema = eventSchema.omit({ id: true, createdBy: true })

type EventFormValues = z.infer<typeof eventFormSchema>

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const eventId = Number.parseInt(params.id)
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)

  // Initialize form with empty values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      type: "casual",
      skillLevel: "intermediate",
      playersNeeded: 2,
      equipment: {
        balls: true,
        rackets: false,
        water: false,
      },
      isPrivate: false,
      cost: 0,
      coordinates: {
        lat: -33.8688,
        lng: 151.2093,
      },
    },
  })

  const { watch, setValue, reset, formState } = form
  const eventType = watch("type")
  const selectedDate = watch("date")
  const coordinates = watch("coordinates")

  // Fetch event data
  useEffect(() => {
    async function loadEvent() {
      try {
        setIsLoading(true)

        // If user is not logged in, redirect to login
        if (!user) {
          router.push("/login")
          return
        }

        const event = await getEvent(eventId)

        if (!event) {
          setError("Event not found")
          return
        }

        // Check if the current user is the creator of this event
        if (event.createdBy && event.createdBy !== user.id) {
          setUnauthorized(true)
          return
        }

        // Reset form with event data
        reset({
          title: event.title,
          type: event.type,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          skillLevel: event.skillLevel,
          location: event.location,
          coordinates: event.coordinates,
          playersNeeded: event.playersNeeded,
          description: event.description || "",
          equipment: event.equipment,
          isPrivate: event.isPrivate,
          cost: event.cost,
        })
      } catch (err) {
        console.error("Error loading event:", err)
        setError("Failed to load event data")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId, reset, user, router])

  // Handle location selection from map
  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setValue("coordinates", { lat, lng }, { shouldValidate: true })
    setValue("location", address, { shouldValidate: true })
  }

  // Handle form submission
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true)

    try {
      // Update the event
      await updateEvent(eventId, data)

      setIsSuccess(true)

      // Redirect after success message is shown
      setTimeout(() => {
        router.push(`/events/${eventId}`)
      }, 2000)
    } catch (error) {
      console.error("Error updating event:", error)
      setError("Failed to update event")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Next step handler
  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["title", "type", "date", "startTime", "endTime", "skillLevel"])
      if (isValid) setStep(2)
    } else if (step === 2) {
      const isValid = await form.trigger(["location", "coordinates", "playersNeeded"])
      if (isValid) setStep(3)
    } else if (step === 3) {
      form.handleSubmit(onSubmit)()
    }
  }

  // Previous step handler
  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#a3e635] mx-auto" />
          <p className="mt-4 text-gray-600">Loading event data...</p>
        </div>
      </div>
    )
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Unauthorized</AlertTitle>
              <AlertDescription>
                You don't have permission to edit this event. Only the event creator can make changes.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Link href={`/events/${eventId}`}>
                <Button variant="outline">Back to Event Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Link href="/events">
                <Button variant="outline">Back to Events</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your tennis event has been updated successfully. Redirecting to event details...
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Edit Tennis Event</h1>
          <p className="text-gray-600 mb-8">Update your tennis event details</p>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Update the information below to edit your tennis event</CardDescription>

              {/* Progress Steps */}
              <div className="w-full mt-4">
                <div className="flex justify-between">
                  <div className={`flex flex-col items-center ${step >= 1 ? "text-[#65a30d]" : "text-gray-400"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#a3e635] text-black" : "bg-gray-200"}`}
                    >
                      1
                    </div>
                    <span className="text-xs mt-1">Basics</span>
                  </div>
                  <div className="flex-1 flex items-center mx-2">
                    <div className={`h-1 w-full ${step >= 2 ? "bg-[#a3e635]" : "bg-gray-200"}`}></div>
                  </div>
                  <div className={`flex flex-col items-center ${step >= 2 ? "text-[#65a30d]" : "text-gray-400"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#a3e635] text-black" : "bg-gray-200"}`}
                    >
                      2
                    </div>
                    <span className="text-xs mt-1">Location</span>
                  </div>
                  <div className="flex-1 flex items-center mx-2">
                    <div className={`h-1 w-full ${step >= 3 ? "bg-[#a3e635]" : "bg-gray-200"}`}></div>
                  </div>
                  <div className={`flex flex-col items-center ${step >= 3 ? "text-[#65a30d]" : "text-gray-400"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#a3e635] text-black" : "bg-gray-200"}`}
                    >
                      3
                    </div>
                    <span className="text-xs mt-1">Details</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form className="space-y-6">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">
                        Event Title <span className="text-red-500">*</span>
                      </Label>
                      <Input id="title" placeholder="e.g., Casual Hitting Session" {...form.register("title")} />
                      {form.formState.errors.title && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>
                        Event Type <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={eventType}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2"
                        onValueChange={(value) => setValue("type", value as any, { shouldValidate: true })}
                      >
                        <div
                          className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer ${eventType === "casual" ? "border-[#a3e635] bg-[#a3e635]/10" : "border-gray-200"}`}
                        >
                          <RadioGroupItem value="casual" id="casual" />
                          <Label htmlFor="casual" className="cursor-pointer">
                            Casual Hitting
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer ${eventType === "practice" ? "border-[#a3e635] bg-[#a3e635]/10" : "border-gray-200"}`}
                        >
                          <RadioGroupItem value="practice" id="practice" />
                          <Label htmlFor="practice" className="cursor-pointer">
                            Practice Match
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer ${eventType === "doubles" ? "border-[#a3e635] bg-[#a3e635]/10" : "border-gray-200"}`}
                        >
                          <RadioGroupItem value="doubles" id="doubles" />
                          <Label htmlFor="doubles" className="cursor-pointer">
                            Doubles Play
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer ${eventType === "lesson" ? "border-[#a3e635] bg-[#a3e635]/10" : "border-gray-200"}`}
                        >
                          <RadioGroupItem value="lesson" id="lesson" />
                          <Label htmlFor="lesson" className="cursor-pointer">
                            Group Lesson
                          </Label>
                        </div>
                      </RadioGroup>
                      {form.formState.errors.type && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>
                          Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setValue("date", date, { shouldValidate: true })}
                              initialFocus
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                          </PopoverContent>
                        </Popover>
                        {form.formState.errors.date && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.date.message as string}</p>
                        )}
                      </div>
                      <div>
                        <Label>
                          Skill Level <span className="text-red-500">*</span>
                        </Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...form.register("skillLevel")}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="all">All Levels Welcome</option>
                        </select>
                        {form.formState.errors.skillLevel && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.skillLevel.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">
                          Start Time <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input id="startTime" type="time" className="pl-10" {...form.register("startTime")} />
                        </div>
                        {form.formState.errors.startTime && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.startTime.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="endTime">
                          End Time <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input id="endTime" type="time" className="pl-10" {...form.register("endTime")} />
                        </div>
                        {form.formState.errors.endTime && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.endTime.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Location Information */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Find Tennis Court Location <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-gray-500 mb-2">
                        Search for a tennis court or click on the map to set your event location
                      </p>

                      <GoogleLocationPicker onLocationSelect={handleLocationSelect} initialLocation={coordinates} />

                      {form.formState.errors.location && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
                      )}

                      {(form.formState.errors.coordinates?.lat || form.formState.errors.coordinates?.lng) && (
                        <p className="text-red-500 text-sm mt-1">Please select a location on the map</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="playersNeeded">
                        Number of Players Needed <span className="text-red-500">*</span>
                      </Label>
                      <div className="pt-6 px-2">
                        <Slider
                          value={[watch("playersNeeded")]}
                          max={8}
                          min={1}
                          step={1}
                          onValueChange={(value) => setValue("playersNeeded", value[0], { shouldValidate: true })}
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">1</span>
                          <span className="text-sm font-medium">
                            {watch("playersNeeded")} player{watch("playersNeeded") !== 1 ? "s" : ""}
                          </span>
                          <span className="text-sm text-gray-500">8</span>
                        </div>
                      </div>
                      {form.formState.errors.playersNeeded && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.playersNeeded.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Details */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Add any additional details about your event..."
                        className="min-h-[100px]"
                        {...form.register("description")}
                      />
                    </div>

                    <div>
                      <Label>Equipment Provided</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="balls" className="cursor-pointer flex items-center gap-2">
                            <span>Tennis Balls</span>
                          </Label>
                          <Switch
                            id="balls"
                            checked={watch("equipment.balls")}
                            onCheckedChange={(checked) =>
                              setValue("equipment.balls", checked, { shouldValidate: true })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="rackets" className="cursor-pointer flex items-center gap-2">
                            <span>Extra Rackets</span>
                          </Label>
                          <Switch
                            id="rackets"
                            checked={watch("equipment.rackets")}
                            onCheckedChange={(checked) =>
                              setValue("equipment.rackets", checked, { shouldValidate: true })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="water" className="cursor-pointer flex items-center gap-2">
                            <span>Water</span>
                          </Label>
                          <Switch
                            id="water"
                            checked={watch("equipment.water")}
                            onCheckedChange={(checked) =>
                              setValue("equipment.water", checked, { shouldValidate: true })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event Privacy</Label>
                        <div className="flex items-center justify-between mt-2">
                          <Label htmlFor="isPrivate" className="cursor-pointer flex items-center gap-2">
                            <span>Private Event (Invitation Only)</span>
                          </Label>
                          <Switch
                            id="isPrivate"
                            checked={watch("isPrivate")}
                            onCheckedChange={(checked) => setValue("isPrivate", checked, { shouldValidate: true })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cost">Cost per Player ($)</Label>
                        <Input
                          id="cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...form.register("cost", {
                            setValueAs: (v) => (v === "" ? 0 : Number.parseFloat(v)),
                          })}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">Event Guidelines</p>
                        <p className="mt-1">
                          By updating this event, you agree to notify all participants of any changes. Be respectful to
                          all players regardless of skill level.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep} disabled={step === 1 || isSubmitting}>
                Back
              </Button>
              <Button
                className="bg-[#a3e635] text-black hover:bg-[#84cc16]"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : step < 3 ? (
                  "Continue"
                ) : (
                  "Update Event"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

