// src/lib/auth-functions.ts

import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth';

// Import the already initialized 'auth' instance from your firebase config file.
import { auth } from '@/lib/firebase';

export const linkGoogleAccount = async () => {
  try {
    // Now 'auth' is the initialized service. We do NOT call getAuth() anymore.
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');

    const result = await linkWithPopup(auth.currentUser, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const googleAccessToken = credential?.accessToken;

    if (!googleAccessToken) {
      throw new Error("Could not retrieve Google Drive access token during linking.");
    }

    localStorage.setItem('googleDriveAccessToken', googleAccessToken);
    console.log("Successfully linked Google Account and stored access token!");
    
    return googleAccessToken;

  } catch (error: any) {
    if (error.code === 'auth/credential-already-in-use') {
      alert("This Google account is already linked to another user.");
    } else {
      console.error("Error linking Google account:", error);
      alert("Failed to connect Google Drive. Please try again.");
    }
    return null;
  }
};