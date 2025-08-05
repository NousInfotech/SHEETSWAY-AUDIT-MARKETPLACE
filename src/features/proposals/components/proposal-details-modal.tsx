// 'use client';

// import { X, Calendar, DollarSign, User, FileText, Info } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Proposal } from '../types';
// import {
//   formatCurrency,
//   formatDate,
//   getProposalStatusBadgeVariant,
//   getRandomAnonUsername
// } from '../utils';
// import AuditorProfileModal from './auditor-profile-modal';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { updateProposalStatus } from '@/api/proposals.api';
// import { toast } from 'sonner';

// interface ProposalDetailsModalProps {
//   proposal: Proposal | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onAcceptProposal?: (proposal: Proposal) => void;
//   onRejectProposal?: (proposal: Proposal) => void;
// }

// export function ProposalDetailsModal({
//   proposal,
//   isOpen,
//   onClose,
//   onAcceptProposal,
//   onRejectProposal
// }: ProposalDetailsModalProps) {
//   const router = useRouter();
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   if (!proposal) return null;

//   // Button rendering logic
//   const isPending = proposal?.status?.toString().toUpperCase() === 'PENDING';
//   const isAccepted = proposal?.status?.toString().toUpperCase() === 'ACCEPTED';
//   const isRejected = proposal?.status?.toString().toUpperCase() === 'REJECTED';

//   async function handleAccept() {
//     if (!proposal) return;
//     setLoading(true);
//     setError(null);
//     try {
//       await updateProposalStatus(proposal.id, 'ACCEPTED');
//       toast.success('Proposal accepted successfully!');
//       if (onAcceptProposal) onAcceptProposal({ ...proposal, status: 'Accepted' });
//       onClose();
//     } catch (e: any) {
//       setError('Failed to accept proposal.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleReject() {
//     if (!proposal) return;
//     setLoading(true);
//     setError(null);
//     try {
//       await updateProposalStatus(proposal.id, 'REJECTED');
//       toast.success('Proposal rejected successfully!');
//       if (onRejectProposal) onRejectProposal({ ...proposal, status: 'Rejected' });
//       onClose();
//     } catch (e: any) {
//       setError('Failed to reject proposal.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
//         <DialogHeader>
//           <div className='flex items-center justify-between'>
//             <div>
//               <DialogTitle className='text-xl font-semibold'>
//                 {proposal.title}
//               </DialogTitle>
//               <DialogDescription className='mt-2'>
//                 Proposal Details
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className='space-y-6'>
//           {error && <div className='text-red-500'>{error}</div>}
//           {/* Status */}
//           <div className='flex items-center gap-4'>
//             <Badge variant={getProposalStatusBadgeVariant(proposal.status)}>
//               {proposal.status}
//             </Badge>
//           </div>

//           {/* Proposal Fields from Validator */}
//           <div className='grid grid-cols-2 gap-4'>
//             <div>
//               <p className='text-sm text-muted-foreground'>Proposal Title</p>
//               <p className='font-medium'>{proposal.title || proposal.proposalName}</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>Description</p>
//               <p className='font-medium'>{proposal.description}</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>Budget</p>
//               <p className='font-medium'>{formatCurrency(Number(proposal.proposedBudget ?? proposal.quotation))} {proposal.currency ?? ''}</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>Estimated Duration</p>
//               <p className='font-medium'>{proposal.estimatedDuration} days</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>Start Date</p>
//               <p className='font-medium'>{formatDate(proposal.startDate)}</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>End Date</p>
//               <p className='font-medium'>{formatDate(proposal.endDate)}</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>Status</p>
//               <p className='font-medium'>{proposal.status}</p>
//             </div>
//             <div>
//               <p className='text-sm text-muted-foreground'>Request Note</p>
//               <p className='font-medium'>{proposal.requestNote ?? '-'}</p>
//             </div>
//           </div>

//           <Separator />

//           {/* Terms */}
//           <div>
//             <h3 className='font-semibold text-lg mb-3'>Terms & Conditions</h3>
//             <ul className='space-y-2'>
//               {Array.isArray(proposal.terms) ? proposal.terms.map((term, idx) => (
//                 <li key={idx} className='text-sm'>- {term}</li>
//               )) : <li className='text-sm'>{proposal.terms}</li>}
//             </ul>
//           </div>

//           <Separator />

