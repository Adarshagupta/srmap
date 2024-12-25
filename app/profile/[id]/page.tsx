"use client";

import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCircle, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Hash, 
  MapPin, 
  BookOpen,
  ArrowLeft,
  Link as LinkIcon,
  Loader2,
  UserPlus,
  UserMinus,
  Clock,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ExternalLink,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useConnections } from '@/hooks/use-connections';
import ShareProfile from '@/components/share-profile';

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
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

interface Props {
  params: { id: string }
}

export default function ProfilePage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    connectionStatus, 
    loading: connectionLoading,
    connections,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection
  } = useConnections(params.id);

  const handleConnect = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    sendConnectionRequest(params.id);
  }, [user, params.id, sendConnectionRequest]);

  const handleAccept = useCallback((connectionId: string) => {
    if (!user) return;
    acceptConnectionRequest(connectionId);
  }, [user, acceptConnectionRequest]);

  const handleRemove = useCallback((connectionId: string) => {
    if (!user) return;
    removeConnection(connectionId);
  }, [user, removeConnection]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const ConnectButton = () => {
    if (!user || user.uid === params.id) return null;

    if (connectionLoading) {
      return (
        <Button disabled>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading
        </Button>
      );
    }

    const connection = connections.find(
      c => (c.senderId === user.uid && c.receiverId === params.id) ||
           (c.senderId === params.id && c.receiverId === user.uid)
    );

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!connection) {
        sendConnectionRequest(params.id);
      } else if (connection.status === 'pending' && connection.receiverId === user.uid) {
        acceptConnectionRequest(connection.id);
      } else if (connection.status === 'connected') {
        removeConnection(connection.id);
      }
    };

    if (!connection) {
      return (
        <Button onClick={handleClick}>
          <UserPlus className="w-4 h-4 mr-2" />
          Connect
        </Button>
      );
    }

    if (connection.status === 'pending') {
      if (connection.receiverId === user.uid) {
        return (
          <Button onClick={handleClick}>
            <Clock className="w-4 h-4 mr-2" />
            Accept Request
          </Button>
        );
      }
      return (
        <Button variant="secondary" disabled>
          <Clock className="w-4 h-4 mr-2" />
          Request Sent
        </Button>
      );
    }

    if (connection.status === 'connected') {
      return (
        <Button variant="secondary" onClick={handleClick}>
          <UserMinus className="w-4 h-4 mr-2" />
          Connected
        </Button>
      );
    }

    return null;
  };

  const ProfileActions = () => {
    if (!user) return null;

    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/profile/${params.id}`
      : `/profile/${params.id}`;

    if (user.uid === params.id) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/profile/edit">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
          <ShareProfile 
            name={person?.name || 'User'} 
            profileUrl={shareUrl}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <ConnectButton />
        <ShareProfile 
          name={person?.name || 'User'} 
          profileUrl={shareUrl}
        />
      </div>
    );
  };

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const docRef = doc(db, 'users', params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Profile not found');
          return;
        }

        const data = docSnap.data();
        console.log('Profile data:', data);
        console.log('Social links:', data.socialLinks);

        setPerson({
          id: docSnap.id,
          ...data
        } as Person);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-6">
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !person) {
    if (user && user.uid === params.id) {
      return (
        <div className="container max-w-4xl py-6">
          <Card className="p-8 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <UserCircle className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">Complete Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your profile to connect with other students and share your interests.
              </p>
              <Button 
                onClick={() => router.push('/profile/edit')}
              >
                Create Profile
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="container max-w-4xl py-6">
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <UserCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Profile Not Found</h3>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or hasn't been created yet.
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/discover')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Profile Header Card */}
      <Card className="relative overflow-hidden">
        {/* Cover Image - You can add a cover image feature later */}
        <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5" />
        
        <div className="p-6 md:p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-6">
              {/* Avatar and Actions */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                <Avatar className="w-32 h-32 border-4 border-background -mt-20">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback className="text-3xl">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{person.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                      {person.year}
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                      {person.batch} Batch
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                      {person.department}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ProfileActions />
                </div>
              </div>

              {/* Bio */}
              {person.bio && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-muted-foreground leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Academic Info Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Academic Info
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Registration Number</label>
              <p className="font-medium">{person.regNumber}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Personal Email</label>
              <p className="font-medium break-all">{person.email}</p>
            </div>
            {person.collegeEmail && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">College Email</label>
                <p className="font-medium break-all">{person.collegeEmail}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Interests Card */}
        {person.interests && person.interests.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {person.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Social Links Card */}
        {person.socialLinks && Object.values(person.socialLinks).some(link => link) && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Social Links
            </h2>
            <div className="grid gap-3">
              {person.socialLinks?.twitter && (
                <a
                  href={person.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                  <span className="font-medium">Twitter</span>
                  <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                </a>
              )}
              {person.socialLinks?.instagram && (
                <a
                  href={person.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Instagram className="h-5 w-5 text-[#E4405F]" />
                  <span className="font-medium">Instagram</span>
                  <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                </a>
              )}
              {person.socialLinks?.linkedin && (
                <a
                  href={person.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                  <span className="font-medium">LinkedIn</span>
                  <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                </a>
              )}
              {person.socialLinks?.github && (
                <a
                  href={person.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-medium">GitHub</span>
                  <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                </a>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 