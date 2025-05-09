"use client";

import { useEffect, useState } from 'react';
import { collection, query, limit, onSnapshot, where, orderBy, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  UserCircle,
  MapPin,
  BookOpen,
  Mail,
  Calendar,
  GraduationCap,
  Hash,
  Link as LinkIcon,
  UserPlus,
  UserMinus,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import Link from 'next/link';
import { useAuth } from './auth-provider';
import { useConnections, ConnectionStatus } from '@/hooks/use-connections';

interface Person {
  id: string;
  name: string;
  email: string;
  collegeEmail?: string;
  regNumber: string;
  batch: string;
  year: string;
  department: string;
  dob: string;
  interests: string[];
  bio: string;
  avatar?: string;
}

interface DiscoverPeopleProps {
  filters: {
    search: string;
    department: string;
    year: string;
    batch: string;
  };
  view?: 'grid' | 'list';
}

function ConnectionButton({ personId }: { personId: string }) {
  const { user } = useAuth();
  const {
    connectionStatus,
    loading: connectionLoading,
    connections,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection
  } = useConnections(personId);

  const handleConnection = async () => {
    if (!user) return;

    const connection = connections.find(
      c => c.senderId === personId || c.receiverId === personId
    );

    if (connectionStatus === 'none') {
      await sendConnectionRequest(personId);
    } else if (connectionStatus === 'pending' && connection) {
      if (connection.receiverId === user.uid) {
        await acceptConnectionRequest(connection.id);
      }
    } else if (connectionStatus === 'connected' && connection) {
      await removeConnection(connection.id);
    }
  };

  if (!user || user.uid === personId) return null;

  if (connectionLoading) {
    return (
      <Button className="flex-1" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading
      </Button>
    );
  }

  switch (connectionStatus) {
    case 'none':
      return (
        <Button className="flex-1" onClick={handleConnection}>
          <UserPlus className="w-4 h-4 mr-2" />
          Connect
        </Button>
      );
    case 'pending':
      const isPending = connections.find(
        c => c.receiverId === user.uid && c.senderId === personId
      );
      if (isPending) {
        return (
          <Button className="flex-1" onClick={handleConnection}>
            <Clock className="w-4 h-4 mr-2" />
            Accept Request
          </Button>
        );
      }
      return (
        <Button className="flex-1" variant="secondary" disabled>
          <Clock className="w-4 h-4 mr-2" />
          Request Sent
        </Button>
      );
    case 'connected':
      return (
        <Button className="flex-1" variant="secondary" onClick={handleConnection}>
          <UserMinus className="w-4 h-4 mr-2" />
          Connected
        </Button>
      );
    default:
      return null;
  }
}

export default function DiscoverPeople({ filters, view = 'grid' }: DiscoverPeopleProps) {
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        setError(null);

        const constraints: QueryConstraint[] = [orderBy('name'), limit(20)];

        if (filters.department !== 'All Departments') {
          constraints.push(where('department', '==', filters.department));
        }
        if (filters.year !== 'All Years') {
          constraints.push(where('year', '==', filters.year));
        }
        if (filters.batch !== 'All Batches') {
          constraints.push(where('batch', '==', filters.batch));
        }

        const q = query(collection(db, 'users'), ...constraints);

        const unsubscribe = onSnapshot(q,
          (snapshot) => {
            let peopleData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Person[];

            // Client-side search filtering
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              peopleData = peopleData.filter(person =>
                person.name.toLowerCase().includes(searchLower) ||
                person.regNumber.toLowerCase().includes(searchLower)
              );
            }

            // Filter out current user
            if (user) {
              peopleData = peopleData.filter(person => person.id !== user.uid);
            }

            setPeople(peopleData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching people:', error);
            setError('Failed to load people. Please try again later.');
            setLoading(false);
            toast({
              title: "Error",
              description: "Failed to load people. Please check your connection.",
              variant: "destructive",
            });
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up people listener:', error);
        setError('Failed to initialize people loader.');
        setLoading(false);
      }
    };

    fetchPeople();
  }, [filters.department, filters.year, filters.batch, toast, user]);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <UserCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">No students found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria to find more students.
          </p>
        </div>
      </Card>
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person) => (
          <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-background group-hover:border-primary/10 transition-all">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback className="bg-amber-100 text-amber-800">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{person.name}</h3>
                  <p className="text-sm text-muted-foreground">{person.year} • {person.batch} Batch</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-4 h-4" />
                  <span>{person.regNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{person.department}</span>
                </div>
              </div>

              {person.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {person.bio}
                </p>
              )}

              {person.interests && person.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {person.interests.slice(0, 3).map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {interest}
                    </span>
                  ))}
                  {person.interests.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      +{person.interests.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link href={`/profile/${person.id}`}>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
                <ConnectionButton personId={person.id} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {people.map((person) => (
        <Card key={person.id} className="overflow-hidden hover:shadow-md transition-all duration-200 group">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="w-10 h-10 border-2 border-background group-hover:border-primary/10 transition-all">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback className="bg-amber-100 text-amber-800">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{person.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span>{person.department}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                    <span>{person.year} • {person.batch}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/profile/${person.id}`}>
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                    Profile
                  </Link>
                </Button>
                <div className="h-8">
                  <ConnectionButton personId={person.id} />
                </div>
              </div>
            </div>

            {person.interests && person.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {person.interests.slice(0, 5).map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {interest}
                  </span>
                ))}
                {person.interests.length > 5 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    +{person.interests.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}