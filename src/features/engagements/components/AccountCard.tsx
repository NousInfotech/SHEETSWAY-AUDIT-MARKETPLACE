
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'; // Adjust import path as per your shadcn setup
import { Badge } from '@/components/ui/badge'; // Adjust import path
import { Separator } from '@/components/ui/separator'; // Adjust import path
import {
  Banknote,
  CreditCard,
  Wallet,
  Landmark,
  PiggyBank,
  ArrowUpRightFromSquare,
  BadgeDollarSign,
  CalendarCheck,
} from 'lucide-react';

import { AccountData, AccountExtra, CardAccountExtra, CreditAccountExtra } from '../types/account'; // Adjust path to your types file

interface AccountCardProps {
  account: AccountData;
  onSelect?: (account:any) => void; // Optional callback for selecting an account
  selectedAccount: any;
}

const getNatureIcon = (nature: AccountData['nature']) => {
  switch (nature) {
    case 'card':
    case 'credit_card':
      return <CreditCard className='h-5 w-5 text-muted-foreground' />;
    case 'account':
      return <Landmark className='h-5 w-5 text-muted-foreground' />;
    case 'credit':
      return <BadgeDollarSign className='h-5 w-5 text-muted-foreground' />;
    default:
      return <Wallet className='h-5 w-5 text-muted-foreground' />;
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

  // Type guard for specific extra fields
  const isCardAccountExtra = (extra: AccountExtra): extra is CardAccountExtra => {
    return (extra as CardAccountExtra).card_type !== undefined || nature === 'card' || nature === 'credit_card';
  };

  const isCreditAccountExtra = (extra: AccountExtra): extra is CreditAccountExtra => {
    return (extra as CreditAccountExtra).credit_limit !== undefined || nature === 'credit';
  };

  return (
    <Card
      className={`${selectedAccount?.id === account.id && "bg-pink-100"} relative w-full max-w-md h-full max-h-96 cursor-pointer transform-gpu transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
      onClick={() => onSelect && onSelect(account)}
    >
      <CardHeader className='flex-row items-center justify-between space-y-0 pb-2'>
        <div className='flex items-center gap-2'>
          {getNatureIcon(nature)}
          <CardTitle className='text-xl font-semibold'>{name}</CardTitle>
        </div>
        <Badge
          className={`text-xs capitalize ${
            extra.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {nature.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
          {isCardAccountExtra(extra) && extra.card_type && (
            <span className='capitalize'>{extra.card_type.replace('_', ' ')} Card</span>
          )}
          {extra.account_number && (
            <span> &bull; Account: {extra.account_number}</span>
          )}
          {extra.iban && (
            <span> &bull; IBAN: {extra.iban}</span>
          )}
        </CardDescription>

        <Separator className='my-4' />

        <div className='flex items-baseline justify-between'>
          <div className='text-3xl font-bold'>
            <span className={isNegativeBalance ? 'text-red-600' : 'text-green-600'}>
              {formatCurrency(balance, currency_code)}
            </span>
          </div>
          <p className='text-sm text-muted-foreground'>Current Balance</p>
        </div>

        {isCreditAccountExtra(extra) && extra.credit_limit !== undefined && (
          <div className='mt-2 flex items-baseline justify-between'>
            <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>
              Credit Limit: {formatCurrency(extra.credit_limit, currency_code)}
            </p>
            <p className='text-sm text-muted-foreground'>
              Available: {formatCurrency(extra.available_amount || 0, currency_code)}
            </p>
          </div>
        )}

        {isCardAccountExtra(extra) && extra.expiry_date && (
            <div className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'>
                <CalendarCheck className='h-4 w-4' />
                Expires: {new Date(extra.expiry_date).toLocaleDateString()}
            </div>
        )}

        {extra.transactions_count && (
          <div className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'>
            <ArrowUpRightFromSquare className='h-4 w-4' />
            Transactions: {extra.transactions_count.posted} posted, {extra.transactions_count.pending} pending
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-between text-sm text-muted-foreground'>
        <span>Last updated: {new Date(account.updated_at).toLocaleDateString()}</span>
        {extra.client_name && <span>Client: {extra.client_name}</span>}
      </CardFooter>
    </Card>
  );
};

export default AccountCard;