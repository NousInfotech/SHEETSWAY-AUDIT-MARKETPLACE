'use client';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import EngagementViewPage from '@/features/engagements/engagement-view-page';
import { useClientEngagementStore } from '@/features/engagements/store';
import { useEffect } from 'react';

export default function Page() {
  const { appUser, loading: authLoading } = useAuth();
  const {
    loadClientEngagements,
    loading: engagementsLoading,
    clientEngagements
  } = useClientEngagementStore();

  useEffect(() => {
    // Wait for auth to finish, then fetch if we have a user
    if (!authLoading && appUser?.id) {
      // This tiny delay is imperceptible to the user but is more than enough
      // time for the AuthProvider to finish writing the new token to storage
      // before the axios interceptor tries to read it.
      const timer = setTimeout(() => {
        loadClientEngagements(appUser.id);
      }, 100); // A 100ms delay is a good starting point.

      // React best practice: clean up the timer
      return () => clearTimeout(timer);
    }
  }, [authLoading, appUser?.id, loadClientEngagements]);

  // Show a spinner for either auth or data fetching
  if (authLoading || engagementsLoading) {
    return (
      <>
        <div className='flex h-[80vh] w-full items-center justify-center'>
          <div className='classic-loader' />
        </div>
      </>
    );
  }
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <EngagementViewPage />
      </div>
    </PageContainer>
  );
}
