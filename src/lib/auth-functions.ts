// src/lib/auth-functions.ts

import {
  GoogleAuthProvider,
  linkWithRedirect,
  getRedirectResult,
  User // EXPLANATION: Importing the User type for better type safety.
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Starts the process to link a Google account by redirecting the user.
 * This should be called when a user, who is already signed in, wants to connect their Google Drive.
 * @param {User} currentUser The currently authenticated Firebase user.
 */
export const linkGoogleAccountRedirect = async (currentUser: User) => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    // EXPLANATION: linkWithRedirect is more reliable than popups, especially on mobile devices.
    await linkWithRedirect(currentUser, provider);
  } catch (error: any) {
    console.error('Error starting Google account link redirect:', error);
    alert('Could not start the Google Drive connection process. Please try again.');
  }
};

/**
 * Completes the linking process when the user is redirected back to the app.
 * This function checks the URL for authentication results from Google.
 * @returns {Promise<string | null>} The Google OAuth access token if successful, otherwise null.
 */
export const completeGoogleLinkRedirect = async (): Promise<string | null> => {
  try {
    const result = await getRedirectResult(auth);
    // EXPLANATION: If 'result' is null, it means the page was loaded normally, not after a redirect.
    // This is expected on the initial page load.
    if (!result) {
      return null;
    }
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const googleAccessToken = credential?.accessToken;

    if (!googleAccessToken) {
      throw new Error('Could not retrieve Google Drive access token after redirect.');
    }

    localStorage.setItem('googleDriveAccessToken', googleAccessToken);
    console.log('Successfully linked Google Account and stored access token!');
    
    return googleAccessToken;
  } catch (error: any) {
    if (error.code === 'auth/credential-already-in-use') {
      alert('This Google account is already linked to another user.');
    } else {
      console.error('Error completing Google account link:', error);
      alert('Failed to connect Google Drive. Please try again.');
    }
    return null;
  }
};