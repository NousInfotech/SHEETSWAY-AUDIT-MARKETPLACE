'use client';

import { X } from 'lucide-react';
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
import { Request } from '../types';
import { 
  formatCurrency, 
  formatDate, 
  getRequestStatusBadgeVariant, 
  getDaysRemaining,
  getUrgencyColor 
} from '../utils';

interface RequestDetailsModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onViewProposals: (request: Request) => void;
}

export function RequestDetailsModal({
  request,
  isOpen,
  onClose,
  onViewProposals
}: RequestDetailsModalProps) {
  if (!request) return null;

  const daysRemaining = getDaysRemaining(request.deliveryDeadline);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-xl font-semibold'>
                {request.title}
              </DialogTitle>
              <DialogDescription className='mt-2'>
                Request Details
              </DialogDescription>
            </div>
            <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status and Urgency */}
          <div className='flex items-center gap-4'>
            <Badge variant={getRequestStatusBadgeVariant(request.status)}>
              {request.status}
            </Badge>
            <Badge 
              variant={request.urgency === 'Urgent' ? 'destructive' : 'outline'}
              className={`${getUrgencyColor(request.urgency)} ${request.urgency === 'Urgent' ? 'text-white' : ''}`}
            >
              {request.urgency}
            </Badge>
          </div>

          {/* Client Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Client Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Client Name</p>
                <p className='font-medium'>{request.clientName}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Client Email</p>
                <p className='font-medium'>{request.clientEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Project Details */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Project Details</h3>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Description</p>
                <p className='text-sm'>{request.description}</p>
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Framework</p>
                  <Badge variant='outline'>{request.framework}</Badge>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Business Size</p>
                  <Badge variant='secondary'>{request.businessSize}</Badge>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Financial Year End</p>
                  <p className='font-medium'>{formatDate(request.financialYearEnd)}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Tax Return Needed</p>
                  <Badge variant={request.isTaxReturnNeeded === 'Yes' ? 'default' : 'outline'}>
                    {request.isTaxReturnNeeded}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline and Budget */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Timeline & Budget</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Delivery Deadline</p>
                <p className='font-medium'>{formatDate(request.deliveryDeadline)}</p>
                <p className={`text-xs ${daysRemaining < 7 ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Budget</p>
                <p className='font-medium'>
                  {request.budget ? formatCurrency(parseInt(request.budget)) : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <>
              <Separator />
              <div>
                <h3 className='font-semibold text-lg mb-3'>Additional Notes</h3>
                <p className='text-sm'>{request.notes}</p>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
            <div>
              <p>Created: {formatDate(request.createdAt)}</p>
            </div>
            <div>
              <p>Updated: {formatDate(request.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onViewProposals(request)}>
            View Proposals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 