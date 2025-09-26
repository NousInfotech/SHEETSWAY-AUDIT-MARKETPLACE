// src\features\engagements\components\AccountCardsDisplay.tsx

import React from 'react';
import AccountCard from './AccountCard';
import { AccountData } from '../types/account';

interface AccountCardsDisplayProps {
  accounts: AccountData[];
  onAccountSelect?: (account: AccountData) => void;
  title?: string;
  description?: string;
  selectedAccount: AccountData | null;
}

const AccountCardsDisplay: React.FC<AccountCardsDisplayProps> = ({
  accounts,
  onAccountSelect,
  title = 'Your Financial Accounts',
  description = 'Select an Account to View Its Transactions Below.',
  selectedAccount
}) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-lg text-muted-foreground bg-gray-50 dark:bg-gray-900'>
        <p>No accounts connected yet. Connect an institution to see your accounts here!</p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='text-center sm:text-left'>
        <h2 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50'>{title}</h2>
        <p className='mt-2 text-lg text-red-500 dark:text-red-400'>{description}</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center'>
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onSelect={onAccountSelect}
            selectedAccount={selectedAccount}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountCardsDisplay;