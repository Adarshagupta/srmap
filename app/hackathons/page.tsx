"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Trophy, Users, ExternalLink, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  registrationLink: string;
  prizePool: string;
  themes: string;
  location: string;
  organizers: string;
  imageUrl?: string;
}

export default function HackathonsPage() {
  const [upcomingHackathons, setUpcomingHackathons] = useState<Hackathon[]>([]);
  const [pastHackathons, setPastHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const hackathonsRef = collection(db, 'hackathons');
        const now = Timestamp.now();

        // Fetch upcoming hackathons
        const upcomingQuery = query(
          hackathonsRef,
          where('endDate', '>=', now),
          orderBy('endDate', 'asc')
        );
        const upcomingSnapshot = await getDocs(upcomingQuery);
        const upcomingData = upcomingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Hackathon));

        // If no upcoming hackathons found, add sample data for demonstration
        if (upcomingData.length === 0) {
          // Create sample upcoming hackathons
          const sampleUpcoming = [
            {
              id: 'sample-hackathon-1',
              title: "SRM AP Coding Challenge 2023",
              description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
              startDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
              endDate: Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
              location: "SRM University AP, Andhra Pradesh",
              prizePool: "₹50,000",
              themes: "AI/ML, Web Development, Mobile Apps",
              organizers: "SRM AP Tech Club",
              registrationLink: "https://forms.gle/example"
            },
            {
              id: 'sample-hackathon-2',
              title: "BlockChain Innovation Hackathon",
              description: "Explore the world of blockchain technology and develop innovative solutions for real-world problems. Open to all engineering students.",
              startDate: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
              endDate: Timestamp.fromDate(new Date(Date.now() + 16 * 24 * 60 * 60 * 1000)),
              location: "Virtual Event",
              prizePool: "₹75,000",
              themes: "Blockchain, Cryptocurrency, Smart Contracts",
              organizers: "SRM Blockchain Club",
              registrationLink: "https://forms.gle/example2"
            }
          ];
          setUpcomingHackathons(sampleUpcoming);
          console.log('Using sample upcoming hackathon data for demonstration');
        } else {
          setUpcomingHackathons(upcomingData);
        }

        // Fetch past hackathons
        const pastQuery = query(
          hackathonsRef,
          where('endDate', '<', now),
          orderBy('endDate', 'desc')
        );
        const pastSnapshot = await getDocs(pastQuery);
        const pastData = pastSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Hackathon));

        // If no past hackathons found, add sample data for demonstration
        if (pastData.length === 0) {
          // Create sample past hackathons
          const samplePast = [
            {
              id: 'sample-past-hackathon-1',
              title: "SRM AP Hackathon 2022",
              description: "Our annual flagship hackathon that brought together the brightest minds to solve challenging problems in technology.",
              startDate: Timestamp.fromDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
              endDate: Timestamp.fromDate(new Date(Date.now() - 58 * 24 * 60 * 60 * 1000)),
              location: "SRM University AP, Andhra Pradesh",
              prizePool: "₹100,000",
              themes: "IoT, AI/ML, Cloud Computing",
              organizers: "SRM AP Tech Club",
              registrationLink: ""
            },
            {
              id: 'sample-past-hackathon-2',
              title: "Health Tech Innovation Challenge",
              description: "A hackathon focused on developing innovative solutions for healthcare challenges using technology.",
              startDate: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
              endDate: Timestamp.fromDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)),
              location: "Virtual Event",
              prizePool: "₹60,000",
              themes: "Healthcare, Telemedicine, Medical Devices",
              organizers: "SRM Medical Innovation Club",
              registrationLink: ""
            }
          ];
          setPastHackathons(samplePast);
          console.log('Using sample past hackathon data for demonstration');
        } else {
          setPastHackathons(pastData);
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);

        // Fallback to sample data in case of error
        const sampleUpcoming = [
          {
            id: 'sample-hackathon-1',
            title: "SRM AP Coding Challenge 2023",
            description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
            startDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
            endDate: Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
            location: "SRM University AP, Andhra Pradesh",
            prizePool: "₹50,000",
            themes: "AI/ML, Web Development, Mobile Apps",
            organizers: "SRM AP Tech Club",
            registrationLink: "https://forms.gle/example"
          }
        ];
        setUpcomingHackathons(sampleUpcoming);

        const samplePast = [
          {
            id: 'sample-past-hackathon-1',
            title: "SRM AP Hackathon 2022",
            description: "Our annual flagship hackathon that brought together the brightest minds to solve challenging problems in technology.",
            startDate: Timestamp.fromDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
            endDate: Timestamp.fromDate(new Date(Date.now() - 58 * 24 * 60 * 60 * 1000)),
            location: "SRM University AP, Andhra Pradesh",
            prizePool: "₹100,000",
            themes: "IoT, AI/ML, Cloud Computing",
            organizers: "SRM AP Tech Club",
            registrationLink: ""
          }
        ];
        setPastHackathons(samplePast);
        console.log('Using sample hackathon data due to error');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Format date range (e.g., "Jan 1 - Jan 3, 2023" or "Jan 1, 2023")
  const formatDateRange = (startDate: Timestamp, endDate: Timestamp) => {
    const start = startDate.toDate();
    const end = endDate.toDate();

    const startDateStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const endDateStr = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      // Same month and year
      return `${startDateStr} - ${end.getDate()}, ${end.getFullYear()}`;
    } else if (start.getFullYear() === end.getFullYear()) {
      // Different month, same year
      return `${startDateStr} - ${endDateStr}`;
    } else {
      // Different month and year
      const startWithYear = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `${startWithYear} - ${endDateStr}`;
    }
  };

  // Check if a hackathon is currently active
  const isActive = (startDate: Timestamp, endDate: Timestamp) => {
    const now = new Date().getTime();
    return startDate.toMillis() <= now && endDate.toMillis() >= now;
  };

  // Helper to render theme badges from comma-separated string
  const renderThemes = (themesStr: string) => {
    if (!themesStr) return null;

    return themesStr.split(',').map((theme, index) => (
      <Badge key={index} variant="secondary" className="mr-1 mb-1">
        {theme.trim()}
      </Badge>
    ));
  };

  // Render hackathon cards
  const renderHackathons = (hackathons: Hackathon[]) => {
    if (hackathons.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hackathons found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => {
          const active = isActive(hackathon.startDate, hackathon.endDate);

          return (
            <Card key={hackathon.id} className="overflow-hidden flex flex-col h-full">
              {hackathon.imageUrl && (
                <div className="w-full h-48 relative">
                  <Image
                    src={hackathon.imageUrl}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                  />
                  {active && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">LIVE NOW</Badge>
                    </div>
                  )}
                </div>
              )}
              <CardHeader>
                <CardTitle>{hackathon.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center mt-2">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatDateRange(hackathon.startDate, hackathon.endDate)}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{hackathon.location || 'Location not specified'}</span>
                  </div>
                  {hackathon.organizers && (
                    <div className="flex items-center mt-2">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{hackathon.organizers}</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {hackathon.description}
                </p>

                {hackathon.prizePool && (
                  <div className="flex items-center mt-4">
                    <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm font-medium">{hackathon.prizePool}</span>
                  </div>
                )}

                {hackathon.themes && (
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Themes</span>
                    </div>
                    <div className="flex flex-wrap">
                      {renderThemes(hackathon.themes)}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {hackathon.registrationLink && activeTab === 'upcoming' ? (
                  <a href={hackathon.registrationLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                      Register <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    View Details
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hackathons</h1>
        <p className="text-muted-foreground">Discover and participate in coding competitions and tech events</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full mb-8" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming & Ongoing</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming">
          {renderHackathons(upcomingHackathons)}
        </TabsContent>

        <TabsContent value="past">
          {renderHackathons(pastHackathons)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
