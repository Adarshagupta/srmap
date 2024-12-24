"use client";

import { useEffect, useState } from 'react';
import { collection, query, limit, onSnapshot, where, orderBy, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, MapPin, BookOpen, Mail, Calendar, GraduationCap, Hash, Link as LinkIcon } from 'lucide-react';
import { useToast } from './ui/use-toast';
import Link from 'next/link';

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
}

export default function DiscoverPeople({ filters }: DiscoverPeopleProps) {
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
  }, [filters.department, filters.year, filters.batch, toast]);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {people.map((person) => (
        <Card key={person.id} className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>
                  {person.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{person.name}</h3>
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

            <div className="flex gap-2">
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
              <Button className="flex-1">
                Connect
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}