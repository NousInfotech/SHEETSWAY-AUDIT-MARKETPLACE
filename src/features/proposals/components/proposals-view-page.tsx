'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  FileText,
  Users,
  CheckCircle,
  Paperclip,
  X,
  Eye,
  Download
} from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/components/layout/providers';
import { getClientRequestDocuments } from '@/api/client-request.api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getPresignedAccessUrl } from '@/api/client-request.api';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FitContentScrollArea } from '@/components/custom-ui/FitContentScrollArea';

export function ProposalsViewPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');
  const { appUser } = useAuth();

  const router = useRouter();
  const {
    requests,
    proposals,
    selectedProposal,
    setSelectedProposal,
    getProposalsByStatus
  } = useProposalsStore();

  const [businessProfiles, setBusinessProfiles] = useState<
    { id: string; name?: string; size?: string }[]
  >([]);
  const [users, setUsers] = useState<{ id: string; name?: string }[]>([]);
  const [plaidIntegrations, setPlaidIntegrations] = useState<
    { id: string; accountName?: string }[]
  >([]);
  const [accountingIntegrations, setAccountingIntegrations] = useState<
    { id: string; serviceId?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const bp = await getBusinessProfiles({});
        setBusinessProfiles(
          Array.isArray(bp)
            ? bp.map((b: any) => ({ id: b.id, name: b.name, size: b.size }))
            : []
        );
        const pi = await getPlaidBankAccounts({});
        setPlaidIntegrations(
          Array.isArray(pi)
            ? pi.map((p: any) => ({ id: p.id, accountName: p.accountName }))
            : []
        );
        const ai = await getAccountingIntegrations({});
        setAccountingIntegrations(
          Array.isArray(ai)
            ? ai.map((a: any) => ({ id: a.id, serviceId: a.serviceId }))
            : []
        );
        // Debug logs
        console.log('Plaid Integrations:', pi);
        console.log('Accounting Integrations:', ai);
      } catch (e) {
        setBusinessProfiles([]);
        setPlaidIntegrations([]);
        setAccountingIntegrations([]);
      }
    }
    fetchAll();
  }, []);

  const [proposalsForRequest, setProposalsForRequest] = useState<Proposal[]>(
    []
  );
  useEffect(() => {
    if (!requestId || !appUser?.id) return;
    setLoading(true);
    listProposals({ requestId, userId: appUser.id }).then((data) => {
      setProposalsForRequest(data);
      setLoading(false);
      console.log(
        'Fetched proposals:',
        data,
        'RequestId:',
        requestId,
        'UserId:',
        appUser?.id
      );
    });
  }, [requestId, appUser?.id]);

  // Use real data only
  const selectedRequest = requests.find((r) => r.id === requestId) || null;
  // Debug log for selectedRequest
  console.log('Selected Request:', selectedRequest);

  const [documents, setDocuments] = useState<any[]>([]);
  useEffect(() => {
    if (!selectedRequest?.id || selectedRequest.userId !== appUser?.id) {
      setDocuments([]);
      return;
    }
    getClientRequestDocuments(selectedRequest.id)
      .then(setDocuments)
      .catch(() => setDocuments([]));
  }, [selectedRequest?.id, selectedRequest?.userId, appUser?.id]);

  // Deduplicate documents by fileUrl
  const uniqueDocuments = Array.isArray(documents)
    ? documents.filter(
        (doc, idx, arr) =>
          arr.findIndex((d) => d.fileUrl === doc.fileUrl) === idx
      )
    : [];

  // Download all documents as ZIP
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    await Promise.all(
      uniqueDocuments.map(async (doc) => {
        try {
          const response = await fetch(doc.fileUrl);
          const blob = await response.blob();
          zip.file(
            doc.fileName || doc.fileKey || `Document-${doc.id || ''}`,
            blob
          );
        } catch (e) {
          // Optionally handle fetch errors
        }
      })
    );
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'documents.zip');
  };

  // State for document preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Handle document click: fetch presigned access URL and open modal
  const handlePreviewDoc = async (doc: any) => {
    setPreviewDoc(doc);
    setPreviewUrl(null);
    setPreviewError(null); // Reset error
    setPreviewOpen(true);
    try {
      // Extract S3 key from fileUrl (remove bucket URL prefix)
      const match = doc.fileUrl.match(/amazonaws\.com\/(.+)$/);
      const fileKey = match ? match[1] : doc.fileUrl;
      console.log('doc.fileUrl:', doc.fileUrl);
      console.log('fileKey:', fileKey);
      const result = await getPresignedAccessUrl(fileKey, 10000);
      console.log('Signed URL:', result);
      setPreviewUrl(result.data);
    } catch (e) {
      setPreviewError('Failed to load document preview.');
    }
  };

  // Defensive filter: only proposals for the current request
  const filteredProposalsForRequest = proposalsForRequest.filter(
    (proposal) => proposal.clientRequestId === requestId
  );

  console.log(
    'Filtered proposals:',
    filteredProposalsForRequest,
    'All proposals:',
    proposalsForRequest,
    'RequestId:',
    requestId,
    'UserId:',
    appUser?.id
  );

  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showProposalDetails, setShowProposalDetails] = useState(false);

  // Calculate statistics
  const totalRequests = requests.length;
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 'Accepted');
  const pendingProposals = proposals.filter((p) => p.status === 'Pending');
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

  // A helper function to render each detail item elegantly
  type DetailItemProps = {
    label: string;
    value: React.ReactNode;
    className?: string;
  };

  // 2. Apply the type to your component's props
  const DetailItem: React.FC<DetailItemProps> = ({
    label,
    value,
    className = ''
  }) => {
    return (
      <div
        className={`rounded-xl bg-gray-50/50 p-4 dark:bg-white/5 ${className}`}
      >
        <p className='mb-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
          {label}
        </p>
        <div className='text-base font-semibold break-words text-gray-900 dark:text-white'>
          {value}
        </div>
      </div>
    );
  };

  // If we have a selected request, show proposals for that request
  if (requestId && selectedRequest) {
    if (loading) {
      return (
        // <div className='flex min-h-screen w-full items-center justify-center'>
        //   <Spinner size={48} className='text-primary' />
        // </div>
        <div className='flex h-[80vh] w-full items-center justify-center'>
          <div className='classic-loader' />
        </div>
      );
    }
    return (
      <div className='container mx-auto space-y-6 py-6'>
        {/* Header with back button */}
        <div className='flex items-center gap-4'>
          <Button variant='outline' onClick={handleBackToRequests}>
            <ArrowLeft className='mr-2 h-4 w-4' />
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
            <CardTitle className='flex items-center rounded-full bg-blue-500/10 py-3'>
              <span className='p-2 text-blue-500'>
                <FileText className='h-6 w-6' />
              </span>
              Request Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Responsive Grid for Details */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {Object.entries(selectedRequest)
                .filter(
                  ([key]) =>
                    ![
                      'id',
                      'createdAt',
                      'updatedAt',
                      'clientEmail',
                      'userId',
                      'documents'
                    ].includes(key)
                )
                .map(([key, value]) => {
                  let displayValue = '-';
                  if (Array.isArray(value))
                    displayValue = value.length > 0 ? value.join(', ') : '-';
                  else if (typeof value === 'boolean')
                    displayValue = value ? 'Yes' : 'No';
                  else if (typeof value === 'number')
                    displayValue = value.toString();
                  else if (typeof value === 'string' && value.trim() !== '') {
                    displayValue = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
                      ? format(new Date(value), 'PPP')
                      : value;
                  }

                  // Format label for better readability (e.g., "plaidIntegrationId" -> "Plaid Integration")
                  const formattedLabel = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/Id$/, '')
                    .replace(/^./, (str) => str.toUpperCase());

                  let content;
                  switch (key) {
                    case 'urgency':
                      content = (
                        <Badge
                          variant={
                            value === 'Urgent' ? 'destructive' : 'outline'
                          }
                        >
                          {displayValue}
                        </Badge>
                      );
                      break;
                    case 'status':
                    case 'framework':
                      content = <Badge variant='default'>{displayValue}</Badge>;
                      break;

                    case 'budget':
                      content = (
                        <span>
                          {value ? formatCurrency(Number(value)) : '-'}
                        </span>
                      );
                      break;
                    case 'businessId':
                      const business = businessProfiles?.find(
                        (bp) => bp.id === value
                      );
                      content = <span>{business?.name || '-'}</span>;
                      break;
                    case 'plaidIntegrationId':
                      const plaid = plaidIntegrations?.find(
                        (p) => p.id === value
                      );
                      content = <span>{plaid?.accountName || '-'}</span>;
                      break;
                    case 'accountingIntegrationId':
                      const acc = accountingIntegrations?.find(
                        (a) => a.id === value
                      );
                      content = <span>{acc?.serviceId || '-'}</span>;
                      break;
                    default:
                      content = <span>{displayValue}</span>;
                  }

                  return (
                    <DetailItem
                      key={key}
                      label={formattedLabel}
                      value={content}
                    />
                  );
                })}
            </div>

            {/* Attached Documents Section */}
            {uniqueDocuments && uniqueDocuments.length > 0 && (
              <div className='mt-8 border-t border-gray-200/80 pt-6 dark:border-gray-700/60'>
                <h3 className='mb-4 flex items-center gap-3 text-lg font-bold text-gray-800 dark:text-white'>
                  <Paperclip className='h-5 w-5 text-gray-500' />
                  Attached Documents
                </h3>
                <ul className='space-y-3'>
                  {uniqueDocuments.map((doc) => (
                    <li
                      key={doc.fileKey || doc.id}
                      className='flex items-center justify-between rounded-xl border border-gray-200/80 bg-white/60 p-3 pr-4 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700/60 dark:bg-white/5'
                    >
                      <span className='truncate pr-4 font-medium text-gray-700 dark:text-gray-200'>
                        {doc.fileName || 'Document'}
                      </span>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handlePreviewDoc(doc)}
                          className='rounded-full p-2 text-gray-500 transition-colors hover:bg-blue-500/10 hover:text-blue-600'
                          aria-label='Preview'
                        >
                          <Eye />
                        </button>
                        <a
                          href={`/download-path/${doc.fileKey}`}
                          download
                          className='rounded-full p-2 text-gray-500 transition-colors hover:bg-green-500/10 hover:text-green-600'
                          aria-label='Download'
                        >
                          <Download />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stunning Document Preview Modal */}
            {previewOpen && (
              <div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'
                onClick={() => setPreviewOpen(false)}
              >
                <div
                  className='relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-gray-50 shadow-2xl dark:bg-gray-800'
                  onClick={(e) => e.stopPropagation()}
                >
                  <header className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
                    <h2 className='truncate pr-4 text-lg font-bold text-gray-900 dark:text-white'>
                      {previewDoc?.fileName || 'Preview'}
                    </h2>
                    <button
                      onClick={() => setPreviewOpen(false)}
                      className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-500/10 hover:text-gray-900 dark:hover:text-white'
                      aria-label='Close'
                    >
                      <X className='h-5 w-5' />
                    </button>
                  </header>
                  <main className='flex-grow overflow-auto p-4'>
                    {previewError && (
                      <div className='flex h-full items-center justify-center text-red-500'>
                        {previewError}
                      </div>
                    )}
                    {!previewUrl && !previewError && (
                      <div className='flex h-full items-center justify-center text-gray-500'>
                        Loading...
                      </div>
                    )}
                    {previewUrl &&
                      (previewDoc?.fileName?.toLowerCase().endsWith('.pdf') ? (
                        <iframe
                          src={previewUrl}
                          title='PDF Preview'
                          className='h-full min-h-[70vh] w-full rounded-lg bg-white'
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt={previewDoc?.fileName}
                          className='mx-auto h-full w-full object-contain'
                        />
                      ))}
                  </main>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposals for this request (fetched from backend) */}
        <FitContentScrollArea
          dependency={filteredProposalsForRequest} // Pass the array here. It will detect when it changes.
          minHeight='308px'
          minWidth='1230px'
        >
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>
                Proposals ({filteredProposalsForRequest.length})
              </CardTitle>
              <CardDescription>
                Proposals submitted for this request
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProposalsForRequest.length > 0 ? (
                <ProposalsTable
                  proposals={filteredProposalsForRequest}
                  onProposalSelect={handleProposalSelect}
                  onAcceptProposal={handleAcceptProposal}
                  onRejectProposal={handleRejectProposal}
                />
              ) : (
                <div className='py-8 text-center'>
                  <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <h3 className='mb-2 text-lg font-semibold'>
                    No proposals yet
                  </h3>
                  <p className='text-muted-foreground'>
                    No proposals have been submitted for this request.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </FitContentScrollArea>

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
    <div className='container mx-auto space-y-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl dark:text-white'>
            Proposals Management
          </h1>
          <p className='text-muted-foreground mt-2 text-lg'>
            Manage all your requests and review incoming proposals from auditors
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='hover:shadow-primary/10 dark:hover:shadow-primary/5 group relative transform-gpu overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl'>
          <div className='bg-primary/10 absolute -top-4 -right-4 h-24 w-24 rounded-full transition-all duration-300 group-hover:scale-125'></div>
          <CardHeader className='z-10 flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>
              Total Requests
            </CardTitle>
            <FileText className='text-primary h-5 w-5 opacity-80' />
          </CardHeader>
          <CardContent className='z-10'>
            <div className='text-4xl font-bold text-gray-900 dark:text-white'>
              {totalRequests}
            </div>
            <p className='text-muted-foreground mt-1 text-sm'>
              <span className='font-medium text-green-600 dark:text-green-400'>
                {requests.filter((r) => r.status === 'Open').length} open
              </span>
              ,{' '}
              <span className='font-medium text-blue-600 dark:text-blue-400'>
                {requests.filter((r) => r.status === 'In Progress').length} in
                progress
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className='group relative transform-gpu overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5'>
          <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-indigo-500/10 transition-all duration-300 group-hover:scale-125'></div>
          <CardHeader className='z-10 flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>
              Total Proposals
            </CardTitle>
            <Users className='h-5 w-5 text-indigo-500 opacity-80' />
          </CardHeader>
          <CardContent className='z-10'>
            <div className='text-4xl font-bold text-gray-900 dark:text-white'>
              {totalProposals}
            </div>
            <p className='text-muted-foreground mt-1 text-sm'>
              <span className='font-medium text-orange-600 dark:text-orange-400'>
                {pendingProposalsCount} pending
              </span>
              ,{' '}
              <span className='font-medium text-teal-600 dark:text-teal-400'>
                {acceptedProposalsCount} accepted
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className='group relative transform-gpu overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5'>
          <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-teal-500/10 transition-all duration-300 group-hover:scale-125'></div>
          <CardHeader className='z-10 flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>
              Accepted Proposals
            </CardTitle>
            <CheckCircle className='h-5 w-5 text-teal-500 opacity-80' />
          </CardHeader>
          <CardContent className='z-10'>
            <div className='text-4xl font-bold text-gray-900 dark:text-white'>
              {acceptedProposalsCount}
            </div>
            <p className='text-muted-foreground mt-1 text-sm'>
              <span className='font-medium text-teal-600 dark:text-teal-400'>
                {totalProposals > 0
                  ? ((acceptedProposalsCount / totalProposals) * 100).toFixed(1)
                  : '0.0'}
                %
              </span>{' '}
              acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card className='group relative transform-gpu overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5'>
          <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-orange-500/10 transition-all duration-300 group-hover:scale-125'></div>
          <CardHeader className='z-10 flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>
              Pending Review
            </CardTitle>
            <FileText className='h-5 w-5 text-orange-500 opacity-80' />
          </CardHeader>
          <CardContent className='z-10'>
            <div className='text-4xl font-bold text-gray-900 dark:text-white'>
              {pendingProposalsCount}
            </div>
            <p className='text-muted-foreground mt-1 text-sm'>
              Proposals requiring your attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Requests Table */}
      <FitContentScrollArea
        dependency={requests}
        minHeight='390px'
        minWidth='1230px'
        className='rounded-xl border border-gray-200 bg-white/50 shadow-lg dark:border-gray-700 dark:bg-gray-800/50' // Add more styling to the scroll area container
      >
        <Card className='w-full border-none bg-transparent shadow-none'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-3xl font-bold text-gray-900 dark:text-white'>
              All Requests
            </CardTitle>
            <CardDescription className='text-lg'>
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
      </FitContentScrollArea>

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

// 308px, 390px
