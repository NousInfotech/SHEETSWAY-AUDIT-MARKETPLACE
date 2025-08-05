'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { ProposalsViewPage } from '@/features/proposals/components';
import { useProposalsStore } from '@/features/proposals/store';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/components/layout/providers';

export default function ProposalsPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');
  const {
    getRequestById,
    getProposalsForRequest,
    loadRequests,
    loadProposals,
    loading
  } = useProposalsStore();
  const { appUser } = useAuth();

  useEffect(() => {
    if (appUser?.id) {
      loadRequests(appUser.id);
    }
    loadProposals();
  }, [appUser?.id]);

  if (loading) {
    return (
      // <div className="flex items-center justify-center min-h-[60vh]">
      //   <Spinner size={48} className="text-primary" />
      // </div>
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <div className='classic-loader' />
      </div>
    );
  }

  // If requestId is provided, get the specific request and its proposals
  const selectedRequest = requestId ? getRequestById(requestId) : null;
  const proposalsForRequest = requestId
    ? getProposalsForRequest(requestId)
    : [];

  return (
    <PageContainer>
      <ProposalsViewPage />
    </PageContainer>
  );
}
