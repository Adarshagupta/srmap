"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { ProfileImageUpload } from '@/components/profile-image-upload';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import ShareProfile from '@/components/share-profile';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  department?: string;
  bio?: string;
  regNumber?: string;
  batch?: string;
  year?: string;
  interests?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
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
    if (isOwnProfile) {
      return (
        <div className="max-w-lg mx-auto py-12 px-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Create Your Profile</h2>
              <p className="text-muted-foreground">
                Welcome to SRM AP Connect! Let's set up your profile so others can find and connect with you.
              </p>
              <Link href="/profile/edit">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            {isOwnProfile ? (
              <ProfileImageUpload
                userId={user.uid}
                currentImageUrl={profile.avatar}
                userName={profile.name}
                onUploadComplete={(url) => setProfile(prev => prev ? { ...prev, avatar: url } : null)}
              />
            ) : (
              <div className="w-32 h-32">
                <ProfileImageUpload
                  userId={profile.id}
                  currentImageUrl={profile.avatar}
                  userName={profile.name}
                />
              </div>
            )}
            
            {isOwnProfile && (
              <Link href="/profile/edit">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {profile.department && (
                  <p className="text-muted-foreground">{profile.department}</p>
                )}
              </div>
              <ShareProfile 
                name={profile.name} 
                profileUrl={typeof window !== 'undefined' ? window.location.href : ''}
              />
            </div>

            {profile.bio && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">About</h3>
                <p className="text-sm">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.regNumber && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Registration Number</h3>
                  <p className="text-sm">{profile.regNumber}</p>
                </div>
              )}
              {profile.batch && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Batch</h3>
                  <p className="text-sm">{profile.batch}</p>
                </div>
              )}
              {profile.year && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Year</h3>
                  <p className="text-sm">{profile.year}</p>
                </div>
              )}
            </div>

            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Social Links</h3>
                <div className="flex gap-4">
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {profile.socialLinks.instagram && (
                    <a
                      href={profile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 