// src/features/engagements/components/TransactionsList.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchTransactions } from '@/api/salt-edge'; // Your API function

interface Transaction {
  id: string;
  account_id: string; // The transaction object should have the account_id
  made_on: string;
  amount: number;
  currency_code: string;
  description: string;
  status: string;
}

interface TransactionsListProps {
  connectionId: string;
  selectedAccount: any
}

export default function TransactionsList({ connectionId, selectedAccount }: TransactionsListProps) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connectionId) return;

    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        // Fetch ALL transactions for the entire connection
        const response = await fetchTransactions(selectedAccount.id, connectionId);
        setAllTransactions(response);
      } catch (err) {
        setError('Failed to load transactions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [connectionId]); // Only refetch when the connection changes

  // Use useMemo to filter transactions only when the selected account or the list of transactions changes.
  // This is more efficient than filtering on every render.
  const filteredTransactions = useMemo(() => {
    if (!selectedAccount) return [];
    return allTransactions.filter(
      (transaction) => transaction.account_id === selectedAccount.id
    );
  }, [allTransactions, selectedAccount]);

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Transactions for {selectedAccount.name}
      </h3>
      {filteredTransactions.length === 0 ? (
        <p>No transactions found for this account.</p>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">{transaction.description}</p>
                <p className="font-bold">{transaction.amount} {transaction.currency_code}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Date: {new Date(transaction.made_on).toLocaleDateString()}</p>
                <p>Status: {transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}