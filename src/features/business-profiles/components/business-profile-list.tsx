import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessProfileFormValues } from './business-profile-form';

export default function BusinessProfileList({ profiles }: { profiles: BusinessProfileFormValues[] }) {
  if (!profiles || profiles.length === 0) {
    return <div className="text-center text-gray-500">No business profiles found. Click 'Create Business Profile' to add one.</div>;
  }
  return (
    <div className="space-y-4">
      {profiles.map(profile => (
        <Card key={profile.id}>
          <CardHeader>
            <CardTitle>{profile.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold">Country:</span> {profile.country}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {profile.category || '-'}
              </div>
              <div>
                <span className="font-semibold">Size:</span> {profile.size || '-'}
              </div>
              <div>
                <span className="font-semibold">Annual Turnover:</span> {profile.annualTurnover ? `$${profile.annualTurnover.toLocaleString()}` : '-'}
              </div>
              <div>
                <span className="font-semibold">Transactions/Year:</span> {profile.transactionsPerYear || '-'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 