"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
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

interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'profile_update';
  fromUserId: string;
  fromUserName: string;
  read: boolean;
  createdAt: Date;
}

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Notification[];

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);

    switch (notification.type) {
      case 'connection_request':
      case 'connection_accepted':
        router.push(`/profile/${notification.fromUserId}`);
        break;
      case 'profile_update':
        router.push(`/profile/${notification.fromUserId}`);
        break;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'connection_request':
        return `${notification.fromUserName} sent you a connection request`;
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
              <p className="text-sm font-medium">
                {getNotificationText(notification)}
              </p>
              <p className="text-xs text-muted-foreground">
                {notification.createdAt?.toLocaleDateString()} {notification.createdAt?.toLocaleTimeString()}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 