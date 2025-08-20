'use client';
import { getEscrowbyEngagementId, getPaymentEscrow } from '@/api/engagement';
import { useAuth } from '@/components/layout/providers';
import React, { useEffect, useState } from 'react';
import EscrowCard from './EscrowCard';

const Loader = () => (
  <div className='flex items-center justify-center p-10 h-[50vh]'>
    <div className='h-8 w-8 animate-spin rounded-full border-4 border-dashed border-amber-500'></div>
  </div>
);

export default function PaymentEscrowTab({ engagement }: any) {
  const { appUser, loading: authLoading } = useAuth();

  const [paymentEscrowLoading, setPaymentEscrowLoading] = useState(false);
  // It's good practice to provide a type for your state
  const [paymentEscrowData, setPaymentEscrowData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentsEscrow = async (engagementId: string) => {
      if (!appUser?.id || !engagementId) return;

      setPaymentEscrowLoading(true);
      setError(null);
      try {
        // 1. Get the initial list of escrows
        const initialEscrows = await getEscrowbyEngagementId({ engagementId });

        if (!initialEscrows || initialEscrows.length === 0) {
          setPaymentEscrowData([]);
          return;
        }

        // 2. Create an array of promises to get payment details
        const paymentDetailPromises = initialEscrows.map((escrow: any) =>
          getPaymentEscrow({ paymentId: escrow.paymentId })
        );

        // 3. Wait for ALL promises to resolve
        const resolvedPaymentDetails = await Promise.all(paymentDetailPromises);

        // 4. (YOUR CHANGE) Set the state to ONLY the resolved payment details
        setPaymentEscrowData(resolvedPaymentDetails.flat());
      } catch (error: any) {
        console.error(error);
        setError('Failed to fetch payment details.');
      } finally {
        setPaymentEscrowLoading(false);
      }
    };

    if (!authLoading && appUser?.id) {
      fetchPaymentsEscrow(engagement?.id);
    }
  }, [authLoading, appUser, engagement?.id]);

  useEffect(() => {
    if (paymentEscrowData.length > 0) {
      console.log('Payment Escrow Data has been updated', paymentEscrowData);
    }
  }, [paymentEscrowData]);

  // --- RENDER LOGIC ---
  if (paymentEscrowLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className='p-4 text-center text-red-500'>{error}</div>;
  }

  return (
    <div>
      <h2 className='mb-6 text-2xl font-bold text-gray-800'>Payment Details</h2>
      {paymentEscrowData.length > 0 ? (
        <div>
          {paymentEscrowData.map((escrowItem) => (
            // The root 'id' is perfect for the React key
            <EscrowCard key={escrowItem.id} escrow={escrowItem} />
          ))}
        </div>
      ) : (
        <p>No payment data available.</p>
      )}
    </div>
  );
}
