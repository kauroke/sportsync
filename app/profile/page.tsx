"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Facebook, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes logic would go here
      setIsEditing(false)
    } else {
      setName(user.name)
      setEmail(user.email)
      setIsEditing(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500 mb-4">{user.email}</p>

                  <Badge className="mb-4" variant={user.provider === "facebook" ? "default" : "outline"}>
                    {user.provider === "facebook" ? (
                      <div className="flex items-center">
                        <Facebook className="h-3 w-3 mr-1" />
                        <span>Facebook</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        <span>Email</span>
                      </div>
                    )}
                  </Badge>

                  <Button variant="outline" className="w-full" onClick={handleEditToggle}>
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={user.provider === "facebook"}
                        />
                        {user.provider === "facebook" && (
                          <p className="text-xs text-gray-500">Email cannot be changed for Facebook accounts</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                        <p className="mt-1 capitalize">{user.provider || "Email"} Account</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Tennis Profile</CardTitle>
                  <CardDescription>Your tennis information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Skill Level</h3>
                      <p className="mt-1">Intermediate</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferred Play Style</h3>
                      <p className="mt-1">Singles, Casual Hitting</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                      <p className="mt-1">Weekends, Evenings</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferred Locations</h3>
                      <p className="mt-1">Sydney Olympic Park, Rushcutters Bay</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

