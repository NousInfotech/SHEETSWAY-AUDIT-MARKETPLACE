'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ApideckIntegrationList, {
  ApideckIntegration
} from './apideck-integration-list';
import ApideckIntegrationForm from './apideck-integration-form';
import { useAuth } from '@/components/layout/providers';
import { getAccountingIntegrations } from '@/api/user.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { StunningButton } from '@/features/engagements/components/StunningButton';
import { useRouter } from 'next/navigation';


export default function ApideckIntegrationTab() {
  const router = useRouter();
  const { appUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [integrations, setIntegrations] = useState<ApideckIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('apideckIntegrations');
    if (cached) {
      setIntegrations(JSON.parse(cached));
      setLoading(false);
    } else if (appUser) {
      loadIntegrations();
    }
  }, [appUser]);

  async function loadIntegrations() {
    setLoading(true);
    setError(null);
    try {
      if (!appUser) return;
      const data = await getAccountingIntegrations({ userId: appUser.id });
      setIntegrations(data);
      localStorage.setItem('apideckIntegrations', JSON.stringify(data));
    } catch (err) {
      setError('Failed to load accounting integrations');
    } finally {
      setLoading(false);
    }
  }

  function saveIntegrations(newIntegrations: ApideckIntegration[]) {
    setIntegrations(newIntegrations);
    localStorage.setItem(
      'apideckIntegrations',
      JSON.stringify(newIntegrations)
    );
  }

  function handleConnect(newIntegration: ApideckIntegration) {
    setLoading(true);
    const newIntegrations = [newIntegration, ...integrations];
    saveIntegrations(newIntegrations);
    setLoading(false);
  }

  function handleDelete(id: string) {
    setLoading(true);
    const newIntegrations = integrations.filter((i) => i.id !== id);
    saveIntegrations(newIntegrations);
    setLoading(false);
  }

  // Only show integrations that are fully created (id, service, and status must exist)
  const validIntegrations = integrations.filter(
    (integration) => integration.id && integration.service && integration.status
  );

  return (
    <div className='space-y-6'>
      <ApideckIntegrationForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleConnect}
      />
      {loading && (
        <div className='flex flex-col items-center justify-center py-12'>
          <Spinner size={48} className='text-primary' />
        </div>
      )}{' '}
      {error && <div className='text-red-500'>{error}</div>}
      {!open && (
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-600'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Start by connecting a new accounting integration.
          </p>
          <Button variant='default' onClick={() => setOpen(true)}>
            Connect Accounting
          </Button>
        </div>
      )}
      {validIntegrations.length > 0 && (
        <ApideckIntegrationList
          integrations={validIntegrations}
          onDelete={handleDelete}
        />
      )}
      <div className='flex justify-center p-8'>
        <StunningButton onClick={() => router.push('/dashboard/apideck')}>
          View Details
        </StunningButton>
      </div>
    </div>
  );
}