//           {/* Deliverables */}
//           <div>
//             <h3 className='font-semibold text-lg mb-3'>Deliverables</h3>
//             <ul className='space-y-2'>
//               {Array.isArray(proposal.deliverables) ? proposal.deliverables.map((deliverable, index) => (
//                 <li key={index} className='flex items-start gap-2'>
//                   <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
//                   <span className='text-sm'>{deliverable}</span>
//                 </li>
//               )) : <li className='text-sm'>{proposal.deliverables}</li>}
//             </ul>
//           </div>

//           {/* Auditor Information */}
//           <div>
//             <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
//               <User className='h-5 w-5' />
//               Auditor Information
//             </h3>
//             <div className='grid grid-cols-2 gap-4 items-center'>
//               <div>
//                 <p className='text-sm text-muted-foreground'>Auditor</p>
//                 <div className='flex items-center gap-2'>
//                   <span>Anonymous</span>
//                   <Button disabled size='sm' variant='outline' onClick={() => router.push(`/dashboard/profile/${proposal.auditorId}`)}>
//                     View Profile
//                   </Button>
//                 </div>
//                   <small className='text-xs text-amber-500 whitespace-nowrap'>you can view the profile once you got approved</small>
//               </div>
             
//             </div>
//           </div>

//           {/* Accept/Reject Buttons */}
//           {isPending && (
//             <div className="flex gap-2 mt-4">
//               <Button onClick={handleAccept} disabled={loading} variant="default">
//                 Accept
//               </Button>
//               <Button onClick={handleReject} disabled={loading} variant="destructive">
//                 Reject
//               </Button>
//             </div>
//           )}
//           {isAccepted && (
//             <div className="flex gap-2 mt-4">
//               <Button disabled variant="default">
//                 Accepted
//               </Button>
//             </div>
//           )}
//           {isRejected && (
//             <div className="flex gap-2 mt-4">
//               <Button disabled variant="destructive">
//                 Rejected
//               </Button>
//             </div>
//           )}

//           {/* Actions */}
//           <div className='flex justify-end gap-2 pt-4'>
//             <Button variant='outline' onClick={onClose} disabled={loading}>
//               Close
//             </Button>
//           </div>
//         </div>

//         {/* Timestamps */}
//         <Separator />
//         <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
//           <div>
//             <p>Created: {formatDate(proposal.createdAt)}</p>
//           </div>
//           <div>
//             <p>Updated: {formatDate(proposal.updatedAt)}</p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// } 





// #############################################################################################




'use client';

import {
  X,
  Calendar,
  DollarSign,
  User,
  FileText,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Proposal } from '../types';
import {
  formatCurrency,
  formatDate,
  getProposalStatusBadgeVariant,
  getRandomAnonUsername
} from '../utils';
import { useRouter } from 'next/navigation';
import { updateProposalStatus } from '@/api/proposals.api';
import { toast } from 'sonner';
import React from 'react';


interface ProposalDetailsModalProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptProposal?: (proposal: Proposal) => void;
  onRejectProposal?: (proposal: Proposal) => void;
}


