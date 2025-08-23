'use client';

import { useState } from 'react';

// Import all necessary components
import ConnectButton from '@/features/engagements/components/ConnectButton';
import AccountsList from '@/features/engagements/components/AccountsList';
import TransactionsList from '@/features/engagements/components/TransactionsList';
import ConnectionStatus from '@/features/engagements/components/ConnectionStatus'; // Import the new component

// Import the custom hook to access the shared connection state
import { useConnection } from '@/contexts/SaltEdgeConnectionContext';

// Define the shape of your Account data for type safety
interface Account {
  id: string;
  name: string;
  // Add other properties as needed
}

export default function BankingDashboard() {
  // 1. SHARED STATE: Get the connectionId and loading status from the global context.
  const { connectionId, isLoading } = useConnection();

  // 2. LOCAL UI STATE: Manage the currently selected account within this component.
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // While the context is doing its initial check, show a loading message.
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading Connection Status...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>
      
      {!connectionId ? (
        // RENDERED IF NOT CONNECTED
        <div className="mb-6 p-6 border rounded-lg text-center">
          
          <ConnectButton />
        </div>
      ) : (
        // RENDERED IF CONNECTED
        <div>
          {/* Render the dedicated component to show the connection status */}
          <ConnectionStatus connectionId={connectionId} />

          <AccountsList 
            connectionId={connectionId} 
            onAccountSelect={setSelectedAccount}
          />
          
          {selectedAccount && (
            <div className="mt-6">
              <TransactionsList 
                connectionId={connectionId} 
                selectedAccount={selectedAccount} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}