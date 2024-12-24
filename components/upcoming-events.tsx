"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Event {
  id: string
  title: string
  date: string
  location: string
  imageUrl?: string
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground">No upcoming events at this time.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {event.date} • {event.location}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}