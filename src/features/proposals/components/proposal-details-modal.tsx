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
  
  const [openProfile, setOpenProfile] = React.useState(false);
  if (!proposal) return null;

  const isPending = proposal.status === 'Pending';
  const isAccepted = proposal.status === 'Accepted';

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
            {/* <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button> */}
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status */}
          <div className='flex items-center gap-4'>
            <Badge variant={getProposalStatusBadgeVariant(proposal.status)}>
              {proposal.status}
            </Badge>
          </div>

          {/* Auditor Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <User className='h-5 w-5' />
              Auditor Information
            </h3>
            <div className='grid grid-cols-2 gap-4 items-center'>
              <div>
                <p className='text-sm text-muted-foreground'>Auditor Name</p>
                <div className='flex items-center gap-2'>
                  {isAccepted ? (
                    <>
                      <span className='font-medium'>{proposal.auditorName}</span>
                      <Button size='sm' variant='outline' onClick={() => setOpenProfile(true)}>
                        View Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className='font-medium'>{getRandomAnonUsername(proposal.id)}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className='h-4 w-4 text-muted-foreground cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            Auditor name is visible once proposal is accepted
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button size='sm' variant='outline' onClick={() => setOpenProfile(true)}>
                        View Profile
                      </Button>
                    </>
                  )}
                  <AuditorProfileModal open={openProfile} onOpenChange={setOpenProfile} />
                </div>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Auditor Email</p>
                <p className='font-medium'>{isAccepted ? proposal.auditorEmail : 'Hidden'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Proposal Details */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Proposal Details
            </h3>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Description</p>
                <p className='text-sm'>{proposal.description}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Estimated Duration</p>
                  <p className='font-medium'>{proposal.estimatedDuration}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Proposed Budget</p>
                  <p className='font-medium text-lg'>{formatCurrency(proposal.proposedBudget)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Timeline
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Start Date</p>
                <p className='font-medium'>{formatDate(proposal.startDate)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>End Date</p>
                <p className='font-medium'>{formatDate(proposal.endDate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Terms */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Terms & Conditions</h3>
            <p className='text-sm'>{proposal.terms}</p>
          </div>

          <Separator />

          {/* Deliverables */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Deliverables</h3>
            <ul className='space-y-2'>
              {proposal.deliverables.map((deliverable, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
                  <span className='text-sm'>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability Window */}
          <Separator />
          <div>
            <h3 className='font-semibold text-lg mb-3'>Availability Window</h3>
            <p className='text-sm'>Can start within 3 days</p>
          </div>

          {/* Extra Section for Questions/Notes */}
          <Separator />
          <div>
            <h3 className='font-semibold text-lg mb-3'>Questions / Notes to Client</h3>
            <p className='text-sm'>Looking forward to collaborating. Please let me know if you have any specific requirements or questions.</p>
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
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          {isPending && onAcceptProposal && onRejectProposal && (
            <>
              <Button
                variant='outline'
                onClick={() => onRejectProposal(proposal)}
                className='text-red-600 hover:text-red-700'
              >
                Reject
              </Button>
              <Button onClick={() => onAcceptProposal(proposal)}>
                Accept Proposal
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 