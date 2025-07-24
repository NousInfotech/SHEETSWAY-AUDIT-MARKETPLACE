import { create } from 'zustand';
import { Request, Proposal, Engagement } from '../types';
import { listProposals } from '@/api/proposals.api';
import { listClientRequests } from '@/api/client-request.api';

interface ProposalsStore {
  requests: Request[];
  proposals: Proposal[];
  engagements: Engagement[];
  selectedRequest: Request | null;
  selectedProposal: Proposal | null;
  selectedEngagement: Engagement | null;
  loading: boolean;
  error: string | null;

  // Actions
  setSelectedRequest: (request: Request | null) => void;
  setSelectedProposal: (proposal: Proposal | null) => void;
  setSelectedEngagement: (engagement: Engagement | null) => void;
  loadRequests: (userId?: string) => Promise<void>;
  loadProposals: () => Promise<void>;

  // Getters
  getProposalsForRequest: (requestId: string) => Proposal[];
  getEngagementForProposal: (proposalId: string) => Engagement | null;
  getRequestById: (requestId: string) => Request | null;
  getProposalById: (proposalId: string) => Proposal | null;

  // Filters
  getRequestsByStatus: (status: Request['status']) => Request[];
  getProposalsByStatus: (status: Proposal['status']) => Proposal[];
  getEngagementsByStatus: (status: Engagement['status']) => Engagement[];
}

export const useProposalsStore = create<ProposalsStore>((set, get) => ({
  requests: [],
  proposals: [],
  engagements: [], // Keep as is, or refactor later if needed
  selectedRequest: null,
  selectedProposal: null,
  selectedEngagement: null,
  loading: false,
  error: null,

  setSelectedRequest: (request) => set({ selectedRequest: request }),
  setSelectedProposal: (proposal) => set({ selectedProposal: proposal }),
  setSelectedEngagement: (engagement) => set({ selectedEngagement: engagement }),

  loadRequests: async (userId?: string) => {
    set({ loading: true, error: null });
    try {
      const params = userId ? { userId } : {};
      const data = await listClientRequests(params);
      set({ requests: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load requests', loading: false });
    }
  },
  loadProposals: async () => {
    set({ loading: true, error: null });
    try {
      const data = await listProposals();
      set({ proposals: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load proposals', loading: false });
    }
  },

  getProposalsForRequest: (requestId) => {
    const { proposals } = get();
    return proposals.filter(proposal => proposal.clientRequestId === requestId);
  },

  getEngagementForProposal: (proposalId) => {
    const { engagements } = get();
    return engagements.find(engagement => engagement.proposalId === proposalId) || null;
  },

  getRequestById: (requestId) => {
    const { requests } = get();
    return requests.find(request => request.id === requestId) || null;
  },

  getProposalById: (proposalId) => {
    const { proposals } = get();
    return proposals.find(proposal => proposal.id === proposalId) || null;
  },

  getRequestsByStatus: (status) => {
    const { requests } = get();
    return requests.filter(request => request.status === status);
  },

  getProposalsByStatus: (status) => {
    const { proposals } = get();
    return proposals.filter(proposal => proposal.status === status);
  },

  getEngagementsByStatus: (status) => {
    const { engagements } = get();
    return engagements.filter(engagement => engagement.status === status);
  }
})); 