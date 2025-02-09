import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.email);
      
      if (!user) {
        console.log('No user found, setting state to not admin');
        setState({
          user: null,
          loading: false,
          isAdmin: false,
        });
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        console.log('User data:', userData);
        const isAdmin = userDoc.exists() && userData?.role === 'admin';
        console.log('Is admin?', isAdmin);

        setState({
          user,
          loading: false,
          isAdmin,
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
        setState({
          user,
          loading: false,
          isAdmin: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
} 