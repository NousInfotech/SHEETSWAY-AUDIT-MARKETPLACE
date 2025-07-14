import { Request, Proposal, Engagement } from '../types';

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date helper
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get status badge variant helper
export const getRequestStatusBadgeVariant = (
  status: Request['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Open':
      return 'outline';
    case 'In Progress':
      return 'secondary';
    case 'Completed':
      return 'default';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const getProposalStatusBadgeVariant = (
  status: Proposal['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Pending':
      return 'outline';
    case 'Accepted':
      return 'default';
    case 'Rejected':
      return 'destructive';
    case 'Withdrawn':
      return 'secondary';
    default:
      return 'secondary';
  }
};

export const getEngagementStatusBadgeVariant = (
  status: Engagement['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Fieldwork':
    case 'Manager Review':
    case 'Partner Review':
      return 'secondary';
    case 'Planning':
      return 'outline';
    case 'Awaiting Client Info':
      return 'destructive';
    default:
      return 'secondary';
  }
};

// Calculate days remaining helper
export const getDaysRemaining = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get urgency color helper
export const getUrgencyColor = (urgency: 'Normal' | 'Urgent'): string => {
  return urgency === 'Urgent' ? 'text-red-600' : 'text-green-600';
};

// Filter proposals by request helper
export const filterProposalsByRequest = (
  proposals: Proposal[],
  requestId: string
): Proposal[] => {
  return proposals.filter(proposal => proposal.requestId === requestId);
};

// Get engagement for proposal helper
export const getEngagementForProposal = (
  engagements: Engagement[],
  proposalId: string
): Engagement | null => {
  return engagements.find(engagement => engagement.proposalId === proposalId) || null;
};

export function getRandomAnonUsername(seed?: string): string {
  // Optionally use a seed for deterministic results per proposal
  const names = [
    'Anon Audit', 'AuditFox', 'LedgerLion', 'BalanceBear', 'NumberNinja',
    'SheetShark', 'BookBadger', 'TallyTiger', 'CountCrane', 'VerifyViper',
    'CheckCheetah', 'ReconRaven', 'FigureFalcon', 'EntryEagle', 'ReportRhino'
  ];
  if (seed) {
    // Simple hash for deterministic selection
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % names.length;
    }
    return names[Math.abs(hash) % names.length];
  }
  // Otherwise random
  return names[Math.floor(Math.random() * names.length)];
} 