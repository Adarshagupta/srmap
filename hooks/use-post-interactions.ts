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
  getDoc,
  deleteDoc,
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
}

// Function to extract hashtags from content
function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  return content.match(hashtagRegex) || [];
}

export function usePostInteractions(postId: string) {
  const { user } = useAuth();
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLiking(false);
    }
  }, [user, postId]);

  const addComment = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      setCommenting(true);
      const postRef = doc(db, 'posts', postId);
      const hashtags = extractHashtags(content);
      
      const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        content: content.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL,
        createdAt: serverTimestamp(),
        hashtags: hashtags,
      });

      await updateDoc(postRef, {
        comments: increment(1)
      });

      // Update hashtags collection for search
      if (hashtags.length > 0) {
        const batch = writeBatch(db);
        hashtags.forEach(async (tag) => {
          const hashtagRef = doc(db, 'hashtags', tag.slice(1).toLowerCase());
          batch.set(hashtagRef, {
            tag: tag.slice(1).toLowerCase(),
            count: increment(1),
            lastUsed: serverTimestamp(),
          }, { merge: true });
        });
        await batch.commit();
      }

      return commentRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommenting(false);
    }
  }, [user, postId]);

  const sharePost = useCallback(async () => {
    try {
      const postUrl = `${window.location.origin}/feed?post=${postId}`;
      await navigator.clipboard.writeText(postUrl);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  }, [postId]);

  const deletePost = useCallback(async () => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();

      // Check if user is the author
      if (postData?.authorId !== user.uid) {
        throw new Error('Not authorized to delete this post');
      }

      // Delete all comments
      const commentsQuery = query(collection(db, 'posts', postId, 'comments'));
      const commentsSnapshot = await getDocs(commentsQuery);
      const deleteCommentPromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteCommentPromises);

      // Delete the post document
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, [user, postId]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) return;

    try {
      setDeletingCommentId(commentId);
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      const commentDoc = await getDoc(commentRef);
      
      if (!commentDoc.exists()) {
        throw new Error('Comment not found');
      }

      const commentData = commentDoc.data();
      if (commentData?.authorId !== user.uid) {
        throw new Error('Not authorized to delete this comment');
      }

      await deleteDoc(commentRef);
      
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: increment(-1)
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingCommentId(null);
    }
  }, [user, postId]);

  return {
    toggleLike,
    addComment,
    sharePost,
    deletePost,
    deleteComment,
    commenting,
    liking,
    deletingCommentId,
  };
} 