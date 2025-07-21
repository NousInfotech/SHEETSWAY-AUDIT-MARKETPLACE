import { Engagement, AccountingData, BankingData, Payment, Contract, Review } from '../types/engagement-types';

export const generateMockEngagements = (): Engagement[] => [
  {
    id: '1',
    clientName: 'TechCorp Solutions',
    type: 'Audit',
    framework: 'IFRS',
    status: 'Planning',
    startDate: '2024-01-15',
    deadline: '2024-03-30',
    progress: 25,
    priority: 'High',
    lastActivity: '2024-01-20',
    teamMembers: ['John Doe', 'Jane Smith'],
    description: 'Annual financial audit for tech company',
    notificationSettings: {
      emailAlerts: true,
      milestoneReminders: true,
      deadlineWarnings: true
    },
    visibility: 'Team'
  },
  {
    id: '2',
    clientName: 'GreenEnergy Ltd',
    type: 'Tax',
    framework: 'GAPSME',
    status: 'In Progress',
    startDate: '2024-02-01',
    deadline: '2024-04-15',
    progress: 60,
    priority: 'Medium',
    lastActivity: '2024-02-10',
    teamMembers: ['Alice Johnson'],
    description: 'Tax compliance and filing services',
    notificationSettings: {
      emailAlerts: true,
      milestoneReminders: false,
      deadlineWarnings: true
    },
    visibility: 'Private'
  },
  {
    id: '3',
    clientName: 'RetailMax Inc',
    type: 'Audit',
    framework: 'IFRS',
    status: 'Under Review',
    startDate: '2024-01-10',
    deadline: '2024-03-15',
    progress: 85,
    priority: 'High',
    lastActivity: '2024-02-08',
    teamMembers: ['Bob Wilson', 'Carol Davis', 'Mike Brown'],
    description: 'Quarterly review and compliance audit',
    notificationSettings: {
      emailAlerts: false,
      milestoneReminders: true,
      deadlineWarnings: true
    },
    visibility: 'Public'
  }
];

export const generateMockAccountingData = (): AccountingData[] => [
  {
    id: '1',
    date: '2024-01-15',
    account: 'Cash and Cash Equivalents',
    description: 'Opening balance',
    debit: 50000,
    credit: 0,
    balance: 50000,
    category: 'Current Assets',
    type: 'Asset'
  },
  {
    id: '2',
    date: '2024-01-16',
    account: 'Accounts Receivable',
    description: 'Invoice #1001 - Client Services',
    debit: 15000,
    credit: 0,
    balance: 15000,
    category: 'Current Assets',
    type: 'Asset'
  },
  {
    id: '3',
    date: '2024-01-17',
    account: 'Service Revenue',
    description: 'Consulting services rendered',
    debit: 0,
    credit: 15000,
    balance: 15000,
    category: 'Operating Revenue',
    type: 'Revenue'
  },
  {
    id: '4',
    date: '2024-01-18',
    account: 'Office Supplies',
    description: 'Stationery and supplies',
    debit: 500,
    credit: 0,
    balance: 500,
    category: 'Operating Expenses',
    type: 'Expense'
  },
  {
    id: '5',
    date: '2024-01-19',
    account: 'Accounts Payable',
    description: 'Vendor payment due',
    debit: 0,
    credit: 2500,
    balance: 2500,
    category: 'Current Liabilities',
    type: 'Liability'
  }
];

export const generateMockBankingData = (): BankingData[] => [
  {
    id: '1',
    accountId: 'acc_001',
    accountName: 'Business Checking',
    date: '2024-01-15',
    description: 'Client payment - TechCorp',
    amount: 25000,
    type: 'credit',
    category: 'Income',
    balance: 75000
  },
  {
    id: '2',
    accountId: 'acc_001',
    accountName: 'Business Checking',
    date: '2024-01-16',
    description: 'Office rent payment',
    amount: 2500,
    type: 'debit',
    category: 'Rent',
    balance: 72500
  },
  {
    id: '3',
    accountId: 'acc_001',
    accountName: 'Business Checking',
    date: '2024-01-17',
    description: 'Utility bill payment',
    amount: 450,
    type: 'debit',
    category: 'Utilities',
    balance: 72050
  },
  {
    id: '4',
    accountId: 'acc_002',
    accountName: 'Business Savings',
    date: '2024-01-18',
    description: 'Transfer from checking',
    amount: 10000,
    type: 'credit',
    category: 'Transfer',
    balance: 35000
  },
  {
    id: '5',
    accountId: 'acc_001',
    accountName: 'Business Checking',
    date: '2024-01-19',
    description: 'Equipment purchase',
    amount: 5000,
    type: 'debit',
    category: 'Equipment',
    balance: 57050
  }
];

export const generateMockPayments = (): Payment[] => [
  {
    id: '1',
    milestone: 'Planning Phase Complete',
    amount: 5000,
    status: 'Completed',
    dueDate: '2024-01-20',
    releaseDate: '2024-01-22',
    invoiceNumber: 'INV-001'
  },
  {
    id: '2',
    milestone: 'Field Work Complete',
    amount: 15000,
    status: 'In Escrow',
    dueDate: '2024-02-15',
    invoiceNumber: 'INV-002'
  },
  {
    id: '3',
    milestone: 'Draft Report Submitted',
    amount: 8000,
    status: 'Pending',
    dueDate: '2024-03-01',
    invoiceNumber: 'INV-003'
  },
  {
    id: '4',
    milestone: 'Final Report Delivered',
    amount: 7000,
    status: 'Pending',
    dueDate: '2024-03-15',
    invoiceNumber: 'INV-004'
  }
];

export const generateMockContracts = (): Contract[] => [
  {
    id: '1',
    name: 'Engagement Letter - TechCorp Solutions',
    type: 'Engagement Letter',
    status: 'Signed',
    sentDate: '2024-01-10',
    signedDate: '2024-01-12',
    downloadUrl: '/contracts/engagement-letter-techcorp.pdf'
  },
  {
    id: '2',
    name: 'Non-Disclosure Agreement',
    type: 'NDA',
    status: 'Signed',
    sentDate: '2024-01-10',
    signedDate: '2024-01-11',
    downloadUrl: '/contracts/nda-techcorp.pdf'
  },
  {
    id: '3',
    name: 'Scope Amendment #1',
    type: 'Amendment',
    status: 'Sent',
    sentDate: '2024-01-25',
    downloadUrl: '/contracts/amendment-1-techcorp.pdf'
  }
];

export const generateMockReviews = (): Review[] => [
  {
    id: '1',
    engagementId: '1',
    clientName: 'TechCorp Solutions',
    rating: 5,
    comment: 'Excellent work! The team was professional and delivered ahead of schedule.',
    date: '2024-03-20',
    aspects: {
      communication: 5,
      expertise: 5,
      timeliness: 5,
      overall: 5
    }
  },
  {
    id: '2',
    engagementId: '2',
    clientName: 'GreenEnergy Ltd',
    rating: 4,
    comment: 'Good service, but communication could be improved.',
    date: '2024-04-10',
    aspects: {
      communication: 3,
      expertise: 5,
      timeliness: 4,
      overall: 4
    }
  }
]; 