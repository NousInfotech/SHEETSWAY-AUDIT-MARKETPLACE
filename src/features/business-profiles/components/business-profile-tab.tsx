'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BusinessProfileList from './business-profile-list';
import BusinessProfileForm, { BusinessProfileFormValues } from './business-profile-form';
import { mockBusinessProfiles } from '../utils/mock-data';

const STORAGE_KEY = 'businessProfiles';

export default function BusinessProfileTab() {
  // TODO: Replace with real userId from auth context or user state
  const userId = "00000000-0000-0000-0000-000000000000"; // placeholder UUID
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<BusinessProfileFormValues[]>([]);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProfiles(JSON.parse(stored));
    } else {
      setProfiles(mockBusinessProfiles);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBusinessProfiles));
    }
  }, []);

  function handleCreateProfile(profile: BusinessProfileFormValues) {
    const updated = [profile, ...profiles];
    setProfiles(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  return (
    <div className="space-y-6">
      <BusinessProfileForm open={open} onOpenChange={setOpen} onSubmit={handleCreateProfile} userId={userId} />
      <BusinessProfileList profiles={profiles} />
      <div className="mb-4">
        <Button variant="default" onClick={() => setOpen(true)}>
          Create Business Profile
        </Button>
      </div>
    </div>
  );
} 