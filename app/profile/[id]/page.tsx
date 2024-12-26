"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, Calendar } from 'lucide-react';
import Link from 'next/link';
import { ProfileImageUpload } from '@/components/profile-image-upload';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import ShareProfile from '@/components/share-profile';
import { useRouter } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { ConnectionButton } from '@/components/connection-button';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
  likes: number;
  comments: number;
  likedBy?: string[];
  hashtags: string[];
  imageUrl?: string;
}

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
  createdAt?: any;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = user?.uid === params.id;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        // Fetch profile
        const docRef = doc(db, 'users', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({
            id: docSnap.id,
            ...docSnap.data(),
          } as UserProfile);
        }

        // Fetch user's posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', params.id),
          orderBy('createdAt', 'desc')
        );
        const postsSnap = await getDocs(postsQuery);
        const postsData = postsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching profile and posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="w-full border-b">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col space-y-4">
            {/* Cover Image Placeholder */}
            <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5" />

            {/* Profile Info Section */}
            <div className="px-4 pb-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-start">
                  <div className="-mt-16 mb-4">
                    {isOwnProfile ? (
                      <ProfileImageUpload
                        userId={user.uid}
                        currentImageUrl={profile?.avatar}
                        userName={profile?.name || ''}
                        onUploadComplete={(url) => setProfile(prev => prev ? { ...prev, avatar: url } : null)}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background">
                        <ProfileImageUpload
                          userId={profile?.id || ''}
                          currentImageUrl={profile?.avatar}
                          userName={profile?.name || ''}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">{profile?.name}</h1>
                      {profile?.department && (
                        <p className="text-muted-foreground">{profile.department}</p>
                      )}
                      {profile?.createdAt && (
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Joined {new Date(profile.createdAt.toDate()).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isOwnProfile && <ConnectionButton personId={params.id} />}
                      {isOwnProfile ? (
                        <Link href="/profile/edit">
                          <Button variant="outline">Edit Profile</Button>
                        </Link>
                      ) : (
                        <ShareProfile 
                          name={profile?.name || ''} 
                          profileUrl={typeof window !== 'undefined' ? window.location.href : ''}
                        />
                      )}
                    </div>
                  </div>

                  {profile?.bio && (
                    <p className="text-base mb-4">{profile.bio}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {profile?.regNumber && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Registration Number</h3>
                        <p className="text-sm">{profile.regNumber}</p>
                      </div>
                    )}
                    {profile?.batch && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Batch</h3>
                        <p className="text-sm">{profile.batch}</p>
                      </div>
                    )}
                    {profile?.year && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Year</h3>
                        <p className="text-sm">{profile.year}</p>
                      </div>
                    )}
                  </div>

                  {profile?.interests && profile.interests.length > 0 && (
                    <div className="mb-4">
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

                  {profile?.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-screen-xl mx-auto">
        <div className="divide-y">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No posts yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 