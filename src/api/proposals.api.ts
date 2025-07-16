import instance from '@/lib/axios';
import { PROPOSALS_API, PROPOSAL_STATUS_API, PROPOSAL_BY_ID_API } from '@/config/api';
import { Proposal } from '@/features/proposals/types';

// Create Proposal
export const createProposal = async (data: Partial<Proposal>) => {
  const response = await instance.post(PROPOSALS_API, data);
  return response.data;
};

// List Proposals (optionally with filters)
export const listProposals = async (params?: Record<string, any>) => {
  const response = await instance.get(PROPOSALS_API, { params });
  return response.data;
};

// Get Proposal by ID
export const getProposalById = async (proposalId: string) => {
  const response = await instance.get(PROPOSAL_BY_ID_API(proposalId));
  return response.data;
};

// Update Proposal (full)
export const updateProposal = async (proposalId: string, data: Partial<Proposal>) => {
  const response = await instance.put(PROPOSAL_BY_ID_API(proposalId), data);
  return response.data;
};

// Update Proposal Status
export const updateProposalStatus = async (proposalId: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REQUESTCLOSED') => {
  const response = await instance.patch(PROPOSAL_STATUS_API(proposalId), { status });
  return response.data;
};

// Delete Proposal
export const deleteProposal = async (proposalId: string) => {
  const response = await instance.delete(PROPOSAL_BY_ID_API(proposalId));
  return response.data;
}; 