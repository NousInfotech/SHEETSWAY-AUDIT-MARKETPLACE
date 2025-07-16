'use client';
import { useAuth } from '@/components/layout/providers';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
// Removed unused React import

export default function Dashboard() {
  const { firebaseUser, loading } = useAuth();
  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        redirect('/auth/sign-in');
      } else {
        redirect('/dashboard/overview');
      }
    }
  }, [firebaseUser, loading]);
  return null;
}
