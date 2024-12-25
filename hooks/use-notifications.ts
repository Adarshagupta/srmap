"use client";

import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useToast } from '@/components/ui/use-toast';

export async function createNotification({
  userId,
  type,
  fromUserId,
  fromUserName,
}: {
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'profile_update';
  fromUserId: string;
  fromUserName: string;
}) {
  try {
    // Get user's FCM token
    const userDoc = await getDoc(doc(db, 'users', userId));
    const fcmToken = userDoc.data()?.fcmToken;

    // Create notification in Firestore
    await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      fromUserId,
      fromUserName,
      read: false,
      createdAt: serverTimestamp(),
    });

    // If user has FCM token, send push notification
    if (fcmToken) {
      // Call your backend API to send push notification
      await fetch('/api/send-push-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: fcmToken,
          title: 'New Notification',
          body: `${fromUserName} ${type === 'connection_request' ? 'sent you a connection request' : 
                 type === 'connection_accepted' ? 'accepted your connection request' : 
                 'updated their profile'}`,
        }),
      });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export function useNotifications(userId: string | undefined) {
  const { toast } = useToast();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize Firebase Cloud Messaging
    const initializePushNotifications = async () => {
      try {
        const messaging = getMessaging();
        
        // Request permission and get token
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          
          setFcmToken(token);

          // Save token to user document
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            fcmToken: token,
          });
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          toast({
            title: payload.notification?.title,
            description: payload.notification?.body,
          });
        });
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    initializePushNotifications();
  }, [userId, toast]);

  return { fcmToken };
} 