// import { createSessionForSaltedge } from '@/api/salt-edge';
// import { useAuth } from '@/components/layout/providers';
// import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback

// function BankingDataView() {
//   const { appUser, loading: authLoading } = useAuth();
//   // Start in a loading state to prevent UI flicker
//   const [currentPageLoading, setCurrentPageLoading] = useState(true);

//   // FIX #3: Wrap the function in useCallback to make it a stable dependency
//   const getSaltEdge = useCallback(async (user: any) => {
//     setCurrentPageLoading(true);
//     try {
//       // The parameter is the entire user object, as your backend expects
//       const result = await createSessionForSaltedge({ user });

//       // FIX #1: Read the connect_url from the nested 'data' object
//       if (result &&  result.connect_url) {
//         // Redirect the user to the Salt Edge page
//         window.location.href = result.connect_url;
//       } else {
//         // This will now correctly catch if the response format is wrong
//         console.error(
//           'Failed to retrieve connect_url from the API response.',
//           result
//         );
//         setCurrentPageLoading(false); // Stop loading on error
//       }
//     } catch (error) {
//       console.error('Error creating Salt Edge session:', error);
//       setCurrentPageLoading(false); // Stop loading on error
//     } finally {
//       // FIX #2: Set loading to FALSE. (Though in a redirect, this may not run, it's crucial for error cases)
//       setCurrentPageLoading(false);
//     }
//   }, []); // Empty dependency array means this function is created only once

//   useEffect(() => {
//     if (!authLoading && appUser?.id) {
//       const timer = setTimeout(() => {
//         getSaltEdge(appUser);
//       }, 100);

//       return () => clearTimeout(timer);
//     }

//     // If there's no user after auth is done, stop loading.
//     if (!authLoading && !appUser?.id) {
//       setCurrentPageLoading(false);
//     }
//   }, [authLoading, appUser, getSaltEdge]); // appUser is needed here now

//   if (authLoading || currentPageLoading) {
//     return (
//       <div className='flex h-[80vh] w-full items-center justify-center'>
//         <div className='classic-loader' />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Banking Data</h1>
//       <p>
//         If you see this, the redirection failed. Check the console for errors.
//       </p>
//     </div>
//   );
// }

// export default BankingDataView;

// ##########################################################################################################

import { createSessionForSaltedge } from '@/api/salt-edge';
import { useAuth } from '@/components/layout/providers';
import React, { useState, useCallback } from 'react'; // Removed useEffect
import { ConnectBankCard } from './ConnectBankCard';

function BankingDataView() {
  const { appUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectClick = useCallback(async () => {
    if (!appUser) return;

    setIsLoading(true);
    try {
      const result = await createSessionForSaltedge({ user: appUser });

      if (result && result.connect_url) {
        window.open(result.connect_url, '_blank');
      } else {
        console.error(
          'Failed to retrieve connect_url from the API response.',
          result
        );
      }
    } catch (error) {
      console.error('Error creating Salt Edge session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [appUser]);

  if (authLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <div className='classic-loader' />
      </div>
    );
  }

  return (
    <div className='bg-muted/20 rounded-xl flex w-full items-center justify-center p-4'>
      <ConnectBankCard isLoading={isLoading} onConnect={handleConnectClick} />
    </div>
  );
}

export default BankingDataView;
