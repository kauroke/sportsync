import { redirect } from "next/navigation"

export default function MapPage() {
  redirect("/events?view=map")
  return null
}

