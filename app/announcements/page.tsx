"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
  title: string;
  content: string;
  category: 'academic' | 'event' | 'general' | 'important';
  date: string;
  link?: string;
}

const categoryColors = {
  academic: 'bg-blue-500',
  event: 'bg-green-500',
  general: 'bg-gray-500',
  important: 'bg-red-500'
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Megaphone className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Megaphone className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Announcements</h1>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {announcement.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{announcement.date}</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">
                  {announcement.title}
                </h2>

                <p className="text-muted-foreground">
                  {announcement.content}
                </p>

                {announcement.link && (
                  <Link 
                    href={announcement.link}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Learn More
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 