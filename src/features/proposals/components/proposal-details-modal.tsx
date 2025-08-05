'use client';

import { X, Calendar, DollarSign, User, FileText, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Proposal } from '../types';
import {
  formatCurrency,
  formatDate,
  getProposalStatusBadgeVariant,
  getRandomAnonUsername
} from '../utils';
import AuditorProfileModal from './auditor-profile-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';
import { useRouter } from 'next/navigation';
import { updateProposalStatus } from '@/api/proposals.api';
import { toast } from 'sonner';

interface ProposalDetailsModalProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptProposal?: (proposal: Proposal) => void;
  onRejectProposal?: (proposal: Proposal) => void;
}

export function ProposalDetailsModal({
  proposal,
  isOpen,
  onClose,
  onAcceptProposal,
  onRejectProposal
}: ProposalDetailsModalProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!proposal) return null;

  // Button rendering logic
  const isPending = proposal?.status?.toString().toUpperCase() === 'PENDING';
  const isAccepted = proposal?.status?.toString().toUpperCase() === 'ACCEPTED';
  const isRejected = proposal?.status?.toString().toUpperCase() === 'REJECTED';

  async function handleAccept() {
    if (!proposal) return;
    setLoading(true);
    setError(null);
    try {
      await updateProposalStatus(proposal.id, 'ACCEPTED');
      toast.success('Proposal accepted successfully!');
      if (onAcceptProposal) onAcceptProposal({ ...proposal, status: 'Accepted' });
      onClose();
    } catch (e: any) {
      setError('Failed to accept proposal.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!proposal) return;
    setLoading(true);
    setError(null);
    try {
      await updateProposalStatus(proposal.id, 'REJECTED');
      toast.success('Proposal rejected successfully!');
      if (onRejectProposal) onRejectProposal({ ...proposal, status: 'Rejected' });
      onClose();
    } catch (e: any) {
      setError('Failed to reject proposal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-xl font-semibold'>
                {proposal.title}
              </DialogTitle>
              <DialogDescription className='mt-2'>
                Proposal Details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {error && <div className='text-red-500'>{error}</div>}
          {/* Status */}
          <div className='flex items-center gap-4'>
            <Badge variant={getProposalStatusBadgeVariant(proposal.status)}>
              {proposal.status}
            </Badge>
          </div>

          {/* Proposal Fields from Validator */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Proposal Title</p>
              <p className='font-medium'>{proposal.title || proposal.proposalName}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Description</p>
              <p className='font-medium'>{proposal.description}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Budget</p>
              <p className='font-medium'>{formatCurrency(Number(proposal.proposedBudget ?? proposal.quotation))} {proposal.currency ?? ''}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Estimated Duration</p>
              <p className='font-medium'>{proposal.estimatedDuration} days</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Start Date</p>
              <p className='font-medium'>{formatDate(proposal.startDate)}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>End Date</p>
              <p className='font-medium'>{formatDate(proposal.endDate)}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              <p className='font-medium'>{proposal.status}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Request Note</p>
              <p className='font-medium'>{proposal.requestNote ?? '-'}</p>
            </div>
          </div>

          <Separator />

          {/* Terms */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Terms & Conditions</h3>
            <ul className='space-y-2'>
              {Array.isArray(proposal.terms) ? proposal.terms.map((term, idx) => (
                <li key={idx} className='text-sm'>- {term}</li>
              )) : <li className='text-sm'>{proposal.terms}</li>}
            </ul>
          </div>

          <Separator />

          {/* Deliverables */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Deliverables</h3>
            <ul className='space-y-2'>
              {Array.isArray(proposal.deliverables) ? proposal.deliverables.map((deliverable, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
                  <span className='text-sm'>{deliverable}</span>
                </li>
              )) : <li className='text-sm'>{proposal.deliverables}</li>}
            </ul>
          </div>

          {/* Auditor Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <User className='h-5 w-5' />
              Auditor Information
            </h3>
            <div className='grid grid-cols-2 gap-4 items-center'>
              <div>
                <p className='text-sm text-muted-foreground'>Auditor</p>
                <div className='flex items-center gap-2'>
                  <span>Anonymous</span>
                  <Button disabled size='sm' variant='outline' onClick={() => router.push(`/dashboard/profile/${proposal.auditorId}`)}>
                    View Profile
                  </Button>
                </div>
                  <small className='text-xs text-amber-500 whitespace-nowrap'>you can view the profile once you got approved</small>
              </div>
             
            </div>
          </div>

          {/* Accept/Reject Buttons */}
          {isPending && (
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAccept} disabled={loading} variant="default">
                Accept
              </Button>
              <Button onClick={handleReject} disabled={loading} variant="destructive">
                Reject
              </Button>
            </div>
          )}
          {isAccepted && (
            <div className="flex gap-2 mt-4">
              <Button disabled variant="default">
                Accepted
              </Button>
            </div>
          )}
          {isRejected && (
            <div className="flex gap-2 mt-4">
              <Button disabled variant="destructive">
                Rejected
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={onClose} disabled={loading}>
              Close
            </Button>
          </div>
        </div>

        {/* Timestamps */}
        <Separator />
        <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
          <div>
            <p>Created: {formatDate(proposal.createdAt)}</p>
          </div>
          <div>
            <p>Updated: {formatDate(proposal.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 





// #############################################################################################




