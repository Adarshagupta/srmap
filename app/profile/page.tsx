"use client"

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, BookOpenIcon, GraduationCapIcon, Loader2 } from "lucide-react"
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'

interface StudentProfile {
  name: string
  email: string
  regNumber: string
  batch: string
  year: string
  department: string
  dob: string
  interests: string[]
  bio: string
  avatar?: string
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProfile(docSnap.data() as StudentProfile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && !user) {
      router.push('/auth')
    } else if (!authLoading && user) {
      fetchProfile()
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Profile not found. Please complete your profile in settings.</p>
            <Button 
              className="mt-4" 
              onClick={() => router.push('/profile/edit')}
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <Button 
          variant="outline"
          onClick={() => router.push('/profile/edit')}
        >
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm">
                  <BookOpenIcon className="w-3 h-3 mr-1" />
                  {profile.department}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <GraduationCapIcon className="w-3 h-3 mr-1" />
                  {profile.year}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Academic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <p className="font-medium">{profile.regNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Batch</p>
              <p className="font-medium">{profile.batch}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{profile.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{profile.year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {profile.bio && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">About</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {profile.interests && profile.interests.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Interests</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 