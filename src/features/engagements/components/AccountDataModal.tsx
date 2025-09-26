// src\features\engagements\components\AccountDataModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AccountsList from '@/features/engagements/components/AccountsList';
import TransactionsList from '@/features/engagements/components/TransactionsList';
import { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import { AccountData } from '../types/account'; // Import AccountData type

interface AccountDataModalProps {
  connectionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AccountDataModal({
  connectionId,
  isOpen,
  onClose
}: AccountDataModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null); // Use AccountData type
  const transactionsListRef = useRef<HTMLDivElement>(null); // Create a ref for the transactions list

  const handleAccountSelect = (account: AccountData) => {
    setSelectedAccount(account);
    // Scroll to the transactions list when an account is selected
    // Use a setTimeout to ensure the TransactionsList is rendered before scrolling
    setTimeout(() => {
      transactionsListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100); // Small delay to allow rendering
  };

  // Reset selected account when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAccount(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='min-w-[95vw] h-[95vh] flex flex-col p-6 dark:bg-gray-900'>
        <DialogHeader className='pb-4 border-b border-gray-200 dark:border-gray-700'>
          <DialogTitle className='text-3xl font-bold text-gray-900 dark:text-gray-50'>Connection Details</DialogTitle>
          <DialogDescription className='text-md text-gray-600 dark:text-gray-400'>
            Explore your accounts and their associated transactions.
          </DialogDescription>
        </DialogHeader>

        <div className='flex-grow overflow-y-auto px-2 pr-4 custom-scrollbar'> {/* Added custom-scrollbar for better aesthetics */}
          <AccountsList
            connectionId={connectionId}
            onAccountSelect={handleAccountSelect}
            selectedAccount={selectedAccount}
          />

          {selectedAccount && (
            <div ref={transactionsListRef} className='mt-10 pt-6 border-t border-gray-200 dark:border-gray-700'>
              <TransactionsList
                connectionId={connectionId}
                selectedAccount={selectedAccount}
              />
            </div>
          )}
        </div>

        <DialogFooter className='pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button onClick={onClose} variant='secondary' className='px-6 py-2 text-md'>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}