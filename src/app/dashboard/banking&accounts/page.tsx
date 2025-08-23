'use client';

import { ConnectionProvider } from '@/contexts/SaltEdgeConnectionContext';
import BankData from '@/features/engagements/components/BankData';

// This is now the page component. Its only job is to set up the context and render the UI.
export default function BankingDashboardPage() {
  return (
    // The provider now lives at the page level.
    <ConnectionProvider>
      <BankData />
    </ConnectionProvider>
  );
}
