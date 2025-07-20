import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { plaidIntegrationSchema } from '../utils/zod-schemas';
import { Button } from '@/components/ui/button';

export type PlaidIntegration = z.infer<typeof plaidIntegrationSchema>;

export default function PlaidIntegrationList({ integrations, onDelete }: { integrations: PlaidIntegration[], onDelete?: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {integrations.map(account => (
        <Card key={account.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>{account.institution}</CardTitle>
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(account.id)}>
                Delete
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold">Account Name:</span> {account.accountName}
              </div>
              <div>
                <span className="font-semibold">Type:</span> {account.accountType}
              </div>
              <div>
                <span className="font-semibold">Last 4:</span> {account.last4}
              </div>
              <div>
                <span className="font-semibold">Connected:</span> {new Date(account.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 