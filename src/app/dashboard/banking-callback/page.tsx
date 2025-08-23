// src/app/dashboard/banking-callback/page.tsx

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, Suspense, useState } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

import CenteredActionPage from '@/features/engagements/components/CenteredActionPage';

function CallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use the hook

  useEffect(() => {
    const connectionId = searchParams.get('connection_id');
    if (connectionId) {
      localStorage.setItem('saltedge_connection_id', connectionId);

      // Fire a custom event that the other tab can listen for
      window.dispatchEvent(new CustomEvent('saltedge_connected'));

      // Close the tab
      window.close();
    }
  }, [searchParams]);

  return (
    // <div className='flex h-[100%] items-center justify-center'>
    //   <div className='text-center'>
    //     <h1 className='text-xl font-semibold'>Processing connection...</h1>
    //     <p>Please wait while we complete your bank connection...</p>
    //     <p className='text-red-400'>
    //       Once Completed you will redirected to your dashboard...
    //     </p>
    //   </div>
    // </div>

    <div>
      <CenteredActionPage
        type='success'
        title='Connection Successful!'
        message="Your bank has been successfully registered."
        buttonText='Close Tab'
      />
    </div>
  );
}

// Wrap the component in Suspense
export default function CallbackPage() {
  const [showSuccess, setShowSuccess] = useState(true);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackComponent />
    </Suspense>
  );
}
