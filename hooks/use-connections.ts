"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { createNotification } from './use-notifications';

export type ConnectionStatus = 'none' | 'pending' | 'connected';

interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  participants: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useConnections(targetUserId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('none');
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    if (!user || !targetUserId) return;

    const q = query(
      collection(db, 'connections'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const connectionDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Connection[];
      setConnections(connectionDocs);

      // Find connection with target user
      const connection = connectionDocs.find(
        c => (c.senderId === targetUserId && c.receiverId === user.uid) || 
             (c.senderId === user.uid && c.receiverId === targetUserId)
      );

      if (connection) {
        setConnectionStatus(connection.status);
      } else {
        setConnectionStatus('none');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, targetUserId]);

  const sendConnectionRequest = useCallback(async (receiverId: string) => {
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      // Get sender's data for notification
      const senderDoc = await getDoc(doc(db, 'users', user.uid));
      if (!senderDoc.exists()) {
        console.error('Sender document not found');
        return;
      }
      const senderData = senderDoc.data();
      
      // Create connection document
      const connectionData = {
        senderId: user.uid,
        receiverId,
        status: 'pending',
        participants: [user.uid, receiverId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const connectionRef = await addDoc(collection(db, 'connections'), connectionData);

      // Create notification for receiver using the createNotification function
      await createNotification({
        userId: receiverId,
        type: 'connection_request',
        fromUserId: user.uid,
        fromUserName: senderData?.name || 'A user',
      });

      toast({
        title: "Success",
        description: "Connection request sent",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const acceptConnectionRequest = useCallback(async (connectionId: string) => {
    if (!user) return;

    try {
      const connectionRef = doc(db, 'connections', connectionId);
      const connectionDoc = await getDoc(connectionRef);
      const connectionData = connectionDoc.data();
      
      if (!connectionData) {
        throw new Error('Connection not found');
      }

      await updateDoc(connectionRef, {
        status: 'connected',
        updatedAt: serverTimestamp(),
      });

      // Get accepter's name for notification
      const accepterDoc = await getDoc(doc(db, 'users', user.uid));
      const accepterData = accepterDoc.data();

      // Delete existing connection request notifications
      const oldNotificationsQuery = query(
        collection(db, 'notifications'),
        where('connectionId', '==', connectionId),
        where('type', '==', 'connection_request')
      );
      const oldNotificationsSnapshot = await getDocs(oldNotificationsQuery);
      const deletePromises = oldNotificationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Create notification for the original sender
      await createNotification({
        userId: connectionData.senderId,
        type: 'connection_accepted',
        fromUserId: user.uid,
        fromUserName: accepterData?.name || 'A user',
      });

      toast({
        title: "Success",
        description: "Connection request accepted",
      });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const removeConnection = useCallback(async (connectionId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'connections', connectionId));
      toast({
        title: "Success",
        description: "Connection removed",
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const cancelConnectionRequest = useCallback(async (connectionId: string) => {
    if (!user) return;

    try {
      const connectionRef = doc(db, 'connections', connectionId);
      const connectionDoc = await getDoc(connectionRef);
      const connectionData = connectionDoc.data();
      
      // Delete the connection document
      await deleteDoc(connectionRef);

      // Delete any related notifications
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('connectionId', '==', connectionId)
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const deletePromises = notificationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      toast({
        title: "Success",
        description: "Connection request cancelled",
      });
    } catch (error) {
      console.error('Error cancelling connection request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel connection request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  return {
    connectionStatus,
    loading,
    connections,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection,
    cancelConnectionRequest,
  };
} 