"use client";

import { useState, useCallback } from 'react';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  addDoc, 
  collection, 
  serverTimestamp,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth-provider';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
}

export function usePostInteractions(postId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);

  const toggleLike = useCallback(async () => {
    if (!user) return;

    try {
      setLiking(true);
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();
      const likedBy = postData?.likedBy || [];
      const hasLiked = likedBy.includes(user.uid);

      await updateDoc(postRef, {
        likedBy: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes: increment(hasLiked ? -1 : 1)
      });

      toast({
        title: hasLiked ? "Post unliked" : "Post liked",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLiking(false);
    }
  }, [user, postId, toast]);

  const addComment = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      setCommenting(true);
      const postRef = doc(db, 'posts', postId);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        content: content.trim(),
        authorId: user.uid,
        authorName: userData?.name || 'Unknown User',
        authorAvatar: userData?.avatar,
        createdAt: serverTimestamp(),
      });

      await updateDoc(postRef, {
        comments: increment(1)
      });

      toast({
        title: "Comment added",
      });

      return commentRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCommenting(false);
    }
  }, [user, postId, toast]);

  const sharePost = useCallback(async () => {
    try {
      const postUrl = `${window.location.origin}/feed?post=${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard",
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  }, [postId, toast]);

  return {
    toggleLike,
    addComment,
    sharePost,
    commenting,
    liking,
  };
} 