// 'use client';

// import { useEffect, useState, Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// // Import your configured Axios instance
// import instance from '@/lib/axios'; // Adjust the import path if needed

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// // Your API endpoint path, which will be appended to the baseURL in your Axios config
// const ENGAGEMENT_API = '/api/v1/engagements';

// function SuccessContent() {
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get('session_id');

//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
//     'loading'
//   );
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   useEffect(() => {
//     if (!sessionId) {
//       setStatus('error');
//       setErrorMessage(
//         'No session ID found in URL. This page cannot be accessed directly.'
//       );
//       return;
//     }

//     let attempts = 0;
//     const maxAttempts = 5;
//     const pollInterval = 2000;

//     const verifyPayment = async () => {
//       attempts++;
//       console.log(
//         `Verification attempt #${attempts} for session: ${sessionId}`
//       );

//       try {
//         // Construct the full path for the API call
//         const verificationPath = `${ENGAGEMENT_API}/verify-engagement-payment/${sessionId}`;

//         console.log('Calling Axios with path:', verificationPath);

//         // --- USING AXIOS INSTEAD OF FETCH ---
//         // Your interceptors will handle the base URL, headers, and basic response parsing.
//         // We just need to call the specific endpoint.
//         const result = await instance.post(verificationPath);

//         // If the request succeeds, your response interceptor ensures `result` is valid data.
//         console.log('Verification successful:', result);
//         setStatus('success');
//         return; // Stop polling
//       } catch (error) {
//         // Your interceptors automatically convert failed API calls into rejected promises,
//         // so they will be caught here.
//         console.error('An error occurred during verification:', error);

//         if (attempts < maxAttempts) {
//           setTimeout(verifyPayment, pollInterval);
//         } else {
//           // Set the final error message from the caught error object.
//           setStatus('error');
//           setErrorMessage(
//             error instanceof Error
//               ? error.message
//               : 'Payment could not be verified.'
//           );
//         }
//       }
//     };

//     // Start the first verification attempt.
//     verifyPayment();
//   }, [sessionId]);

//   // === RENDER THE UI BASED ON THE STATUS ===

//   if (status === 'loading') {
//     return (
//       <div className='flex flex-col items-center gap-4 text-center'>
//         <Loader2 className='text-muted-foreground h-12 w-12 animate-spin' />
//         <h1 className='text-2xl font-bold'>Activating your engagement...</h1>
//         <p className='text-muted-foreground'>
//           This may take a few seconds. Please do not close this page.
//         </p>
//       </div>
//     );
//   }

//   if (status === 'error') {
//     return (
//       <Card className='animate-in fade-in-50 w-full max-w-md'>
//         <CardHeader className='items-center text-center'>
//           <XCircle className='text-destructive h-16 w-16' />
//           <CardTitle className='pt-4 text-2xl'>Verification Problem</CardTitle>
//           <CardDescription>{errorMessage}</CardDescription>
//         </CardHeader>
//         <CardFooter>
//           <Button asChild className='w-full'>
//             <Link href='/dashboard/engagements'>Go to My Engagements</Link>
//           </Button>
//         </CardFooter>
//       </Card>
//     );
//   }

//   return (
//     <Card className='animate-in fade-in-50 w-full max-w-md'>
//       <CardHeader className='items-center text-center'>
//         <CheckCircle className='h-16 w-16 text-green-500' />
//         <CardTitle className='pt-4 text-2xl'>Payment Successful!</CardTitle>
//         <CardDescription>
//           Your engagement has been activated and is ready to begin.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className='text-muted-foreground text-center text-sm'>
//         <p>You can now safely close this page or return to your dashboard.</p>
//       </CardContent>
//       <CardFooter>
//         <Button asChild className='w-full'>
//           <Link href='/dashboard/engagements'>Go to My Engagements</Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }

// // Main page component wrapping the logic in Suspense
// export default function PaymentSuccessPage() {
//   return (
//     <main className='bg-muted/40 flex min-h-screen flex-col items-center justify-center p-4'>
//       <Suspense
//         fallback={
//           <div className='flex items-center gap-2'>
//             <Loader2 className='h-5 w-5 animate-spin' />
//             <span>Loading...</span>
//           </div>
//         }
//       >
//         <SuccessContent />
//       </Suspense>
//     </main>
//   );
// }







// ################################################################################################################



'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Import your configured Axios instance
import instance from '@/lib/axios'; // Ensure this path is correct

// Your API endpoint path, which will be appended to the baseURL in your Axios config
const ENGAGEMENT_API = '/api/v1/engagements';


// This is the inner component that contains all the logic.
// We wrap it in <Suspense> so we can use `useSearchParams`.
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // State to manage the UI: loading, success, or error
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Immediately stop if there's no session ID in the URL.
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('No session ID found. This page cannot be accessed directly.');
      return;
    }

    let attempts = 0;
    const maxAttempts = 5; // We will try to verify a maximum of 5 times.
    const pollInterval = 2000; // Wait 2 seconds between attempts.

    const verifyPayment = async () => {
      attempts++;
      console.log(`Verification attempt #${attempts} for session: ${sessionId}`);

      try {
        // Construct the full path for the API call
        const verificationPath = `${ENGAGEMENT_API}/verify-engagement-payment/${sessionId}`;
        
        // Use your configured Axios instance with the POST method
        await instance.post(verificationPath);

        // If the line above does not throw an error, it means your Axios interceptor
        // determined the response was successful. We can stop polling.
        console.log("Verification successful!");
        setStatus('success');
        return; // Exit the polling loop

      } catch (error) {
        // Your Axios interceptor will automatically reject the promise on a failed
        // API call, so the error will be caught here.
        console.error(`Attempt #${attempts} failed:`, error);

        if (attempts < maxAttempts) {
          // If we haven't reached our max attempts, wait and try again.
          setTimeout(verifyPayment, pollInterval);
        } else {
          // If we've run out of attempts, show a final error message.
          setStatus('error');
          setErrorMessage(
            error instanceof Error 
            ? error.message 
            : 'Payment could not be verified after several attempts.'
          );
        }
      }
    };

    // Start the first verification attempt as soon as the component mounts.
    verifyPayment();

  }, [sessionId]); // This effect runs only once when the component mounts.


  // === RENDER THE UI BASED ON THE STATUS ===

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        <h1 className="text-2xl font-bold">Verifying your payment...</h1>
        <p className="text-muted-foreground">This may take a few seconds. Please do not close this page.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Card className="w-full max-w-md animate-in fade-in-50">
        <CardHeader className="items-center text-center">
          <XCircle className="h-16 w-16 text-destructive" />
          <CardTitle className="text-2xl pt-4">Verification Problem</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard/engagements">Go to My Engagements</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-50">
      <CardHeader className="items-center text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <CardTitle className="text-2xl pt-4">Payment Successful!</CardTitle>
        <CardDescription>Your engagement has been activated and is ready to begin.</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        <p>You can now safely close this page or return to your dashboard.</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/dashboard/engagements">Go to My Engagements</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main page component wrapping the logic in Suspense
export default function PaymentSuccessPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
            <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5"/><span>Loading...</span></div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}