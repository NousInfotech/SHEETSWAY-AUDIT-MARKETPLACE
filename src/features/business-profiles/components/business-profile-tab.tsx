'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BusinessProfileList from './business-profile-list';
import BusinessProfileForm, { BusinessProfileFormValues } from './business-profile-form';
import { useAuth } from '@/components/layout/providers';
import api from '@/lib/axios';
import { BUSINESS_PROFILES_API } from '@/config/api';

export default function BusinessProfileTab() {
  const { user } = useAuth();
  const userId = user?.uid || '';
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<BusinessProfileFormValues[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfiles() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(BUSINESS_PROFILES_API);
      setProfiles(res.data);
    } catch (err: any) {
      setError('Failed to load business profiles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProfiles();
    }
  }, [userId]);

  async function handleCreateProfile(profile: BusinessProfileFormValues) {
    setError(null);
    try {
      await api.post(BUSINESS_PROFILES_API, { ...profile, userId });
      fetchProfiles();
    } catch (err: any) {
      setError('Failed to create business profile');
    }
  }

  return (
    <div className="space-y-6">
      <BusinessProfileForm open={open} onOpenChange={setOpen} onSubmit={handleCreateProfile} userId={userId} />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <BusinessProfileList profiles={profiles} />
      )}
      <div className="mb-4">
        <Button variant="default" onClick={() => setOpen(true)} disabled={!userId}>
          Create Business Profile
        </Button>
      </div>
    </div>
  );
} 