const DetailItem = ({ icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-muted-foreground pt-1">
      {React.createElement(icon, { className: 'h-5 w-5' })}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-semibold text-base text-foreground break-words">{value}</div>
    </div>
  </div>
);

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

  const isPending = proposal?.status?.toString().toUpperCase() === 'PENDING';
  const isAccepted = proposal?.status?.toString().toUpperCase() === 'ACCEPTED';
  const isRejected = proposal?.status?.toString().toUpperCase() === 'REJECTED';

  
  const handleAction = async (action: 'ACCEPT' | 'REJECT') => {
    if (!proposal) return;
    setLoading(true);
    setError(null);
    try {
      const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
      await updateProposalStatus(proposal.id, newStatus);
      toast.success(`Proposal ${newStatus.toLowerCase()} successfully!`);

      if (action === 'ACCEPT' && onAcceptProposal) {
        onAcceptProposal({ ...proposal, status: 'Accepted' });
      } else if (action === 'REJECT' && onRejectProposal) {
        onRejectProposal({ ...proposal, status: 'Rejected' });
      }
      onClose();
    } catch (e: any) {
      const errorMessage = `Failed to ${action.toLowerCase()} proposal.`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      <DialogContent className="min-w-[90%] md:min-w-[70%] h-auto max-h-[95vh] flex flex-col p-0">
        
        {/* NON-SCROLLABLE HEADER */}
        <DialogHeader className="p-6 border-b sticky top-0 bg-background z-10 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-lg p-3 flex-shrink-0">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {proposal.title || proposal.proposalName}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Detailed view of the proposal and its terms.
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              <Badge variant={getProposalStatusBadgeVariant(proposal.status)} className="text-sm py-1 px-3 h-fit">
                {proposal.status}
              </Badge>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-grow overflow-y-auto">
          <div className="grid lg:grid-cols-12 gap-x-12 p-6">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-8">
              <section>
                <h3 className="font-semibold text-xl mb-6">Proposal Details</h3>
                <div className="space-y-6">
                  <DetailItem icon={DollarSign} label="Budget" value={`${formatCurrency(Number(proposal.proposedBudget ?? proposal.quotation))} ${proposal.currency ?? ''}`} />
                  <DetailItem icon={Clock} label="Estimated Duration" value={`${proposal.estimatedDuration} days`} />
                  <DetailItem icon={Info} label="Description" value={<p className="leading-relaxed">{proposal.description}</p>} />
                  <DetailItem icon={Info} label="Request Note" value={<p className="leading-relaxed">{proposal.requestNote ?? 'N/A'}</p>} />
                </div>
              </section>
              
              <Separator />

              <section>
                <h3 className="font-semibold text-xl mb-4">Terms & Conditions</h3>
                <ul className="space-y-3">
                  {Array.isArray(proposal.terms) && proposal.terms.length > 0 ? (
                    proposal.terms.map((term, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{term}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No terms specified.</p>
                  )}
                </ul>
              </section>
              
              <Separator />

              <section>
                <h3 className="font-semibold text-xl mb-4">Deliverables</h3>
                <ul className="space-y-3">
                  {Array.isArray(proposal.deliverables) && proposal.deliverables.length > 0 ? (
                    proposal.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-[7px] flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{deliverable}</span>
                      </li>
                    ))
                  ) : (
                     <p className="text-sm text-muted-foreground">No deliverables specified.</p>
                  )}
                </ul>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 space-y-6 mt-8 lg:mt-0 lg:border-l lg:pl-12">
              <Card className="bg-muted/50 border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Calendar className="h-5 w-5" /> Key Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailItem icon={Calendar} label="Start Date" value={formatDate(proposal.startDate)} />
                  <DetailItem icon={Calendar} label="End Date" value={formatDate(proposal.endDate)} />
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <User className="h-5 w-5" /> Auditor Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-purple-100 text-purple-600">
                      <AvatarImage src="/assets/icons/user.png" />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-base">Auditor</p>
                      <p className="text-sm text-muted-foreground">Anonymous Auditor</p>
                    </div>
                  </div>
                   <Button
                    size="sm"
                    variant="ghost"
                    disabled={!isAccepted}
                    className="w-full mt-4 justify-between text-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => router.push(`/dashboard/profile/${proposal.auditorId}`)}
                  >
                    View Profile <ChevronRight className="h-4 w-4" />
                  </Button>
                  {!isAccepted && <small className='block text-xs text-amber-500 mt-2'>You can view the auditor's profile once the proposal is accepted.</small>}
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Clock className="h-5 w-5" /> Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Created:</strong> {formatDate(proposal.createdAt)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(proposal.updatedAt)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/*  FOOTER */}
        <DialogFooter className="p-4 border-t bg-background">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              {error && (
                <div className="text-red-600 flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4" /> {error}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isPending && (
                <>
                  <Button onClick={() => handleAction('REJECT')} disabled={loading} className="bg-red-600 text-red-50 hover:bg-red-700">
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button onClick={() => handleAction('ACCEPT')} disabled={loading} className="bg-green-600 text-green-50 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" /> Accept
                  </Button>
                </>
              )}
              {isAccepted && (
                <Badge className="text-base py-2 px-4 bg-green-100 text-green-800 border-none">
                  <CheckCircle className="mr-2 h-4 w-4" /> Accepted
                </Badge>
              )}
              {isRejected && (
                 <Badge className="text-base py-2 px-4 bg-red-100 text-red-800 border-none">
                  <XCircle className="mr-2 h-4 w-4" /> Rejected
                </Badge>
              )}
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Close
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


