"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
    const router = useRouter();
  return (
    <main className='bg-muted/40 flex min-h-screen flex-col items-center justify-center p-4'>
      <Card className='animate-in fade-in-50 w-full max-w-md'>
        <CardHeader className='items-center text-center'>
          <XCircle className='h-16 w-16 text-yellow-500' />
          <CardTitle className='pt-4 text-2xl'>Payment Canceled</CardTitle>
          <CardDescription>
            Your payment process was not completed.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center text-sm'>
          <p>
            It looks like you've canceled the payment process. Don't worry, your
            card has not been charged.
          </p>
          <p className='text-muted-foreground mt-2'>
            You can try the payment again from your engagements list.
          </p>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button onClick={() => router.push("/dashboard/engagements")} className='w-full'>
            {/* Ensure this href is the correct path to your engagements list */}
            <ArrowLeft className='mr-2 h-4 w-4' />
            Return to My Engagements
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
