'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlaidIntegrationList, { PlaidIntegration } from './plaid-integration-list';
import PlaidIntegrationForm from './plaid-integration-form';
// import { mockPlaidIntegrations, generateMockPlaidIntegration } from '../utils/mock-data';

export default function PlaidIntegrationTab() {
  const [open, setOpen] = useState(false);
  const [integrations, setIntegrations] = useState<PlaidIntegration[]>([]);

  // TODO: Optionally fetch real integrations from backend on mount
  // useEffect(() => {
  //   api.get('/api/v1/plaid-integration/list').then(res => setIntegrations(res.data));
  // }, []);

  function handleConnect(newIntegration: PlaidIntegration) {
    setIntegrations(prev => [newIntegration, ...prev]);
  }

  return (
    <div className="space-y-6">
      <PlaidIntegrationForm open={open} onOpenChange={setOpen} onSubmit={handleConnect} />
      <PlaidIntegrationList integrations={integrations} />
      <div className="mb-4">
        <Button variant="default" onClick={() => setOpen(true)}>
          Connect Plaid
        </Button>
      </div>
    </div>
  );
} 