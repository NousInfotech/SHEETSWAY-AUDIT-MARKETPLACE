// src\features\engagements\components\AccountsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchAccounts } from '@/api/salt-edge'; // Assuming this path is correct
import AccountCardsDisplay from './AccountCardsDisplay';
import { AccountData } from '../types/account'; // Import AccountData type

interface AccountsListProps {
  connectionId: string;
  onAccountSelect: (account: AccountData) => void;
  selectedAccount: AccountData | null;
}

export default function AccountsList({
  connectionId,
  onAccountSelect,
  selectedAccount
}: AccountsListProps) {
  const [accounts, setAccounts] = useState<AccountData[]>([]); // Use AccountData type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connectionId) return;

    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        const response: AccountData[] = await fetchAccounts(connectionId); // Type assertion
        setAccounts(response);
      } catch (err) {
        setError('Failed to load accounts. Please try again.');
        console.error('Error fetching accounts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [connectionId]);

  if (isLoading) return <div className='flex justify-center items-center h-48 text-lg text-gray-600 dark:text-gray-300'>Loading accounts...</div>;
  if (error) return <div className='flex justify-center items-center h-48 text-lg text-red-500 dark:text-red-400'>{error}</div>;

  return (
    <div className='space-y-6'>
      <AccountCardsDisplay
        accounts={accounts}
        onAccountSelect={onAccountSelect}
        selectedAccount={selectedAccount}
      />
    </div>
  );
}