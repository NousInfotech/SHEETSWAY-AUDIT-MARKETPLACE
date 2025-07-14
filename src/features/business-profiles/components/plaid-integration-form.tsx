import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePlaidLink } from 'react-plaid-link';
import api from '@/lib/axios';
import { generateMockPlaidIntegration } from '../utils/mock-data';

export default function PlaidIntegrationForm({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (integration: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For mock mode, just generate a mock integration
  function handleMockConnect() {
    setLoading(true);
    setTimeout(() => {
      const mock = generateMockPlaidIntegration();
      onSubmit(mock);
      onOpenChange(false);
      setLoading(false);
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Plaid</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {loading && <div>Loading...</div>}
          {!loading && (
            <Button onClick={handleMockConnect}>
              Generate Mock Plaid Integration
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 