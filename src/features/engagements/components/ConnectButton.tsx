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
import { Button } from '@/components/ui/button'; // Import shadcn Button
import { Landmark, ShieldCheck } from 'lucide-react';

export default function ConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const returnTo = `${window.location.origin}/dashboard/banking-callback`;

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
      <Card
        className='mx-auto w-full max-w-4xl transform cursor-pointer
                   overflow-hidden rounded-xl bg-gradient-to-br from-background to-secondary p-6
                   shadow-2xl transition-all duration-500 ease-in-out
                   hover:scale-[1.02] hover:shadow-primary/30 hover:shadow-xl group'
      >
        <CardHeader className='pb-4'>
          <CardTitle className='mb-2 flex items-center gap-3 text-3xl font-extrabold text-primary'>
            <Landmark className='h-8 w-8 text-amber-500 group-hover:animate-bounce' />
            <span>Connect Your Bank Account</span>
          </CardTitle>
          <CardDescription className='text-lg leading-relaxed text-muted-foreground'>
            Securely link your bank account using Salt Edge to continue.
            <p className='mt-2 text-sm italic'>
              By connecting your account, you agree to grant read-only access.
              We will never have access to your credentials.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className='py-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='flex items-center gap-3 text-base text-card-foreground'>
              <ShieldCheck className='h-5 w-5 text-green-500' />
              <span className='font-medium'>Bank-level security</span>
            </div>
            <div className='flex items-center gap-3 text-base text-card-foreground'>
              <ShieldCheck className='h-5 w-5 text-green-500' />
              <span className='font-medium'>Your data is encrypted</span>
            </div>
            <div className='flex items-center gap-3 text-base text-card-foreground'>
              <ShieldCheck className='h-5 w-5 text-green-500' />
              <span className='font-medium'>You can disconnect at any time</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end pt-6'>
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className='relative overflow-hidden rounded-lg bg-amber-500 px-8 py-3 text-lg font-semibold text-white shadow-lg
                       transition-all duration-300 ease-out hover:scale-105 hover:bg-amber-600
                       active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                       group-hover:before:absolute group-hover:before:inset-0 group-hover:before:animate-shine'
          >
            {isLoading ? 'Connecting...' : 'Connect Your Bank'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}