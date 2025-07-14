'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import BusinessProfileList from './business-profile-list';
import BusinessProfileForm, { BusinessProfileFormValues } from './business-profile-form';
import {
  getBusinessProfiles,
  createBusinessProfile,
  updateBusinessProfile,
  deleteBusinessProfile,
} from '@/api/user.api';

interface BusinessProfileType extends BusinessProfileFormValues {
  id?: string;
}

export default function BusinessProfileTab() {
  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<BusinessProfileType | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    setError(null);
    try {
      const data = await getBusinessProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Failed to load business profiles');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdateProfile(profile: BusinessProfileFormValues) {
    try {
      if (editProfile) {
        // Update existing profile
        await updateBusinessProfile(editProfile.id as string, profile);
        await loadProfiles();
      } else {
        // Create new profile
        const created = await createBusinessProfile(profile);
        setProfiles((prev) => [created, ...prev]);
      }

      setEditProfile(null);
      setOpen(false);
    } catch (err) {
      setError('Failed to save business profile');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBusinessProfile(id);
      await loadProfiles();
    } catch (err) {
      setError('Failed to delete business profile');
    }
  }

  function handleEdit(profile: BusinessProfileFormValues) {
    setEditProfile(profile);
    setOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setOpen(open);
    if (!open) setEditProfile(null);
  }

  return (
    <div className="space-y-6">
      <BusinessProfileForm
        open={open}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleCreateOrUpdateProfile}
        initialValues={editProfile}
        isEdit={!!editProfile}
      />

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : profiles.length === 0 ? (
        <p className="text-gray-500">No business profiles found.</p>
      ) : (
        <BusinessProfileList
          profiles={profiles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <div className="mb-4">
        <Button
          variant="default"
          onClick={() => {
            setEditProfile(null);
            setOpen(true);
          }}
        >
          Create Business Profile
        </Button>
      </div>
    </div>
  );
}
