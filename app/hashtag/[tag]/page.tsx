"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/app/feed/page';

export default function HashtagPage({ params }: { params: { tag: string } }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const searchTag = `#${params.tag.toLowerCase()}`;
        console.log('Searching for hashtag:', searchTag);

        const q = query(
          collection(db, 'posts'),
          where('hashtags', 'array-contains', searchTag),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        console.log('Found posts:', snapshot.size);

        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching hashtag posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, params.tag]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Join the Conversation</h2>
            <p className="text-muted-foreground">
              Sign in to view posts with #{params.tag}
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

  return (
    <div className="max-w-xl mx-auto">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold">#{params.tag}</h1>
        <p className="text-muted-foreground mt-1">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      <div className="divide-y">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No posts found with #{params.tag}
          </div>
        )}
      </div>
    </div>
  );
} 