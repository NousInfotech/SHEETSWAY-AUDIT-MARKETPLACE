// src\features\engagements\components\AccountCard.tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Wallet,
  Landmark,
  BadgeDollarSign,
  ArrowUpRightFromSquare,
  CalendarCheck,
} from 'lucide-react';

import { AccountData, AccountExtra, CardAccountExtra, CreditAccountExtra } from '../types/account';

interface AccountCardProps {
  account: AccountData;
  onSelect?: (account: any) => void;
  selectedAccount: any;
}

const getNatureIcon = (nature: AccountData['nature']) => {
  switch (nature) {
    case 'card':
    case 'credit_card':
      return <CreditCard className='h-5 w-5 text-indigo-500' />;
    case 'account':
      return <Landmark className='h-5 w-5 text-teal-500' />;
    case 'credit':
      return <BadgeDollarSign className='h-5 w-5 text-orange-500' />;
    default:
      return <Wallet className='h-5 w-5 text-purple-500' />;
  }
};

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect, selectedAccount }) => {
  const { id, name, nature, balance, currency_code, extra } = account;
  const isNegativeBalance = balance < 0;
  const isSelected = selectedAccount?.id === account.id;

  const isCardAccountExtra = (extra: AccountExtra): extra is CardAccountExtra => {
    return (extra as CardAccountExtra).card_type !== undefined || nature === 'card' || nature === 'credit_card';
  };

  const isCreditAccountExtra = (extra: AccountExtra): extra is CreditAccountExtra => {
    return (extra as CreditAccountExtra).credit_limit !== undefined || nature === 'credit';
  };

  return (
    <Card
      data-account-id={account.id} // Added for potential future targeting
      className={`
        relative w-full max-w-md h-full min-h-[220px]
        cursor-pointer rounded-xl border-2
        shadow-md transition-all duration-300
        hover:scale-[1.02] hover:shadow-lg
        ${isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-indigo-200 dark:bg-indigo-950 dark:border-indigo-400'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }
      `}
      onClick={() => onSelect && onSelect(account)}
    >
      <CardHeader className='flex-row items-center justify-between space-y-0 pb-3'>
        <div className='flex items-center gap-3'>
          <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
            {getNatureIcon(nature)}
          </div>
          <CardTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>{name}</CardTitle>
        </div>
        <Badge
          className={`
            text-xs font-semibold capitalize px-3 py-1 rounded-full
            ${extra.status === 'active'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
            }
          `}
        >
          {nature.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm text-gray-600 dark:text-gray-400'>
          {isCardAccountExtra(extra) && extra.card_type && (
            <span className='capitalize'>{extra.card_type.replace('_', ' ')} Card</span>
          )}
          {extra.account_number && (
            <span className='ml-1 sm:ml-2'> &bull; Acc: {extra.account_number}</span>
          )}
          {extra.iban && (
            <span className='ml-1 sm:ml-2'> &bull; IBAN: {extra.iban}</span>
          )}
        </CardDescription>

        <Separator className='my-4 bg-gray-200 dark:bg-gray-700' />

        <div className='flex flex-col sm:flex-row sm:items-baseline justify-between'>
          <div className='text-3xl font-extrabold'>
            <span className={isNegativeBalance ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
              {formatCurrency(balance, currency_code)}
            </span>
          </div>
          <p className='text-sm text-muted-foreground mt-1 sm:mt-0'>Current Balance</p>
        </div>

        {isCreditAccountExtra(extra) && extra.credit_limit !== undefined && (
          <div className='mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between'>
            <p className='text-md font-medium text-gray-700 dark:text-gray-300'>
              Credit Limit: <span className='font-semibold'>{formatCurrency(extra.credit_limit, currency_code)}</span>
            </p>
            <p className='text-sm text-muted-foreground mt-1 sm:mt-0'>
              Available: {formatCurrency(extra.available_amount || 0, currency_code)}
            </p>
          </div>
        )}

        {isCardAccountExtra(extra) && extra.expiry_date && (
            <div className='mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                <CalendarCheck className='h-4 w-4 text-gray-400' />
                Expires: {new Date(extra.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
        )}

        {extra.transactions_count && (
          <div className='mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <ArrowUpRightFromSquare className='h-4 w-4 text-gray-400' />
            Transactions: <span className='font-medium'>{extra.transactions_count.posted} posted</span>, {extra.transactions_count.pending} pending
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-between text-xs text-muted-foreground border-t pt-3 dark:border-gray-700'>
        <span>Last updated: {new Date(account.updated_at).toLocaleDateString()}</span>
        {extra.client_name && <span className='font-medium'>Client: {extra.client_name}</span>}
      </CardFooter>
    </Card>
  );
};

export default AccountCard;