// src/features/engagements/components/AccountsList.tsx

'use client';

import { useState, useEffect } from 'react';
import { fetchAccounts } from '@/api/salt-edge'; // Your API function

interface Account {
  id: string;
  name: string;
  nature: string;
  balance: number;
  currency_code: string;
}

interface AccountsListProps {
  connectionId: string;
  onAccountSelect: (account: Account) => void; // Expects the full account object
}

export default function AccountsList({ connectionId, onAccountSelect }: AccountsListProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connectionId) return; // Don't fetch if connectionId is not available

    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        // Use the connectionId prop to fetch accounts
        const response = await fetchAccounts(connectionId);
        setAccounts(response.data);
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
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found for this connection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => onAccountSelect(account)} // Set the selected account in the parent
            >
              <h3 className="font-semibold">{account.name}</h3>
              <p className="text-sm text-gray-600">Type: {account.nature}</p>
              <p className="text-lg font-bold">{account.balance} {account.currency_code}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}