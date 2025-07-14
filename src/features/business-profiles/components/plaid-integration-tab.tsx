'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlaidIntegrationList, { PlaidIntegration } from './plaid-integration-list';
import PlaidIntegrationForm from './plaid-integration-form';
import { mockPlaidIntegrations, generateMockPlaidIntegration } from '../utils/mock-data';

const STORAGE_KEY = 'plaidIntegrations';

export default function PlaidIntegrationTab() {
  const [open, setOpen] = useState(false);
  const [integrations, setIntegrations] = useState<PlaidIntegration[]>([]);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setIntegrations(JSON.parse(stored));
    } else {
      setIntegrations(mockPlaidIntegrations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPlaidIntegrations));
    }
  }, []);

  function handleConnect() {
    const newIntegration = generateMockPlaidIntegration();
    const updated = [newIntegration, ...integrations];
    setIntegrations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
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