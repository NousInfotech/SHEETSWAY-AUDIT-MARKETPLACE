'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlaidIntegrationList, { PlaidIntegration } from './plaid-integration-list';
import PlaidIntegrationForm from './plaid-integration-form';
import { mockPlaidIntegrations, generateMockPlaidIntegration } from '../utils/mock-data';

export default function PlaidIntegrationTab() {
  const [open, setOpen] = useState(false);
  const [integrations, setIntegrations] = useState<PlaidIntegration[]>([]);

  // Helper to load from localStorage or fallback to mock
  function loadIntegrations() {
    try {
      const local = localStorage.getItem('plaidIntegrations');
      let data: PlaidIntegration[] = [];
      if (local) {
        data = JSON.parse(local);
      } else {
        data = mockPlaidIntegrations;
        localStorage.setItem('plaidIntegrations', JSON.stringify(data));
      }
      setIntegrations(data);
    } catch (err) {
      // Optionally handle error
    }
  }

  useEffect(() => {
    loadIntegrations();
  }, []);

  function saveIntegrations(newIntegrations: PlaidIntegration[]) {
    setIntegrations(newIntegrations);
    localStorage.setItem('plaidIntegrations', JSON.stringify(newIntegrations));
  }

  function handleConnect(newIntegration: PlaidIntegration) {
    const newIntegrations = [newIntegration, ...integrations];
    saveIntegrations(newIntegrations);
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