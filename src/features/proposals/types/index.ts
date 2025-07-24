export interface Request {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  framework: 'GAPSME' | 'IFRS';
  businessSize: 'Micro' | 'Small' | 'Medium' | 'Large';
  financialYearEnd: string;
  deliveryDeadline: string;
  budget?: string;
  urgency: 'Normal' | 'Urgent';
  isTaxReturnNeeded: 'Yes' | 'No';
  notes?: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  requestId: string;
  auditorName: string;
  auditorEmail: string;
  auditorId: string;
  title: string;
  description: string;
  proposedBudget: number;
  estimatedDuration: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  terms: string;
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
  // Backend compatibility fields
  proposalName?: string;
  quotation?: number;
  currency?: string;
  requestNote?: string;
}

export interface Engagement {
  id: string;
  proposalId: string;
  requestId: string;
  clientName: string;
  clientEmail: string;
  auditorName: string;
  auditorEmail: string;
  projectName: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'Planning' | 'Fieldwork' | 'Manager Review' | 'Partner Review' | 'Completed' | 'Awaiting Client Info';
  framework: 'GAPSME' | 'IFRS';
  businessSize: 'Micro' | 'Small' | 'Medium' | 'Large';
  isTaxReturnNeeded: boolean;
  createdAt: string;
  updatedAt: string;
} 