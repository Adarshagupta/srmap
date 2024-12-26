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

function CreatePostCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handlePost = async () => {
    if (!user || !content.trim()) {
      toast({
        title: "Error posting",
        description: "Please enter some content",
        variant: "destructive",
      });
      return;
    }

    try {
      setPosting(true);
      const timestamp = serverTimestamp();
      const hashtags = extractHashtags(content);
      console.log('Extracted hashtags:', hashtags); // Debug log

      const postRef = await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL || null,
        createdAt: timestamp,
        likes: 0,
        comments: 0,
        likedBy: [],
        hashtags: hashtags, // Store the full hashtag strings
      });

      // Update hashtags collection
      if (hashtags.length > 0) {
        try {
          const batch = writeBatch(db);
          hashtags.forEach((tag) => {
            // Use the full hashtag string for consistency
            const hashtagRef = doc(db, 'hashtags', tag.toLowerCase());
            batch.set(hashtagRef, {
              tag: tag.toLowerCase(),
              count: increment(1),
              lastUsed: serverTimestamp(),
            }, { merge: true });
          });
          await batch.commit();
        } catch (hashtagError) {
          console.error('Error updating hashtags:', hashtagError);
          // Continue even if hashtag update fails
        }
      }

      setContent('');
      toast({
        title: "Posted successfully",
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
      setFocused(false);
    }
  };

  return (
    <div className="border-b">
      <div className="flex gap-3 p-4">
        <Avatar className="w-11 h-11">
          <AvatarImage src={user?.photoURL || undefined} />
          <AvatarFallback>
            {user?.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-4">
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            className={cn(
              "resize-none w-full border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60 min-h-[56px] transition-all duration-200",
              focused ? "text-lg" : "text-base"
            )}
          />
          <div className={cn(
            "grid grid-rows-[0fr] transition-all duration-200",
            focused && "grid-rows-[1fr]"
          )}>
            <div className="overflow-hidden">
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex -ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </Button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div className="max-w-xl mx-auto divide-y">
      <div className="px-4">
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