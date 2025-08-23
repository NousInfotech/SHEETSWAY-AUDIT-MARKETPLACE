// src/app/dashboard/banking-callback/page.tsx

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

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
    <div className="flex items-center justify-center h-[100%]">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Processing connection...</h1>
        <p>Please wait while we complete your bank connection...</p>
        <p className='text-red-400'>Once Completed you will redirected to your dashboard...</p>
      </div>
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