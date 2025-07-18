'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ApideckIntegrationList, { ApideckIntegration } from './apideck-integration-list';
import ApideckIntegrationForm from './apideck-integration-form';
import { useAuth } from '@/components/layout/providers';
import { getAccountingIntegrations } from '@/api/user.api';

export default function ApideckIntegrationTab() {
  const { appUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [integrations, setIntegrations] = useState<ApideckIntegration[]>([]);

  async function loadIntegrations() {
    try {
      const data = await getAccountingIntegrations({ userId: appUser.id });
      setIntegrations(data);
    } catch (err) {
      // Optionally handle error
    }
  }

  useEffect(() => {
    loadIntegrations();
  }, []);

  function saveIntegrations(newIntegrations: ApideckIntegration[]) {
    setIntegrations(newIntegrations);
    localStorage.setItem('apideckIntegrations', JSON.stringify(newIntegrations));
  }

  function handleConnect(newIntegration: ApideckIntegration) {
    const newIntegrations = [newIntegration, ...integrations];
    saveIntegrations(newIntegrations);
  }

  return (
    <div className="space-y-6">
      <ApideckIntegrationForm open={open} onOpenChange={setOpen} onSubmit={handleConnect} />
      <ApideckIntegrationList integrations={integrations} />
      <div className="mb-4">
        <Button variant="default" onClick={() => setOpen(true)}>
          Connect Accounting
        </Button>
      </div>
    </div>
  );
} 