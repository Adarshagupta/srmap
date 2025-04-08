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
import { TwitterIcon, InstagramIcon, LinkedinIcon, GithubIcon } from 'lucide-react';
import ShareProfile from '@/components/share-profile';
import { PostCard } from '@/components/post-card';
import { ConnectionButton } from '@/components/connection-button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
        <div className="max-w-lg mx-auto py-8 px-4">
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
      <div className="max-w-lg mx-auto py-8 px-4">
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
      {/* Hero Section with Cover Image */}
      <div className="relative w-full">
        <div className="h-48 md:h-64 lg:h-80 w-full bg-gradient-to-r from-amber-500 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Profile Container */}
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Profile Header */}
          <div className="relative -mt-20 md:-mt-24 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative z-10">
                <div className="rounded-xl overflow-hidden border-4 border-background shadow-xl bg-background">
                  {isOwnProfile ? (
                    <div className="w-32 h-32 md:w-40 md:h-40">
                      <ProfileImageUpload
                        userId={user.uid}
                        currentImageUrl={profile?.avatar}
                        userName={profile?.name || ''}
                        onUploadComplete={(url) => setProfile(prev => prev ? { ...prev, avatar: url } : null)}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40">
                      <ProfileImageUpload
                        userId={profile?.id || ''}
                        currentImageUrl={profile?.avatar}
                        userName={profile?.name || ''}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-4 md:pt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile?.name}</h1>
                    {profile?.department && (
                      <p className="text-lg text-muted-foreground">{profile.department}</p>
                    )}
                    {profile?.createdAt && (
                      <p className="text-sm text-muted-foreground flex items-center mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joined {new Date(profile.createdAt.toDate()).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {!isOwnProfile && <ConnectionButton personId={params.id} />}
                    {isOwnProfile ? (
                      <Link href="/profile/edit">
                        <Button variant="outline" className="gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                          </svg>
                          Edit Profile
                        </Button>
                      </Link>
                    ) : (
                      <ShareProfile
                        name={profile?.name || ''}
                        profileUrl={typeof window !== 'undefined' ? window.location.href : ''}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Left Column - About */}
            <div className="md:col-span-1 space-y-6">
              {/* About Card */}
              <Card className="overflow-hidden">
                <div className="bg-amber-500 p-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                    About
                  </h2>
                </div>
                <div className="p-4">
                  {profile?.bio ? (
                    <p className="text-base">{profile.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No bio provided</p>
                  )}
                </div>
              </Card>

              {/* Details Card */}
              <Card className="overflow-hidden">
                <div className="bg-orange-500 p-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2"/>
                      <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                      <path d="M12 13h4"/>
                      <path d="M12 17h4"/>
                      <path d="M8 13h.01"/>
                      <path d="M8 17h.01"/>
                    </svg>
                    Details
                  </h2>
                </div>
                <div className="divide-y">
                  {profile?.regNumber && (
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-sm font-medium">Registration Number</span>
                      <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">{profile.regNumber}</span>
                    </div>
                  )}
                  {profile?.batch && (
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-sm font-medium">Batch</span>
                      <span className="text-sm">{profile.batch}</span>
                    </div>
                  )}
                  {profile?.year && (
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-sm font-medium">Year</span>
                      <span className="text-sm">{profile.year}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Interests Card */}
              {profile?.interests && profile.interests.length > 0 && (
                <Card className="overflow-hidden">
                  <div className="bg-amber-600 p-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        <path d="M5 3v4"/>
                        <path d="M19 17v4"/>
                        <path d="M3 5h4"/>
                        <path d="M17 19h4"/>
                      </svg>
                      Interests
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-xs rounded-full bg-amber-100 text-amber-800 font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Social Links Card */}
              {profile?.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
                <Card className="overflow-hidden">
                  <div className="bg-orange-600 p-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <path d="M15 3h6v6"/>
                        <path d="m10 14 11-11"/>
                      </svg>
                      Connect
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-4">
                      {profile.socialLinks.twitter && (
                        <a
                          href={profile.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <TwitterIcon className="h-5 w-5" />
                        </a>
                      )}
                      {profile.socialLinks.instagram && (
                        <a
                          href={profile.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                        >
                          <InstagramIcon className="h-5 w-5" />
                        </a>
                      )}
                      {profile.socialLinks.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <LinkedinIcon className="h-5 w-5" />
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a
                          href={profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <GithubIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Posts */}
            <div className="md:col-span-2">
              <Card>
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2Z"/>
                    </svg>
                    Posts
                  </h2>
                </div>
                <div className="divide-y">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div key={post.id} className="p-4">
                        <PostCard post={post} />
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground/50">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="M7 7h10"/>
                        <path d="M7 12h10"/>
                        <path d="M7 17h4"/>
                      </svg>
                      <p className="text-lg">No posts yet</p>
                      {isOwnProfile && (
                        <p className="text-sm mt-2">Share your thoughts and experiences with the community</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Developers Section */}
          <div className="mt-8 mb-4">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                  </svg>
                  Developers
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Prazwal Gupta",
                      role: "Lead Developer",
                      avatar: "/developers/prazwal.jpg",
                      github: "https://github.com/prazwolgupta",
                      linkedin: "https://linkedin.com/in/prazwolgupta"
                    },
                    {
                      name: "Aditya Sharma",
                      role: "UI/UX Designer",
                      avatar: "/developers/aditya.jpg",
                      github: "https://github.com/adityasharma",
                      linkedin: "https://linkedin.com/in/adityasharma"
                    },
                    {
                      name: "Priya Patel",
                      role: "Backend Developer",
                      avatar: "/developers/priya.jpg",
                      github: "https://github.com/priyapatel",
                      linkedin: "https://linkedin.com/in/priyapatel"
                    }
                  ].map((developer, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-12 w-12 border-2 border-background">
                        <AvatarImage src={developer.avatar} alt={developer.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {developer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{developer.name}</p>
                        <p className="text-sm text-muted-foreground">{developer.role}</p>
                        <div className="flex mt-1 space-x-2">
                          {developer.github && (
                            <a href={developer.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <GithubIcon className="h-4 w-4" />
                            </a>
                          )}
                          {developer.linkedin && (
                            <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <LinkedinIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}