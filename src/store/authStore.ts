import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types/User';

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  init: () => Promise<(() => void) | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  loading: true,

  init: async () => {
    set({ loading: true });
    try {
      // Add auth state listener
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          if (userData) {
            set({ 
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                isAdmin: userData.isAdmin === true,
                role: userData.role || 'user',
                createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
                updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
              },
              initialized: true,
              loading: false
            });
          }
        } else {
          set({ user: null, initialized: true, loading: false });
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ initialized: true, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      if (userData) {
        const user: User = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          isAdmin: userData.isAdmin === true || userData.role === 'admin',
          role: userData.role || 'user',
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt)
        };
        set({ user });

        // Redirect based on role
        if (user.isAdmin) {
          window.location.href = '/admin';
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      set({ user: null });
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}));