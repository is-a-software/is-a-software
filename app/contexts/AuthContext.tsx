"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import { auth, githubProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authDisabled: boolean;
  clearAuthDisabled: () => void;
  signInWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authDisabled, setAuthDisabled] = useState(false);
  // read persisted flag on mount
  useEffect(() => {
    try {
      const v = localStorage.getItem('authDisabled');
      if (v) setAuthDisabled(true);
    } catch {}
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

    const signInWithGitHub = async () => {
    console.log('🔐 Starting GitHub sign-in with popup...');
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log('✅ Popup sign-in successful:', result.user?.email);
      // Clear any previous disabled flag on successful login
      setAuthDisabled(false);
      try { localStorage.removeItem('authDisabled'); } catch {}
    } catch (e: unknown) {
      console.error('💥 Popup sign-in error:', e);
      // Detect Firebase 'user-disabled' error during sign-in
      const err = e as { code?: string };
      if (err?.code === 'auth/user-disabled') {
        console.log('🚫 User account disabled');
        setAuthDisabled(true);
        try { localStorage.setItem('authDisabled', '1'); } catch {}
      }
      throw e;
    }
  };



  const logout = async () => {
    await signOut(auth);
  };

  const clearAuthDisabled = () => {
    setAuthDisabled(false);
    try { localStorage.removeItem('authDisabled'); } catch {}
  };

  const value = {
    user,
    loading,
    authDisabled,
    clearAuthDisabled,
    signInWithGitHub,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
