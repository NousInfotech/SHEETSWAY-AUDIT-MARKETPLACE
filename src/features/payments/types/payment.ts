

export interface Payment {
  id: string;
  stripePaymentId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paymentMeta: {
    engagementId: string;
  };
  createdAt: string;
  updatedAt: string;
  escrow: Escrow;
}

export interface Escrow {
  id: string;
  engagementId: string;
  paymentId: string;
  isReleased: boolean;
  releaseDate: string | null;
  underDispute: boolean;
  createdAt: string;
  engagement: Engagement;
}

export interface Engagement {
  id: string;
  userId: string;
  auditorId: string;
  auditFirmId: string;
  chatThreadId: string;
  requestId: string;
  proposalId: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  auditorTeam: any[];
}