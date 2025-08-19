'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/layout/providers';
import { Payment } from '@/features/payments/types/payment';

import { PaymentList as PaymentTableList } from '@/features/payments/components/PaymentList';
import { PaymentCardList } from '@/features/payments/components/PaymentCardList';
import { PaymentAccordionList } from '@/features/payments/components/PaymentAccordionList';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listClientPayments } from '@/api/payment';

export default function PaymentsPage() {
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const { appUser, loading: authLoading } = useAuth();
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchPayments = useCallback(async (role: string, roleId: string) => {
    setPaymentLoading(true);
    try {
      const payments = await listClientPayments(role, roleId);
      setPaymentData(payments);
    } catch (error) {
      console.error(error);
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && appUser?.id) {
      fetchPayments('USER', appUser.id);
    } else if (!authLoading) {
      setPaymentLoading(false);
    }
  }, [authLoading, appUser?.id, fetchPayments]);

  const renderContent = () => {
    if (authLoading || paymentLoading) {
      return (
        <div className='flex h-[80vh] w-full items-center justify-center'>
          <div className='classic-loader' />
        </div>
      );
    }

    if (paymentData.length > 0) {
      return (
        <Tabs defaultValue='card' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 md:w-[400px]'>
            <TabsTrigger value='card'>Card View</TabsTrigger>
            <TabsTrigger value='list'>List View</TabsTrigger>
            <TabsTrigger value='table'>Table View</TabsTrigger>
          </TabsList>

          <TabsContent value='card' className='mt-4'>
            <PaymentCardList payments={paymentData} />
          </TabsContent>
          <TabsContent value='list' className='mt-4'>
            <PaymentAccordionList payments={paymentData} />
          </TabsContent>
          <TabsContent value='table' className='mt-4'>
            <PaymentTableList payments={paymentData} />
          </TabsContent>
        </Tabs>
      );
    }

    return <p>No payments found.</p>;
  };

  return <main className='container mx-auto p-4'>{renderContent()}</main>;
}
