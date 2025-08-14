// src/lib/google-picker.ts

// Define types for clarity
declare const google: any;
declare const gapi: any;

interface PickerFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export function openGooglePicker(
  accessToken: string,
  onFilesSelected: (files: PickerFile[]) => void
) {
  if (!gapi || !gapi.load) {
    console.error('Google API script not loaded.');
    alert("Could not connect to Google. Please refresh the page and try again.");
    return;
  }

  gapi.load('picker', () => {
    const picker = new google.picker.PickerBuilder()
      .setAppId(CLIENT_ID)
      .setOAuthToken(accessToken)
      .setDeveloperKey(API_KEY)
      .addView(google.picker.ViewId.DOCS) // View all files and folders
      .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          onFilesSelected(data.docs as PickerFile[]);
        }
      })
      .build();
    picker.setVisible(true);
  });
}