// Engagement-related types
export interface Engagement {
  id: string;
  clientName: string;
  type: 'Audit' | 'Tax';
  framework: 'IFRS' | 'GAPSME';
  status: 'Planning' | 'In Progress' | 'Under Review';
  startDate: string;
  deadline: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  lastActivity: string;
  teamMembers: string[];
  description: string;
  notificationSettings?: {
    emailAlerts: boolean;
    milestoneReminders: boolean;
    deadlineWarnings: boolean;
  };
  visibility?: 'Private' | 'Team' | 'Public';
}

export interface AccountingData {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  category: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
}

export interface BankingData {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  balance: number;
}

export interface Payment {
  id: string;
  milestone: string;
  amount: number;
  status: 'Pending' | 'In Escrow' | 'Released' | 'Completed';
  dueDate: string;
  releaseDate?: string;
  invoiceNumber: string;
}

export interface Contract {
  id: string;
  name: string;
  type: 'Engagement Letter' | 'NDA' | 'Amendment';
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired';
  sentDate?: string;
  signedDate?: string;
  downloadUrl: string;
}

export interface Review {
  id: string;
  engagementId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  aspects: {
    communication: number;
    expertise: number;
    timeliness: number;
    overall: number;
  };
}

export interface Filters {
  search: string;
  status: '' | 'Planning' | 'In Progress' | 'Under Review';
  type: '' | 'Audit' | 'Tax';
  framework: '' | 'IFRS' | 'GAPSME';
} 