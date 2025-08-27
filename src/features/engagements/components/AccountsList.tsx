'use client';

import { useState, useEffect } from 'react';
import { fetchAccounts } from '@/api/salt-edge';
import AccountCardsDisplay from './AccountCardsDisplay';

interface AccountsListProps {
  connectionId: string;
  onAccountSelect: (account: any) => void;
  selectedAccount:any
}

export default function AccountsList({
  connectionId,
  onAccountSelect,
  selectedAccount
}: AccountsListProps) {
  const [accounts, setAccounts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connectionId) return;

    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        // Use the connectionId prop to fetch accounts
        const response = await fetchAccounts(connectionId);
        setAccounts(response);
      } catch (err) {
        setError('Failed to load accounts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [connectionId]); // Re-run effect if connectionId changes

  if (isLoading) return <div>Loading accounts...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>All Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found for this connection.</p>
      ) : (
        <AccountCardsDisplay
          accounts={accounts}
          onAccountSelect={onAccountSelect}
          selectedAccount={selectedAccount}
        />
      )}
    </div>
  );
}
