'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Users, CheckCircle } from 'lucide-react';
import { useProposalsStore } from '../store';
import { Request, Proposal } from '../types';
import { RequestsTable } from './requests-table';
import { ProposalsTable } from './proposals-table';
import { RequestDetailsModal } from './request-details-modal';
import { ProposalDetailsModal } from './proposal-details-modal';
import { formatCurrency } from '../utils';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// --- MOCK DATA FOR TESTING PURPOSES ---
// --- END MOCK DATA ---

// Remove selectedRequestId, selectedRequest, proposalsForRequest from props
type ProposalsViewPageProps = {};

export function ProposalsViewPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');

  const router = useRouter();
  const {
    requests,
    proposals,
    selectedProposal,
    setSelectedProposal,
    getProposalsByStatus
  } = useProposalsStore();

  // Use real data only
  const selectedRequest = requests.find(r => r.id === requestId) || null;
  const proposalsForRequest = proposals.filter(p => p.requestId === requestId);

  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showProposalDetails, setShowProposalDetails] = useState(false);

  // Calculate statistics
  const totalRequests = requests.length;
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter(p => p.status === 'Accepted');
  const pendingProposals = proposals.filter(p => p.status === 'Pending');
  const acceptedProposalsCount = acceptedProposals.length;
  const pendingProposalsCount = pendingProposals.length;

  const handleRequestSelect = (request: Request) => {
    // Navigate to proposals page with requestId
    router.push(`/dashboard/proposals?requestId=${request.id}`);
  };

  const handleViewProposals = (request: Request) => {
    // Navigate to proposals page with requestId
    router.push(`/dashboard/proposals?requestId=${request.id}`);
  };

  const handleProposalSelect = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowProposalDetails(true);
  };

  const handleAcceptProposal = (proposal: Proposal) => {
    // In a real app, this would update the proposal status in the backend
    console.log('Accepting proposal:', proposal.id);
    // You would typically call an API here
    setShowProposalDetails(false);
  };

  const handleRejectProposal = (proposal: Proposal) => {
    // In a real app, this would update the proposal status in the backend
    console.log('Rejecting proposal:', proposal.id);
    // You would typically call an API here
    setShowProposalDetails(false);
  };

  const handleBackToRequests = () => {
    router.push('/dashboard/proposals');
  };

  // If we have a selected request, show proposals for that request
  if (requestId && selectedRequest) {
    return (
      <div className='container mx-auto py-6 space-y-6'>
        {/* Header with back button */}
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            onClick={handleBackToRequests}
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Requests
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Proposals for {selectedRequest.clientName}
            </h1>
            <p className='text-muted-foreground'>
              {selectedRequest.title}
            </p>
          </div>
        </div>

        {/* Request Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Framework</p>
                <Badge variant='outline'>{selectedRequest.framework}</Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Business Size</p>
                <Badge variant='secondary'>{selectedRequest.businessSize}</Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Budget</p>
                <p className='font-medium'>
                  {selectedRequest.budget ? formatCurrency(parseInt(selectedRequest.budget)) : 'Not specified'}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-sm text-muted-foreground'>Description</p>
              <p className='text-sm mt-1'>{selectedRequest.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Proposals for this request */}
        <Card>
          <CardHeader>
            <CardTitle>Proposals ({proposalsForRequest.length})</CardTitle>
            <CardDescription>
              Proposals submitted for this request
            </CardDescription>
          </CardHeader>
          <CardContent>
            {proposalsForRequest.length > 0 ? (
              <ProposalsTable
                proposals={proposalsForRequest}
                onProposalSelect={handleProposalSelect}
                onAcceptProposal={handleAcceptProposal}
                onRejectProposal={handleRejectProposal}
              />
            ) : (
              <div className='text-center py-8'>
                <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>No proposals yet</h3>
                <p className='text-muted-foreground'>
                  No proposals have been submitted for this request.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposal Details Modal */}
        <ProposalDetailsModal
          proposal={selectedProposal}
          isOpen={showProposalDetails}
          onClose={() => setShowProposalDetails(false)}
          onAcceptProposal={handleAcceptProposal}
          onRejectProposal={handleRejectProposal}
        />
      </div>
    );
  }

  // Default view - show all requests
  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Proposals Management</h1>
          <p className='text-muted-foreground'>
            Manage requests and review proposals from auditors
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Requests</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalRequests}</div>
            <p className='text-xs text-muted-foreground'>
              {requests.filter(r => r.status === 'Open').length} open, {requests.filter(r => r.status === 'In Progress').length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Proposals</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalProposals}</div>
            <p className='text-xs text-muted-foreground'>
              {pendingProposalsCount} pending, {acceptedProposalsCount} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Accepted Proposals</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{acceptedProposalsCount}</div>
            <p className='text-xs text-muted-foreground'>
              {((acceptedProposalsCount / totalProposals) * 100).toFixed(1)}% acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending Review</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingProposalsCount}</div>
            <p className='text-xs text-muted-foreground'>
              Require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Requests */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            Click on a request to view its proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsTable
            requests={requests}
            onRequestSelect={handleRequestSelect}
            onViewProposals={handleViewProposals}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <RequestDetailsModal
        request={null}
        isOpen={showRequestDetails}
        onClose={() => setShowRequestDetails(false)}
        onViewProposals={handleViewProposals}
      />

      <ProposalDetailsModal
        proposal={selectedProposal}
        isOpen={showProposalDetails}
        onClose={() => setShowProposalDetails(false)}
        onAcceptProposal={handleAcceptProposal}
        onRejectProposal={handleRejectProposal}
      />
    </div>
  );
} 