'use client';

export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react'; // Import Suspense

import CenteredActionPage from '@/features/engagements/components/CenteredActionPage';

function CallbackComponent() {
  useEffect(() => {
    // Start the timer and store its ID
    const timerId = setTimeout(() => {
      // This will only run if the component is still mounted after 1000ms
      window.close();
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div>
      <CenteredActionPage
        type='error'
        title='Connection Failed!'
        message='Some thing  wentwrong while Registering Your bank.'
        buttonText='Close Tab'
      />
    </div>
  );
}

// Wrap the component in Suspense
export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackComponent />
    </Suspense>
  );
}
