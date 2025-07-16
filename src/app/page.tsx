// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import { useAuth } from '@/components/layout/providers';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
// Removed unused React import

export default function Page() {
  const { appUser, loading } = useAuth();
  useEffect(() => {
    if (!loading) {
      if (!appUser) {
        redirect('/auth/sign-in');
      } else {
        redirect('/dashboard/overview');
      }
    }
  }, [appUser, loading]);
  return null;
}
