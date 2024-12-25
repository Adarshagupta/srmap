"use client";

import { useState, useEffect } from 'react';
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

interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'profile_update';
  fromUserId: string;
  fromUserName: string;
  read: boolean;
  createdAt: any;
  connectionId?: string;
  senderId?: string;
}

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { acceptConnectionRequest, cancelConnectionRequest } = useConnections(user?.uid || '');

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

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    router.push(`/profile/${notification.fromUserId}`);
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'connection_request':
        return (
          <div className="flex flex-col">
            <p><span className="font-semibold">{notification.fromUserName}</span> sent you a connection request</p>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="default" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (notification.connectionId) {
                    acceptConnectionRequest(notification.connectionId);
                    markAsRead(notification.id);
                  }
                }}
              >
                Accept
              </Button>
              {notification.senderId === user?.uid && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (notification.connectionId) {
                      cancelConnectionRequest(notification.connectionId);
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        );
      case 'connection_accepted':
        return `${notification.fromUserName} accepted your connection request`;
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