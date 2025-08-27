
import React from 'react';
import AccountCard from './AccountCard'; // Adjust path if needed
import { AccountData } from '../types/account'; // Adjust path to your types file

interface AccountCardsDisplayProps {
  accounts: AccountData[];
  onAccountSelect?: (accountId: string) => void;
  title?: string;
  description?: string;
  selectedAccount:any;
}

const AccountCardsDisplay: React.FC<AccountCardsDisplayProps> = ({
  accounts,
  onAccountSelect,
  title = 'Your Financial Accounts',
  description = 'Select Your Account and See the Transactions Below.',
  selectedAccount
}) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center rounded-lg border border-dashed p-6 text-muted-foreground'>
        No accounts connected yet.
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
        <p className='text-red-400'>{description}</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center'>
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