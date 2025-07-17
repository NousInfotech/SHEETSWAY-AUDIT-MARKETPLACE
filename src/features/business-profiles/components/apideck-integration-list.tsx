import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { apideckIntegrationSchema } from '../utils/zod-schemas';

export type ApideckIntegration = z.infer<typeof apideckIntegrationSchema>;

export default function ApideckIntegrationList({ integrations }: { integrations: ApideckIntegration[] }) {
  return (
    <div className="space-y-4">
      {integrations.map(integration => (
        <Card key={integration.id}>
          <CardHeader>
            <CardTitle>{integration.service}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold">Status:</span> {integration.status}
              </div>
              <div>
                <span className="font-semibold">Enabled:</span> {integration.enabled ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold">Connected:</span> {new Date(integration.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 