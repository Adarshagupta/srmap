"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, UserPlus2, UserMinus2, Check } from 'lucide-react';

interface ConnectionButtonProps {
  personId: string;
}

export function ConnectionButton({ personId }: ConnectionButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;

      try {
        // Check if there's a connection
        const connectionRef = doc(db, 'connections', `${user.uid}_${personId}`);
        const connectionDoc = await getDoc(connectionRef);
        
        // Check if there's a pending request
        const pendingRef = doc(db, 'connectionRequests', `${user.uid}_${personId}`);
        const pendingDoc = await getDoc(pendingRef);

        setIsConnected(connectionDoc.exists());
        setIsPending(pendingDoc.exists());
      } catch (error) {
        console.error('Error checking connection:', error);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, [user, personId]);

  const handleConnect = async () => {
    if (!user) return;

    try {
      setLoading(true);
      if (isConnected) {
        // Remove connection
        await deleteDoc(doc(db, 'connections', `${user.uid}_${personId}`));
        await deleteDoc(doc(db, 'connections', `${personId}_${user.uid}`));
        setIsConnected(false);
        toast({
          title: "Disconnected",
          description: "You are no longer connected with this person",
        });
      } else if (isPending) {
        // Cancel request
        await deleteDoc(doc(db, 'connectionRequests', `${user.uid}_${personId}`));
        setIsPending(false);
        toast({
          title: "Request Cancelled",
          description: "Connection request has been cancelled",
        });
      } else {
        // Send connection request
        const requestRef = doc(db, 'connectionRequests', `${user.uid}_${personId}`);
        await setDoc(requestRef, {
          from: user.uid,
          to: personId,
          createdAt: new Date(),
        });
        setIsPending(true);
        toast({
          title: "Request Sent",
          description: "Connection request has been sent",
        });
      }
    } catch (error) {
      console.error('Error managing connection:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (isConnected) {
    return (
      <Button 
        variant="outline"
        onClick={handleConnect}
        className="text-green-600 hover:text-red-600"
      >
        <Check className="h-4 w-4 mr-2" />
        Connected
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button 
        variant="outline"
        onClick={handleConnect}
      >
        <UserMinus2 className="h-4 w-4 mr-2" />
        Pending
      </Button>
    );
  }

  return (
    <Button 
      variant="default"
      onClick={handleConnect}
    >
      <UserPlus2 className="h-4 w-4 mr-2" />
      Connect
    </Button>
  );
} 