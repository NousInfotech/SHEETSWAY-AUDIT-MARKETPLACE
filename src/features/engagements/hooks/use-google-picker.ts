
'use client';

import { useState, useEffect } from 'react';

// Define the expected structure of a selected file
interface PickerFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

interface UseGooglePickerProps {
  apiKey: string;
  clientId: string;
  accessToken: string | null;
  onFilesSelected: (files: PickerFile[]) => void;
}

// Declare Google's global variables to satisfy TypeScript
declare const google: any;
declare const gapi: any;

export function useGooglePicker({
  apiKey,
  clientId,
  accessToken,
  onFilesSelected,
}: UseGooglePickerProps) {
  const [isPickerApiLoaded, setPickerApiLoaded] = useState(false);

  // EXPLANATION: This effect handles the loading of the external Google API script.
  // It runs only once when the component using the hook mounts.
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // After the main script loads, we specifically load the 'picker' module.
      gapi.load('picker', () => {
        setPickerApiLoaded(true);
      });
    };
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts.
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures it runs only once.

  const openPicker = () => {
    // EXPLANATION: These checks prevent the picker from being opened before the API is loaded or before the user is authenticated.
    if (!isPickerApiLoaded || !accessToken) {
      console.error('Picker cannot be opened.', { isPickerApiLoaded, hasToken: !!accessToken });
      alert('Google Drive connection is not ready. Please connect your account first.');
      return;
    }

    const picker = new google.picker.PickerBuilder()
      .setAppId(clientId)
      .setOAuthToken(accessToken)
      .setDeveloperKey(apiKey)
      .addView(google.picker.ViewId.DOCS) // View all documents
      .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          onFilesSelected(data.docs as PickerFile[]);
        }
      })
      .build();
    picker.setVisible(true);
  };

  return { openPicker, isPickerApiLoaded };
}