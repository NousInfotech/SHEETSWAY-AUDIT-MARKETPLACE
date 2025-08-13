'use client';

import { createPayment } from '@/api/engagement';
import { useAuth } from '@/components/layout/providers';
import { ENGAGEMENT_API } from '@/config/api';
import instance from '@/lib/axios';
import React, { useEffect } from 'react';

function Page() {
  const { appUser, loading: authLoading } = useAuth();
  useEffect(() => {
    // Wait for auth to finish, then fetch if we have a user
    if (!authLoading && appUser?.id) {
      let userId = appUser.id;
      // This tiny delay is imperceptible to the user but is more than enough
      // time for the AuthProvider to finish writing the new token to storage
      // before the axios interceptor tries to read it.
      const timer = setTimeout(() => {
        const data = createPayment({ userId });
        console.log(data);
      }, 100); // A 100ms delay is a good starting point.

      // React best practice: clean up the timer
      return () => clearTimeout(timer);
    }
  }, [authLoading, appUser?.id, createPayment]);

  // Show a spinner for either auth or data fetching
  if (authLoading) {
    return (
      <>
        <div className='flex h-[80vh] w-full items-center justify-center'>
          <div className='classic-loader' />
        </div>
      </>
    );
  }

  return <div>PAYMENT PAGE</div>;
}

export default Page;
