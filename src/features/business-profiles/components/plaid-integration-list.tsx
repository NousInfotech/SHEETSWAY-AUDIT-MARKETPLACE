import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { plaidIntegrationSchema } from '../utils/zod-schemas';

export type PlaidIntegration = z.infer<typeof plaidIntegrationSchema>;

export default function PlaidIntegrationList({ integrations }: { integrations: PlaidIntegration[] }) {
  return (
    <div className="space-y-4">
      {integrations.map(account => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle>{account.institution}</CardTitle>
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