"use client";

import { useState, useEffect } from 'react';
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
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Loader2, Image as ImageIcon, Send, MoreHorizontal, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePostInteractions } from '@/hooks/use-post-interactions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Timestamp;
}

function CreatePostCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(false);

  const handlePost = async () => {
    if (!user || !content.trim()) return;

    try {
      setPosting(true);
      const timestamp = serverTimestamp();
      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL || null,
        createdAt: timestamp,
        likes: 0,
        comments: 0,
        likedBy: [],
      });

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

function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { toggleLike, addComment, sharePost, deletePost, commenting, liking } = usePostInteractions(post.id);
  const hasLiked = post.likedBy?.includes(user?.uid || '');

  useEffect(() => {
    if (showComments) {
      setLoadingComments(true);
      const q = query(
        collection(db, 'posts', post.id, 'comments'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        setComments(commentsData);
        setLoadingComments(false);
      });

      return () => unsubscribe();
    }
  }, [showComments, post.id]);

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    await addComment(commentContent);
    setCommentContent('');
  };

  return (
    <div className="border-b hover:bg-muted/30 transition-colors duration-200">
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <Link href={`/profile/${post.authorId}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>
                {post.authorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Link 
                  href={`/profile/${post.authorId}`}
                  className="font-semibold hover:underline truncate"
                >
                  {post.authorName}
                </Link>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={sharePost}>Copy link</DropdownMenuItem>
                  {user?.uid === post.authorId && (
                    <DropdownMenuItem 
                      onClick={deletePost}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2 text-[15px] leading-normal">
              {post.content}
            </div>
            <div className="flex items-center gap-6 mt-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-muted-foreground hover:text-primary hover:bg-primary/10 -ml-3",
                  hasLiked && "text-primary"
                )}
                onClick={toggleLike}
                disabled={liking}
              >
                <Heart className={cn(
                  "w-4 h-4 mr-2",
                  hasLiked && "fill-current"
                )} />
                {post.likes > 0 && post.likes}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {post.comments > 0 && post.comments}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={sharePost}
              >
                <Share2 className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="space-y-4 mt-4 pl-12">
            <div className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback>
                  {user?.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Post your reply"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={1}
                  className="resize-none min-h-[2.5rem] py-2 text-sm"
                />
                <Button 
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentContent.trim() || commenting}
                  className="rounded-full px-4"
                >
                  {commenting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reply"
                  )}
                </Button>
              </div>
            </div>

            {loadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.authorAvatar} />
                      <AvatarFallback>
                        {comment.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm">
                        <Link 
                          href={`/profile/${comment.authorId}`}
                          className="font-semibold hover:underline"
                        >
                          {comment.authorName}
                        </Link>
                        <span className="text-muted-foreground ml-2">
                          {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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