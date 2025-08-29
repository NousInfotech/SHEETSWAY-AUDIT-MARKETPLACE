import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { apideckIntegrationSchema } from '../utils/zod-schemas';
import { Button } from '@/components/ui/button';

export type ApideckIntegration = z.infer<typeof apideckIntegrationSchema>;

export default function ApideckIntegrationList({ integrations, onDelete }: { integrations: any[], onDelete?: (id: string) => void }) {
  // Only show integrations that are fully created (id, service, and status must exist)
  const validIntegrations = integrations.filter(
    integration => integration.id && integration.serviceId
  );
  if (validIntegrations.length === 0) return null;
  console.log("validIntegrations", validIntegrations)
  return (
    <div className="space-y-4">
      {validIntegrations.length > 0 && validIntegrations.map(integration => (
        <Card key={integration.id} className="w-full">
          
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-6 py-4">
            <CardTitle>{integration.serviceId}</CardTitle>
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(integration.id)}>
                Delete
              </Button>
            )}
          </CardHeader>
          <CardContent className="px-6 pb-6">
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