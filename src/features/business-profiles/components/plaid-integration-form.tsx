import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePlaidLink } from 'react-plaid-link';
import api from '@/lib/axios';

export default function PlaidIntegrationForm({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (integration: any) => void; }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch link token when dialog opens
  useEffect(() => {
    if (open) {
      setLinkToken(null);
      setError(null);
      setLoading(true);
      api.post('/api/v1/plaid-integration/link-token')
        .then(res => setLinkToken(res.data.link_token))
        .catch(() => setError('Failed to create link token'))
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Handle Plaid Link success
  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Exchange public token for access token
      const exchangeRes = await api.post('/api/v1/plaid-integration/exchange-token', { public_token });
      const { access_token } = exchangeRes.data;

      // 2. Create Plaid bank account in backend
      const createRes = await api.post('/api/v1/plaid-integration/create-account', {
        access_token,
        account_id: metadata.account_id || (metadata.accounts && metadata.accounts[0]?.id),
        institution: metadata.institution,
      });

      onSubmit(createRes.data); // Pass new integration to parent
      onOpenChange(false);
    } catch (err) {
      setError('Failed to connect Plaid account');
    } finally {
      setLoading(false);
    }
  }, [onSubmit, onOpenChange]);

  const config = linkToken
    ? {
        token: linkToken,
        onSuccess,
        onExit: (err: any) => {
          if (err) setError('Plaid Link exited');
        },
      }
    : null;

  const { open: openPlaid, ready } = usePlaidLink(config || { token: '', onSuccess: () => {} });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Plaid</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {loading && <div>Loading...</div>}
          {!loading && !linkToken && <div>Unable to load Plaid Link.</div>}
          {!loading && linkToken && (
            <Button onClick={() => openPlaid()} disabled={!ready}>
              Launch Plaid Link
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