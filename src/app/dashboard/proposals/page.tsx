'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { ProposalsViewPage } from '@/features/proposals/components';
import { useProposalsStore } from '@/features/proposals/store';

export default function ProposalsPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');
  const { getRequestById, getProposalsForRequest, loadRequests, loadProposals } = useProposalsStore();

  useEffect(() => {
    loadRequests();
    loadProposals();
  }, []);

  // If requestId is provided, get the specific request and its proposals
  const selectedRequest = requestId ? getRequestById(requestId) : null;
  const proposalsForRequest = requestId ? getProposalsForRequest(requestId) : [];

  return (
    <PageContainer>
      <ProposalsViewPage />
    </PageContainer>
  );
} 