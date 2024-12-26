"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/post-card';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Timestamp;
  likes: number;
  comments: number;
  likedBy?: string[];
  hashtags: string[];
}

export default function HashtagPage({ params }: { params: { tag: string } }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('hashtags', 'array-contains', params.tag),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const authorDocRef = doc(db, 'users', data.authorId);
          const authorDoc = await getDoc(authorDocRef);
          const authorData = authorDoc.data();
          
          return {
            id: docSnapshot.id,
            ...data,
            authorName: authorData?.name || 'Unknown User',
            authorAvatar: authorData?.avatar,
            createdAt: data.createdAt,
          } as Post;
        })
      );

      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.tag]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Join the Conversation</h2>
            <p className="text-muted-foreground">
              Sign in to view and share posts with your college community.
            </p>
            <Link href="/auth">
              <Button className="rounded-full px-8">Sign In</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="px-4 py-3 border-b">
        <h1 className="text-xl font-semibold">#{params.tag}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length > 0 ? (
        <div className="divide-y">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No posts found with #{params.tag}
        </div>
      )}
    </div>
  );
} 