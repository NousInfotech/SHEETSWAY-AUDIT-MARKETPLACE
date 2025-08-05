'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlaidIntegrationList, {
  PlaidIntegration
} from './plaid-integration-list';
import PlaidIntegrationForm from './plaid-integration-form';
import {
  mockPlaidIntegrations,
  generateMockPlaidIntegration
} from '../utils/mock-data';
import { getPlaidBankAccounts } from '@/api/user.api';
import { useAuth } from '@/components/layout/providers';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export default function PlaidIntegrationTab() {
  const { appUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [integrations, setIntegrations] = useState<PlaidIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('plaidIntegrations');
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
      const data = await getPlaidBankAccounts({ userId: appUser.id });
      setIntegrations(data);
      localStorage.setItem('plaidIntegrations', JSON.stringify(data));
    } catch (err) {
      setError('Failed to load Plaid integrations');
    } finally {
      setLoading(false);
    }
  }

  function saveIntegrations(newIntegrations: PlaidIntegration[]) {
    setIntegrations(newIntegrations);
    localStorage.setItem('plaidIntegrations', JSON.stringify(newIntegrations));
  }

  function handleConnect(newIntegration: PlaidIntegration) {
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

  return (
    <div className='space-y-6'>
      <PlaidIntegrationForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleConnect}
      />
      {loading ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <Spinner size={48} className='text-primary' />
        </div>
      ) : error ? (
        <div className='text-red-500'>{error}</div>
      ) : integrations.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-600'>
          <p className='text-lg font-medium text-gray-600 dark:text-gray-300'>
            No Plaid integrations found
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Start by connecting a new Plaid integration.
          </p>
          <Button variant='default' onClick={() => setOpen(true)}>
            Connect Plaid
          </Button>
        </div>
      ) : (
        <PlaidIntegrationList
          integrations={integrations}
          onDelete={handleDelete}
        />
      )}
      {integrations.length > 0 && !loading && (
        <div className='mb-4'>
          <Button variant='default' onClick={() => setOpen(true)}>
            Connect Plaid
          </Button>
        </div>
      )}
    </div>
  );
}
