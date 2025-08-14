// src/components/google-drive-picker.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DatabaseZap } from 'lucide-react'; // Or your preferred icon

// Define the shape of the file data we expect from the picker
interface PickerFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

// Define the props for our component
interface GoogleDrivePickerProps {
  accessToken: string;
  onFilesSelected: (files: PickerFile[]) => void;
}

// These values come from your .env.local file
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

// This loads the Google Picker API script
declare const google: any;
declare const gapi: any;

export function GoogleDrivePicker({
  accessToken,
  onFilesSelected
}: GoogleDrivePickerProps) {
  const openPicker = () => {
    // Check if the gapi and picker scripts are loaded
    if (!gapi || !gapi.load) {
      console.error('Google API script not loaded.');
      return;
    }

    gapi.load('picker', () => {
      const picker = new google.picker.PickerBuilder()
        // Identify your application
        .setAppId(CLIENT_ID)
        // Pass the OAuth token to authorize the picker
        .setOAuthToken(accessToken)
        .setDeveloperKey(API_KEY)
        // Show all files and folders
        .addView(google.picker.ViewId.DOCS)
        // Allow multiple files to be selected
        .setCallback((data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            // Pass the selected files back to the parent component
            onFilesSelected(data.docs as PickerFile[]);
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  return (
    <Button
      size='icon'
      variant='outline'
      className='h-16 w-16'
      onClick={openPicker}
      aria-label='Select files from Google Drive'
    >
      <DatabaseZap className='text-muted-foreground h-8 w-8' />
    </Button>
  );
}