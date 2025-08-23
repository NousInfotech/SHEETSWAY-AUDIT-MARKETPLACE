// src/features/engagements/components/ConnectButton.tsx
'use client';

import { useState } from 'react';

import { createConnectSession } from '@/api/salt-edge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Landmark, ShieldCheck } from 'lucide-react';

export default function ConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // const returnTo = `${window.location.origin}/dashboard/banking-callback`;
      const returnTo = "";

      const session = await createConnectSession(returnTo);

      window.open(session.connect_url, '_blank');
    } catch (error) {
      console.error('Failed to create connect session:', error);
      alert('Failed to connect to bank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className='mx-auto w-full max-w-4xl shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Landmark className='h-6 w-6' />
            <span>Connect Your Bank Account</span>
          </CardTitle>
          <CardDescription>
            Securely link your bank account using Salt Edge to continue.
            <p className='text-muted-foreground text-sm'>
              By connecting your account, you agree to grant read-only access.
              We will never have access to your credentials.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <ul className='space-y-4 text-sm'>
              <li className='flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-green-500' />
                <span>Bank-level security</span>
              </li>
              <li className='flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-green-500' />
                <span>Your data is encrypted</span>
              </li>
              <li className='flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-green-500' />
                <span>You can disconnect at any time</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end'>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className='rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50'
          >
            {isLoading ? 'Connecting...' : 'Connect Your Bank'}
          </button>
        </CardFooter>
      </Card>
    </>
  );
}
