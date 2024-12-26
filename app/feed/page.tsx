"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Heart, MessageCircle, Share2, Loader2, Image as ImageIcon, Send, MoreHorizontal, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractHashtags } from '@/lib/utils';
import { PostCard } from '@/components/post-card';
import { PostImageUpload } from '@/components/post-image-upload';

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
  imageUrl?: string;
}

function CreatePostCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string>();
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);

      // Get user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (!userData) {
        toast({
          title: "Error",
          description: "User profile not found",
          variant: "destructive",
        });
        return;
      }

      // Extract hashtags
      const hashtags = extractHashtags(content);

      // Create post
      const postData = {
        content: content.trim(),
        authorId: user.uid,
        authorName: userData.name || user.displayName || 'Anonymous',
        authorAvatar: userData.avatar || user.photoURL || null,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        likedBy: [],
        hashtags,
        imageUrl,
      };

      await addDoc(collection(db, 'posts'), postData);

      // Reset form
      setContent('');
      setImageUrl(undefined);
      setFocused(false);

      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (error) {
      console.error('Error posting:', error);
      toast({
        title: "Error posting",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={user.photoURL || undefined} />
          <AvatarFallback>
            {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            className="min-h-[100px] resize-none"
          />

          {(focused || imageUrl) && (
            <div className="space-y-4">
              <PostImageUpload
                userId={user.uid}
                onUploadComplete={setImageUrl}
                onRemove={() => setImageUrl(undefined)}
                currentImageUrl={imageUrl}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-sm">Add an image to your post</span>
                </div>

                <div className="flex items-center gap-4">
                  {content.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {content.length}/280
                    </span>
                  )}
                  <Button 
                    onClick={handlePost} 
                    disabled={!content.trim() || posting || content.length > 280}
                    className="rounded-full px-4 py-2"
                    size="sm"
                  >
                    {posting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'posts'),
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
  }, [user]);

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
    <div className="w-full max-w-3xl mx-auto divide-y px-2 sm:px-4">
      <div className="mb-4">
        <CreatePostCard />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
} 