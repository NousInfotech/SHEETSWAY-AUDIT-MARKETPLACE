'use client';

export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react'; // Import Suspense

import CenteredActionPage from '@/features/engagements/components/CenteredActionPage';

function CallbackComponent() {
  useEffect(() => {
    // Close the tab automatically after the half second
    const timer  = setTimeout(() => {}, 500)
    window.close();
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
