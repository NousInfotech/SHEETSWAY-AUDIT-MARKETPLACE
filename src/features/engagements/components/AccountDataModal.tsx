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
import ConnectionStatus from '@/features/engagements/components/ConnectionStatus';
import { useState } from 'react';

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
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

  const handleAccountSelect = (currentAccount: any) => {
    setSelectedAccount(currentAccount);
  };

  console.log('inside accound data modal ', selectedAccount);
  return (
    // Use the 'open' and 'onOpenChange' props to control the dialog
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full md:min-w-5xl lg:min-w-7xl'>
        <DialogHeader>
          <DialogTitle>Connection Details</DialogTitle>
          <DialogDescription>
            View Accounts and Transactions.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[70dvh] overflow-auto px-5'>
          {/* <ConnectionStatus connectionId={selectedAccount?.connection_id} /> */}

          <AccountsList
            connectionId={connectionId}
            onAccountSelect={handleAccountSelect}
            selectedAccount={selectedAccount}
          />

          {selectedAccount && (
            <div className='mt-6'>
              <TransactionsList
                connectionId={connectionId}
                selectedAccount={selectedAccount}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
