"use client";

import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './auth-provider';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useConnections } from '@/hooks/use-connections';
import { toast } from '@/components/ui/use-toast';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'profile_update';
  fromUserId: string;
  fromUserName: string;
  read: boolean;
  createdAt: any;
  connectionId?: string;
  status?: 'pending' | 'accepted' | 'declined';
}

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { acceptConnectionRequest, cancelConnectionRequest } = useConnections(user?.uid || '');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousNotificationsRef = useRef<string[]>([]);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      console.log('No user found in notifications component');
      return;
    }

    console.log('Setting up notifications listener for user:', user.uid);

    // Subscribe to notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    console.log('Created notifications query:', q);

    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Received notifications snapshot. Metadata:', {
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: snapshot.metadata.hasPendingWrites,
          size: snapshot.size
        });
        
        const notifs = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Processing notification:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
          };
        }) as Notification[];

        // Check for new notifications and play sound
        const currentNotificationIds = notifs.map(n => n.id);
        const previousNotificationIds = previousNotificationsRef.current;
        const hasNewNotifications = currentNotificationIds.some(id => !previousNotificationIds.includes(id));
        
        if (hasNewNotifications && audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error('Error playing notification sound:', error);
          });
        }

        previousNotificationsRef.current = currentNotificationIds;
        console.log('Processed notifications:', notifs.length);
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      }, (error) => {
        console.error('Error in notifications snapshot:', error);
      });

      return () => {
        console.log('Cleaning up notifications listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
    }
  }, [user]);

  // Initialize push notifications
  useEffect(() => {
    if (!user) return;

    const initializePushNotifications = async () => {
      try {
        const messaging = getMessaging();
        
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Get FCM token
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          
          setFcmToken(token);

          // Save token to user document
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            fcmToken: token,
          });

          // Handle foreground messages
          onMessage(messaging, (payload) => {
            // Play notification sound
            if (audioRef.current) {
              audioRef.current.play().catch(error => {
                console.error('Error playing notification sound:', error);
              });
            }

            // Show toast notification
            toast({
              title: payload.notification?.title || 'New Notification',
              description: payload.notification?.body,
            });
          });
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    initializePushNotifications();
  }, [user]);

  const updateNotificationStatus = async (notificationId: string, status: 'accepted' | 'declined') => {
    if (!user) return;
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { status, read: true });
  };

  const handleNotificationClick = async (notification: Notification) => {
    await updateNotificationStatus(notification.id, 'accepted');
    router.push(`/profile/${notification.fromUserId}`);
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'connection_request':
        if (notification.status === 'accepted') {
          return (
            <div className="flex flex-col">
              <p><span className="font-semibold">{notification.fromUserName}</span> sent you a connection request</p>
              <p className="text-xs text-green-600 mt-1">✓ Accepted</p>
            </div>
          );
        }
        if (notification.status === 'declined') {
          return (
            <div className="flex flex-col">
              <p><span className="font-semibold">{notification.fromUserName}</span> sent you a connection request</p>
              <p className="text-xs text-red-600 mt-1">✕ Declined</p>
            </div>
          );
        }
        return (
          <div className="flex flex-col">
            <p><span className="font-semibold">{notification.fromUserName}</span> sent you a connection request</p>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="default" 
                className="flex-1"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (notification.connectionId) {
                    try {
                      await acceptConnectionRequest(notification.connectionId);
                      await updateNotificationStatus(notification.id, 'accepted');
                      toast({
                        title: "Success",
                        description: "Connection request accepted",
                      });
                    } catch (error) {
                      console.error('Error accepting connection:', error);
                      toast({
                        title: "Error",
                        description: "Failed to accept connection request",
                        variant: "destructive",
                      });
                    }
                  }
                }}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                className="flex-1"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (notification.connectionId) {
                    try {
                      await cancelConnectionRequest(notification.connectionId);
                      await updateNotificationStatus(notification.id, 'declined');
                      toast({
                        title: "Success",
                        description: "Connection request declined",
                      });
                    } catch (error) {
                      console.error('Error declining connection:', error);
                      toast({
                        title: "Error",
                        description: "Failed to decline connection request",
                        variant: "destructive",
                      });
                    }
                  }
                }}
              >
                Decline
              </Button>
            </div>
          </div>
        );
      case 'connection_accepted':
        return (
          <div className="flex flex-col">
            <p><span className="font-semibold">{notification.fromUserName}</span> accepted your connection request</p>
            <p className="text-xs text-green-600 mt-1">✓ Connected</p>
          </div>
        );
      case 'profile_update':
        return `${notification.fromUserName} updated their profile`;
      default:
        return 'New notification';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-4 space-y-1 cursor-pointer ${
                !notification.read ? 'bg-muted/50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="w-full">
                {getNotificationText(notification)}
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.createdAt?.toLocaleDateString()} {notification.createdAt?.toLocaleTimeString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 