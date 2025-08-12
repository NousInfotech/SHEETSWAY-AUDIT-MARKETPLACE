// context/AuthContext.tsx
'use client';

import {
  onAuthStateChanged,
  getIdToken,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setToken, clearToken } from '@/lib/utils';
import React, { useEffect, useState, createContext } from 'react';
import { useTheme } from 'next-themes';
import { ActiveThemeProvider } from '../active-theme';
import { getProfile } from '@/api/user.api';
import { usePathname, useRouter } from 'next/navigation';

type AppUser = { id: string; name: string };

const AuthContext = createContext<{
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  setProfile: (user?: FirebaseUser) => Promise<void>;
}>({
  firebaseUser: null,
  appUser: null,
  loading: false,
  setProfile: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname.startsWith('/auth');

  const setProfile = async (userArg?: FirebaseUser) => {
    const user = userArg ?? auth.currentUser;
    if (!user) return;

    try {
      const token = await getIdToken(user);
      setToken(token);

      // Avoid fetching profile on signup
      if (pathname !== '/auth/sign-up') {
        const data = await getProfile(); // custom app profile
        setAppUser(data);
        setFirebaseUser(user);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      clearToken();
      setFirebaseUser(null);
      setAppUser(null);

      if (!isAuthRoute) {
        router.push('/auth/sign-in');
      }
    }
  };

  useEffect(() => {
    if (pathname === '/auth/sign-up' || pathname === '/auth/sign-in') {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await setProfile(user);
        } else {
          clearToken();
          setFirebaseUser(null);
          setAppUser(null);
        }
      } catch (error) {
        console.error('An error occurred during auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{ firebaseUser, appUser, loading, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(AuthContext);
}

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();
  // resolvedTheme is used for theme detection but not directly used in this component

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthProvider>{children}</AuthProvider>
      </ActiveThemeProvider>
    </>
  );
}
