'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BusinessProfileList from './business-profile-list';
import BusinessProfileForm, { BusinessProfileFormValues } from './business-profile-form';
import { useAuth } from '@/components/layout/providers';
import api from '@/lib/axios';
import { BUSINESS_PROFILES_API } from '@/config/api';
import { mockBusinessProfiles, generateMockBusinessProfile } from '../utils/mock-data';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

export default function BusinessProfileTab() {
  const { user } = useAuth();
  let userId = user?.uid || '';
  if (!validateUuid(userId)) {
    // Always ensure a valid UUID for userId
    if (typeof window !== 'undefined') {
      let mockUserId = localStorage.getItem('mockUserId');
      if (!mockUserId || !validateUuid(mockUserId)) {
        mockUserId = uuidv4();
        localStorage.setItem('mockUserId', mockUserId);
      }
      userId = mockUserId;
    } else {
      userId = uuidv4();
    }
  }
  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<BusinessProfileFormValues | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfileFormValues[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to load from localStorage or fallback to mock
  function loadProfiles() {
    setLoading(true);
    setError(null);
    try {
      const local = localStorage.getItem('businessProfiles');
      let data: BusinessProfileFormValues[] = [];
      if (local) {
        data = JSON.parse(local);
      } else {
        data = mockBusinessProfiles;
        localStorage.setItem('businessProfiles', JSON.stringify(data));
      }
      setProfiles(data);
    } catch (err: any) {
      setError('Failed to load business profiles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      loadProfiles();
    }
  }, [userId]);

  function saveProfiles(newProfiles: BusinessProfileFormValues[]) {
    setProfiles(newProfiles);
    localStorage.setItem('businessProfiles', JSON.stringify(newProfiles));
  }

  async function handleCreateProfile(profile: BusinessProfileFormValues) {
    setError(null);
    try {
      const newProfiles = [profile, ...profiles];
      saveProfiles(newProfiles);
    } catch (err: any) {
      setError('Failed to create business profile');
    }
  }

  function handleEdit(profile: BusinessProfileFormValues) {
    setEditProfile(profile);
    setOpen(true);
  }

  async function handleCreateOrUpdateProfile(profile: BusinessProfileFormValues) {
    setError(null);
    try {
      let newProfiles;
      if (editProfile) {
        // Update existing
        newProfiles = profiles.map(p => p.id === editProfile.id ? { ...profile, id: editProfile.id, userId: editProfile.userId, createdAt: editProfile.createdAt, updatedAt: new Date().toISOString() } : p);
      } else {
        // Create new
        newProfiles = [profile, ...profiles];
      }
      saveProfiles(newProfiles);
      setEditProfile(null);
    } catch (err: any) {
      setError('Failed to save business profile');
    }
  }

  function handleFormOpenChange(open: boolean) {
    setOpen(open);
    if (!open) setEditProfile(null);
  }

  function handleDelete(id: string) {
    const newProfiles = profiles.filter(p => p.id !== id);
    saveProfiles(newProfiles);
  }

  return (
    <div className="space-y-6">
      <BusinessProfileForm
        open={open}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleCreateOrUpdateProfile}
        userId={userId}
        initialValues={editProfile}
        isEdit={!!editProfile}
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <BusinessProfileList profiles={profiles} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <div className="mb-4">
        <Button variant="default" onClick={() => { setEditProfile(null); setOpen(true); }}>
          Create Business Profile
        </Button>
      </div>
    </div>
  );
} 