"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Loader2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { RenderContent } from '@/components/render-content';
import { usePostInteractions } from '@/hooks/use-post-interactions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Timestamp;
}

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { toggleLike, addComment, sharePost, deletePost, deleteComment, commenting, liking, deletingCommentId } = usePostInteractions(post.id);
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

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
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
              <RenderContent content={post.content} />
            </div>

            {post.imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={post.imageUrl}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

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
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <Link 
                            href={`/profile/${comment.authorId}`}
                            className="font-semibold hover:underline"
                          >
                            {comment.authorName}
                          </Link>
                          <span className="text-muted-foreground ml-2">
                            {comment.createdAt?.toDate ? 
                              formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 
                              'Just now'
                            }
                          </span>
                        </div>
                        {user?.uid === comment.authorId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                {deletingCommentId === comment.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-3 w-3" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={deletingCommentId === comment.id}
                              >
                                {deletingCommentId === comment.id ? "Deleting..." : "Delete comment"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <div className="text-sm mt-1">
                        <RenderContent content={comment.content} />
                      </div>
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