import { NextResponse } from 'next/server';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
}

export async function GET() {
  try {
    const eventsRef = collection(db, 'events');
    const eventsQuery = query(eventsRef, orderBy('date'));
    const snapshot = await getDocs(eventsQuery);

    const now = new Date();
    const upcomingEvents: UpcomingEvent[] = [];

    snapshot.forEach((doc) => {
      const event = { id: doc.id, ...doc.data() } as Event;
      const eventDate = new Date(event.date);
      
      if (eventDate >= now) {
        upcomingEvents.push({
          id: event.id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString(),
          location: event.location,
        });
      }
    });

    // Sort by date
    upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 