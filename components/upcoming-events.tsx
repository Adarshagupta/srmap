import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

const FEATURED_EVENTS = [
  {
    id: 1,
    title: 'Tech Symposium 2024',
    date: '2024-04-15',
    time: '09:00 AM',
    location: 'Main Auditorium',
    category: 'Academic',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
  },
  {
    id: 2,
    title: 'Cultural Fest',
    date: '2024-04-20',
    time: '05:00 PM',
    location: 'Open Air Theatre',
    category: 'Cultural',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  },
  {
    id: 3,
    title: 'Hackathon 2024',
    date: '2024-04-25',
    time: '10:00 AM',
    location: 'Computer Science Block',
    category: 'Technical',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400'
  }
];

export default function UpcomingEvents() {
  return (
    <div className="grid gap-4">
      {FEATURED_EVENTS.map((event) => (
        <Link key={event.id} href="/events">
          <Card className="p-4 hover:shadow-md transition-all duration-200 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 text-xs rounded-full ${event.color}`}>
                  {event.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}