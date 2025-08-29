'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  createApideckLinkToken,
  saveAccountingIntegration
} from '@/api/apideck.api';
import { toast } from 'sonner';
import { ApideckVault, Connection } from '@apideck/vault-js';
import { useAuth } from '@/components/layout/providers';


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (integration: any) => void;
}

export default function ApideckIntegrationForm({
  open,
  onOpenChange,
  onSubmit
}: Props) {
  const { appUser } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Remove Vault JS script loading logic

  // Get link token when form opens
  useEffect(() => {
    if (open && !linkToken) {
      (async () => {
        try {
          setLoading(true);
          console.log('[ApideckIntegrationForm] Fetching link token...');
          const token = await createApideckLinkToken();
          console.log('[ApideckIntegrationForm] Received token:', token);
          if (token) setLinkToken(token);
          else
            console.error(
              '[ApideckIntegrationForm] No token received from API!'
            );
        } catch (error) {
          console.error(
            '[ApideckIntegrationForm] Error fetching link token:',
            error
          );
          toast.error('Failed to initialize Apideck connection');
        } finally {
          setLoading(false);
          console.log('[ApideckIntegrationForm] Loading set to false');
        }
      })();
    }
  }, [open, linkToken]);

  // Debug: Log why the button is disabled
  // useEffect(() => {
  //   if (open && (loading || !linkToken)) {
  //     // Use a string log to guarantee output
  //     console.error(
  //       `[ApideckIntegrationForm] Connect button is disabled due to: loading=${loading}, linkTokenPresent=${!!linkToken}, linkTokenValue=${linkToken}`
  //     );
  //   }
  // }, [open, loading, linkToken]);

  const handleOpenVault = async () => {
    if (!linkToken) {
      toast.error('Vault not ready. Please try again.');
      return;
    }
    if (!appUser?.id) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }
    try {
      ApideckVault.open({
        token: linkToken,
        onConnectionChange: async (connection: Connection) => {
          console.log(connection);
          try {
            // Use real userId from auth context
            const integrationData = {
              userId: appUser.id, // Now guaranteed to be string
              connectionId: connection.id, // <-- correct field name
              serviceId: connection.service_id,

              unifiedApi: connection.unified_api || connection.service_id,
              status: connection.status || '',
              label: 'accounting'
            };
            const savedIntegration =
              await saveAccountingIntegration(integrationData);
            onSubmit({ ...savedIntegration, connection });
            onOpenChange(false);
            toast.success('Accounting integration connected successfully!');
          } catch (error) {
            console.error('Failed to save integration:', error);
            toast.error('Failed to save integration');
          }
        },
        onClose: () => {
          // Optional: handle close
        }
      });
    } catch (error) {
      console.error('Failed to open Apideck Vault:', error);
      toast.error('Failed to open Apideck Vault');
    }
  };

  if (!open) return null;

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded bg-blue-100'>
              <span className='text-sm font-bold text-blue-600'>A</span>
            </div>
            Connect Accounting System
          </div>
        </CardTitle>
        <CardDescription>
          Connect your accounting software (QuickBooks, Xero, etc.) to
          automatically import financial data.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>Supported platforms:</p>
          <div className='flex flex-wrap gap-2'>
            <Badge variant='secondary'>QuickBooks</Badge>
            <Badge variant='secondary'>Xero</Badge>
            <Badge variant='secondary'>Sage</Badge>
            <Badge variant='secondary'>FreshBooks</Badge>
          </div>
        </div>
        <Button
          onClick={handleOpenVault}
          disabled={loading || !linkToken}
          className='w-full'
        >
          {loading ? 'Loading...' : 'Connect Accounting System'}
        </Button>
        {loading && (
          <p className='text-muted-foreground text-center text-xs'>
            Initializing connection...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
