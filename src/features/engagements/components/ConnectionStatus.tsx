// src/features/engagements/components/ConnectionStatus.tsx
'use client';

import { useState, useEffect } from 'react';
import { checkConnectionStatus } from '@/api/salt-edge';

interface ConnectionStatusProps {
  connectionId: string;
}

export default function ConnectionStatus({ connectionId }: ConnectionStatusProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connectionId) return;

    checkConnectionStatus(connectionId)
      .then((res: any) => {
        // Assuming the status is in res.data.status based on your API
        setStatus(res.data.status);
      })
      .catch(() => {
        setError('Could not fetch status');
      });
  }, [connectionId]); // Re-fetch if the connectionId ever changes

  if (!status && !error) {
    return <div>Checking connection status...</div>;
  }
  
  if (error) {
    return <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
  }

  // A more user-friendly display
  const statusStyles = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    refresh_needed: "bg-yellow-100 text-yellow-800",
  }[status || 'inactive'] || 'bg-gray-100 text-gray-800';


  return (
    <div className={`mb-4 p-3 rounded-lg ${statusStyles}`}>
      Bank Connection Status: <strong className="capitalize">{status?.replace('_', ' ')}</strong>
    </div>
  );
}