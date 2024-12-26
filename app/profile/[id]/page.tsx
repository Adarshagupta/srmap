"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ProfileImageUpload } from '@/components/profile-image-upload';

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  department?: string;
  bio?: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = user?.uid === params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({
            id: docSnap.id,
            ...docSnap.data(),
          } as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Join the Community</h2>
            <p className="text-muted-foreground">
              Sign in to view profiles and connect with others.
            </p>
            <Link href="/auth">
              <Button className="rounded-full px-8">Sign In</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button className="rounded-full px-8">Go Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {isOwnProfile ? (
            <ProfileImageUpload
              userId={user.uid}
              currentImageUrl={profile.avatar}
              userName={profile.name}
              onUploadComplete={(url) => setProfile(prev => prev ? { ...prev, avatar: url } : null)}
            />
          ) : (
            <div className="w-24 h-24">
              <ProfileImageUpload
                userId={profile.id}
                currentImageUrl={profile.avatar}
                userName={profile.name}
              />
            </div>
          )}
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            {profile.department && (
              <p className="text-muted-foreground">{profile.department}</p>
            )}
          </div>

          {profile.bio && (
            <p className="text-center max-w-lg">{profile.bio}</p>
          )}

          {isOwnProfile && (
            <Link href="/settings">
              <Button variant="outline" className="rounded-full">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
} 