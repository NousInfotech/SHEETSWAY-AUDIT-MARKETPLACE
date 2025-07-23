'use client';

import { useState, useEffect } from 'react';
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
import { useSearchParams } from 'next/navigation';
import { getBusinessProfiles } from '@/api/user.api';
import { getPlaidBankAccounts } from '@/api/user.api';
import { getAccountingIntegrations } from '@/api/user.api';
import { listProposals } from '@/api/proposals.api';
import { format } from 'date-fns';

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

  const [businessProfiles, setBusinessProfiles] = useState<{ id: string; name?: string; size?: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name?: string }[]>([]);
  const [plaidIntegrations, setPlaidIntegrations] = useState<{ id: string; accountName?: string }[]>([]);
  const [accountingIntegrations, setAccountingIntegrations] = useState<{ id: string; serviceId?: string }[]>([]);
  useEffect(() => {
    async function fetchAll() {
      try {
        const bp = await getBusinessProfiles({});
        setBusinessProfiles(Array.isArray(bp) ? bp.map((b: any) => ({ id: b.id, name: b.name, size: b.size })) : []);
        const pi = await getPlaidBankAccounts({});
        setPlaidIntegrations(Array.isArray(pi) ? pi.map((p: any) => ({ id: p.id, accountName: p.accountName })) : []);
        const ai = await getAccountingIntegrations({});
        setAccountingIntegrations(Array.isArray(ai) ? ai.map((a: any) => ({ id: a.id, serviceId: a.serviceId })) : []);
      } catch (e) {
        setBusinessProfiles([]);
        setPlaidIntegrations([]);
        setAccountingIntegrations([]);
      }
    }
    fetchAll();
  }, []);

  const [proposalsForRequest, setProposalsForRequest] = useState<Proposal[]>([]);
  useEffect(() => {
    if (!requestId) return;
    listProposals({ requestId }).then(setProposalsForRequest);
  }, [requestId]);

  // Use real data only
  const selectedRequest = requests.find(r => r.id === requestId) || null;

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
              Proposals for {selectedRequest.title}
            </h1>
          </div>
        </div>

        {/* Request Summary Card (fully dynamic) */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {Object.entries(selectedRequest)
                .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'clientEmail'].includes(key))
                .map(([key, value]) => {
                  let displayValue = '-';
                  if (Array.isArray(value)) {
                    displayValue = value.length > 0 ? value.join(', ') : '-';
                  } else if (typeof value === 'boolean') {
                    displayValue = value ? 'Yes' : 'No';
                  } else if (typeof value === 'number') {
                    displayValue = value.toString();
                  } else if (typeof value === 'string' && value.trim() !== '') {
                    // Format ISO date strings
                    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
                      try {
                        displayValue = format(new Date(value), 'PPpp');
                      } catch {
                        displayValue = value;
                      }
                    } else {
                      displayValue = value;
                    }
                  }
                  // Special formatting for known enums
                  if (key === 'urgency') {
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Urgency</p>
                        <Badge variant={value === 'Urgent' ? 'destructive' : 'outline'}>{displayValue}</Badge>
                      </div>
                    );
                  }
                  if (key === 'status') {
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Status</p>
                        <Badge variant='outline'>{displayValue}</Badge>
                      </div>
                    );
                  }
                  if (key === 'framework') {
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Framework</p>
                        <Badge variant='outline'>{displayValue}</Badge>
                      </div>
                    );
                  }
                  if (key === 'budget') {
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Budget</p>
                        <span>{value ? formatCurrency(Number(value)) : '-'}</span>
                      </div>
                    );
                  }
                  // Friendly labels for ID fields, show short version
                  if (key === 'userId') {
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>User</p>
                        <span>{typeof value === 'string' ? `${value.slice(0, 6)}...${value.slice(-4)}` : '-'}</span>
                      </div>
                    );
                  }
                  if (key === 'businessId') {
                    const business = businessProfiles?.find(bp => bp.id === value);
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Business</p>
                        <span>{business?.name || '-'}</span>
                      </div>
                    );
                  }
                  if (key === 'plaidIntegrationId') {
                    const plaid = plaidIntegrations.find(p => p.id === value);
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Plaid Integration</p>
                        <span>{plaid?.accountName || '-'}</span>
                      </div>
                    );
                  }
                  if (key === 'accountingIntegrationId') {
                    const acc = accountingIntegrations.find(a => a.id === value);
                    return (
                      <div key={key}>
                        <p className='text-sm text-muted-foreground'>Accounting Integration</p>
                        <span>{acc?.serviceId || '-'}</span>
                      </div>
                    );
                  }
                  // Default rendering
                  return (
                    <div key={key}>
                      <p className='text-sm text-muted-foreground'>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                      <span>{displayValue}</span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Proposals for this request (fetched from backend) */}
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
            businessProfiles={businessProfiles}
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