// context/AuthContext.tsx
'use client';

import { onAuthStateChanged, getIdToken, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setToken, clearToken } from '@/lib/utils';
import React, { useEffect, useState, createContext } from 'react';
import { useTheme } from 'next-themes';
import { ActiveThemeProvider } from '../active-theme';
import { getProfile } from '@/api/user.api';
import { setUser } from '@sentry/nextjs';

const AuthContext = createContext<{ firebaseUser: FirebaseUser | null, appUser: { id: string, name: string } }>({ firebaseUser: null, appUser: { name: "", id: "" } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        setToken(token);
        const data = await getProfile();
        setAppUser(data);
        setFirebaseUser(user);
      } else {
        clearToken();
        setFirebaseUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ firebaseUser, appUser }}>{children}</AuthContext.Provider>;
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
