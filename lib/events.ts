// This would be replaced with actual API calls in a real application
import { z } from "zod"

// Event schema
export const eventSchema = z.object({
  id: z.number(),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  type: z.enum(["casual", "practice", "doubles", "lesson"]),
  date: z.date(),
  startTime: z.string().min(1, "Please select a start time"),
  endTime: z.string().min(1, "Please select an end time"),
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "all"]),
  location: z.string().min(3, "Please enter a location"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  playersNeeded: z.number().min(1).max(8),
  description: z.string().optional(),
  equipment: z.object({
    balls: z.boolean().default(false),
    rackets: z.boolean().default(false),
    water: z.boolean().default(false),
  }),
  isPrivate: z.boolean().default(false),
  cost: z.number().min(0).default(0),
  createdBy: z.string().optional(),
  joinRequests: z.array(z.object({
    userId: z.string(),
    status: z.enum(["pending", "approved", "denied"])
  })).default([]),
})

export type Event = z.infer<typeof eventSchema>

// Sample events data
const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Casual Hitting Session",
    type: "casual",
    skillLevel: "beginner",
    date: new Date("2024-06-15"),
    startTime: "09:00",
    endTime: "11:00",
    location: "Sydney Olympic Park Tennis Centre",
    coordinates: { lat: -33.8467, lng: 151.0665 },
    playersNeeded: 2,
    description: "Looking for a casual hitting partner to practice groundstrokes and serves.",
    equipment: {
      balls: true,
      rackets: false,
      water: false,
    },
    isPrivate: false,
    cost: 0,
    createdBy: "user123",
    joinRequests: [],
  },
  {
    id: 2,
    title: "Practice Match",
    type: "practice",
    skillLevel: "intermediate",
    date: new Date("2024-06-16"),
    startTime: "14:00",
    endTime: "16:00",
    location: "Rushcutters Bay Tennis",
    coordinates: { lat: -33.8744, lng: 151.2326 },
    playersNeeded: 1,
    description: "Looking for an intermediate player for a practice match. We'll play best of 3 sets.",
    equipment: {
      balls: true,
      rackets: false,
      water: true,
    },
    isPrivate: false,
    cost: 0,
    createdBy: "user456",
    joinRequests: [],
  },
  {
    id: 3,
    title: "Doubles Play",
    type: "doubles",
    skillLevel: "advanced",
    date: new Date("2024-06-17"),
    startTime: "18:00",
    endTime: "20:00",
    location: "Centennial Park Tennis Centre",
    coordinates: { lat: -33.8932, lng: 151.2324 },
    playersNeeded: 3,
    description: "Looking for 3 players to join me for doubles. Advanced level preferred.",
    equipment: {
      balls: true,
      rackets: false,
      water: false,
    },
    isPrivate: false,
    cost: 10,
    createdBy: "user789",
    joinRequests: [],
  },
]

// Mock API functions
export async function getEvents(): Promise<Event[]> {
  // In a real app, this would fetch from an API
  return [...sampleEvents] // Return a copy to avoid mutations
}

export async function getEvent(id: number): Promise<Event | undefined> {
  // In a real app, this would fetch from an API
  return sampleEvents.find((event) => event.id === id)
}

export async function createEvent(event: Omit<Event, "id">): Promise<Event> {
  // In a real app, this would send a POST request to an API
  const newId = sampleEvents.length > 0 ? Math.max(...sampleEvents.map((e) => e.id)) + 1 : 1

  const newEvent: Event = {
    ...event,
    id: newId,
    joinRequests: [],
  }

  // Add to our sample events array
  sampleEvents.push(newEvent)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return newEvent
}

export async function updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined> {
  // In a real app, this would send a PUT request to an API
  const index = sampleEvents.findIndex((e) => e.id === id)

  if (index === -1) {
    return undefined
  }

  // Update the event
  sampleEvents[index] = {
    ...sampleEvents[index],
    ...event,
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return sampleEvents[index]
}

export async function deleteEvent(id: number): Promise<boolean> {
  // In a real app, this would send a DELETE request to an API
  const index = sampleEvents.findIndex((e) => e.id === id)

  if (index === -1) {
    return false
  }

  // Remove the event
  sampleEvents.splice(index, 1)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return true
}

export async function requestToJoinEvent(eventId: number, userId: string): Promise<Event | undefined> {
  const event = sampleEvents.find(e => e.id === eventId);
  if (!event) return undefined;

  // Check if the user has already requested to join
  const existingRequest = event.joinRequests.find(req => req.userId === userId);
  if (existingRequest) return event;

  // Add a new join request
  event.joinRequests.push({ userId, status: "pending" });
  return event;
}

export async function approveJoinRequest(eventId: number, userId: string): Promise<Event | undefined> {
  const event = sampleEvents.find(e => e.id === eventId);
  if (!event) return undefined;

  const request = event.joinRequests.find(req => req.userId === userId);
  if (request) {
    request.status = "approved";
  }
  return event;
}

export async function denyJoinRequest(eventId: number, userId: string): Promise<Event | undefined> {
  const event = sampleEvents.find(e => e.id === eventId);
  if (!event) return undefined;

  const request = event.joinRequests.find(req => req.userId === userId);
  if (request) {
    request.status = "denied";
  }
  return event;
}

