import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md animate-in fade-in-50">
                <CardHeader className="items-center text-center">
                    <XCircle className="h-16 w-16 text-yellow-500" />
                    <CardTitle className="text-2xl pt-4">Payment Canceled</CardTitle>
                    <CardDescription>Your payment process was not completed.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm">
                    <p>It looks like you've canceled the payment process. Don't worry, your card has not been charged.</p>
                    <p className="text-muted-foreground mt-2">You can try the payment again from your engagements list.</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button asChild className="w-full">
                        {/* Ensure this href is the correct path to your engagements list */}
                        <Link href="/dashboard/engagements">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to My Engagements
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}