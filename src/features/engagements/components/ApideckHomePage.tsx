'use client'; // For Next.js App Router, if using client-side state

import { useEffect, useState } from 'react';
import { ApideckConnectionList } from '@/features/engagements/components/ApideckConnectionList';
import { ApideckDataDisplay } from '@/features/engagements/components/ApideckDataDisplay';
import { useAuth } from '@/components/layout/providers';
import { toast } from 'sonner';
import { getAccountingIntegrations } from '@/api/user.api';

// Mock data for demonstration
const mockConnections = [
  {
    id: '06f04b3d-7078-406a-b929-53f39f0cbd53',
    userId: 'b5404dc2-4bc3-4cb7-8c82-b3f9df5c26b8',
    unifiedApi: 'accounting',
    createdAt: '2025-08-23T20:02:33.022Z',
    connectionId: 'accounting+sage-business-cloud-accounting', // This is the ID passed to APIs
    consumerId: 'sage-business-cloud-accounting',
    label: 'Accounting (Sage)',
    serviceId: 'sage-business-cloud-accounting',
    status: 'active'
  },
  {
    id: '29292b29-864c-4e70-a897-41539c40e43e',
    userId: 'b5404dc2-4bc3-4cb7-8c82-b3f9df5c26b8',
    unifiedApi: 'crm',
    createdAt: '2025-08-20T10:00:00.000Z',
    connectionId: 'crm+salesforce-test', // Another connectionId
    consumerId: 'salesforce',
    label: 'CRM (Salesforce)',
    serviceId: 'salesforce',
    status: 'active'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    userId: 'b5404dc2-4bc3-4cb7-8c82-b3f9df5c26b8',
    unifiedApi: 'hr',
    createdAt: '2024-07-15T10:30:00.000Z',
    connectionId: 'hr+bamboo-hr-inactive',
    consumerId: 'bamboo-hr',
    label: 'HR (BambooHR)',
    serviceId: 'bamboo-hr',
    status: 'inactive'
  }
];

export default function ApideckHomePage() {
  const [connections, setConnections] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | null
  >(null);
  const { appUser, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadIntegrations() {
      setLoading(true);

      try {
        if (!appUser) return;

        const connections = await getAccountingIntegrations({
          userId: appUser.id
        });

        setConnections(connections);
      } catch (err) {
        toast.error('some thing went while connecting to apideck');
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading && appUser) {
      loadIntegrations();
    }
  }, [appUser]);

  const handleConnectionClick = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
  };

  const connectionsWithHandlers = connections.map((conn: any) => ({
    connection: conn, // Wrap the connection object
    onClick: handleConnectionClick,
    isActive: conn.connectionId === selectedConnectionId
  }));

  if (loading) {
    return <div>Loading.......</div>;
  }
  console.log(connections)
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-10'>
      <h1 className='mb-12 text-center text-4xl font-extrabold text-gray-900'>
        Apideck Integrations Dashboard
      </h1>

      {/* Connection List Section */}
      <div className='w-full rounded-lg bg-white p-6 shadow-xl'>
        <ApideckConnectionList connections={connectionsWithHandlers} />
      </div>

      {/* Data Display Section */}
      <div className='w-full rounded-lg bg-white p-6 shadow-xl'>
        <ApideckDataDisplay connectionId={selectedConnectionId} />
      </div>
    </div>
  );
}
