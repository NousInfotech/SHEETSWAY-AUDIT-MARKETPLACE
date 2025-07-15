'use client';
import React from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { createPlaidBankAccount, createLinkToken, exchangePublicToken } from '@/api/plaid.api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (integration: any) => void;
}

export default function PlaidIntegrationForm({ open, onOpenChange, onSubmit }: Props) {
  const [linkToken, setLinkToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      (async () => {
        const response = await createLinkToken({ businessName: 'Demo Inc.' });
        console.log(response);
        if (response?.linkToken) {
          setLinkToken(response.linkToken);
        }
      })();
    }
  }, [open]);

  const { open: openPlaid, ready } = usePlaidLink({
    token: linkToken || '',
    onSuccess: async (public_token, metadata) => {
      try {
        const created = await createPlaidBankAccount({
          publicToken: public_token,
          institution: metadata.institution?.name as string,
          last4: metadata.accounts?.[0]?.mask,
          accountType: metadata.accounts?.[0]?.subtype,
          accountName: metadata.accounts?.[0]?.name,
        });

        onSubmit(created);
        onOpenChange(false);
      } catch (err) {
        console.error('Plaid error:', err);
      }
    },
    onExit: (err) => {
      if (err) console.error('Plaid Link exited:', err);
    },
  });

  if (!open) return null;

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-muted">
      <h3 className="text-lg font-medium">Connect Your Bank</h3>
      <button
        className="px-4 py-2 text-white bg-black rounded-md"
        onClick={() => openPlaid()}
        disabled={!ready}
      >
        {ready ? 'Connect with Plaid' : 'Loading...'}
      </button>
    </div>
  );
}
