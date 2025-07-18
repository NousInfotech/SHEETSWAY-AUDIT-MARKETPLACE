// context/AuthContext.tsx
'use client';

import { onAuthStateChanged, getIdToken, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setToken, clearToken } from '@/lib/utils';
import React, { useEffect, useState, createContext } from 'react';
import { useTheme } from 'next-themes';
import { ActiveThemeProvider } from '../active-theme';
import { getProfile } from '@/api/user.api';

const AuthContext = createContext<{ firebaseUser: FirebaseUser | null, appUser: { id: string, name: string }, loading: boolean }>({ firebaseUser: null, appUser: { name: "", id: "" }, loading: false });

import { useRouter } from 'next/navigation'; // for App Router

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        try {
          const token = await getIdToken(user);
          setToken(token);

          const data = await getProfile(); // attempt to get app profile
          setAppUser(data);
          setFirebaseUser(user);
        } catch (err) {
          console.error('No profile found or error occurred:', err);
          clearToken(); // remove invalid token
          setFirebaseUser(null);
          setAppUser(null);
          router.push('/signup'); // redirect to signup page
        } finally {
          setLoading(false);
        }
      } else {
        clearToken();
        setFirebaseUser(null);
        setAppUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>
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
