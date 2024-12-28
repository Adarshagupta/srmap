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
  createdAt: Date | null;
  connectionId?: string;
  status?: 'pending' | 'accepted' | 'declined';
}

const notificationSound = new Audio('/notification.mp3');
let hasUserInteracted = false;

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { acceptConnectionRequest, cancelConnectionRequest } = useConnections(user?.uid || '');
  const previousNotificationsRef = useRef<string[]>([]);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() // Convert Firestore Timestamp to Date
        };
      }) as Notification[];

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);

      // Check for new notifications and play sound
      if (hasUserInteracted && newNotifications.length > 0) {
        const currentNotificationIds = newNotifications.map(n => n.id);
        const hasNewNotification = currentNotificationIds.some(
          id => !previousNotificationsRef.current.includes(id)
        );

        if (hasNewNotification) {
          notificationSound.play().catch((error: Error) => {
            console.error('Error playing notification sound:', error);
          });
        }

        previousNotificationsRef.current = currentNotificationIds;
      }
    });

    // Initialize Firebase messaging
    const initMessaging = async () => {
      try {
        const messaging = getMessaging();
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });
        
        if (token) {
          setFcmToken(token);
          // Update user's FCM token in Firestore
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            fcmToken: token
          });
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          if (hasUserInteracted) {
            notificationSound.play().catch((error: Error) => {
              console.error('Error playing notification sound:', error);
            });
          }
          
          // Show toast notification
          toast({
            title: payload.notification?.title || 'New Notification',
            description: payload.notification?.body,
          });
        });
      } catch (error) {
        console.error('Error initializing messaging:', error);
      }
    };

    initMessaging();
    return () => unsubscribe();
  }, [user]);

  // Initialize notification sound on first user interaction
  useEffect(() => {
    const initSound = () => {
      if (!hasUserInteracted) {
        hasUserInteracted = true;
        notificationSound.load();
      }
    };

    window.addEventListener('click', initSound);
    window.addEventListener('keydown', initSound);
    window.addEventListener('touchstart', initSound);

    return () => {
      window.removeEventListener('click', initSound);
      window.removeEventListener('keydown', initSound);
      window.removeEventListener('touchstart', initSound);
    };
  }, []);

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