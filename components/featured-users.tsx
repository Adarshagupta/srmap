"use client";

import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs, orderBy, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  department: string;
  avatar?: string;
  bio?: string;
}

export default function FeaturedUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('name'), limit(4));
        const snapshot = await getDocs(q);
        
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-3 w-32 mx-auto" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {users.map((user) => (
        <Link key={user.id} href={`/profile/${user.id}`}>
          <Card className="p-4 md:p-6 hover:bg-muted/50 transition-colors h-full">
            <div className="flex flex-col items-center text-center space-y-3">
              <Avatar className="h-14 w-14 md:h-16 md:w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {user.department}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 