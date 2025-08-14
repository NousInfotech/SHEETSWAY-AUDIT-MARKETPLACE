// In a new or existing auth helper file
import {
  getAuth,
  GoogleAuthProvider,
  linkWithPopup, // <-- IMPORTANT: Use linkWithPopup, not signInWithPopup
} from 'firebase/auth';

export const linkGoogleAccount = async () => {
  try {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const provider = new GoogleAuthProvider();
    // Ask for the necessary permission
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');

    // Use linkWithPopup to connect to the existing user session
    const result = await linkWithPopup(auth.currentUser, provider);

    // Get the OAuth access token from the result
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const googleAccessToken = credential?.accessToken;

    if (!googleAccessToken) {
      throw new Error("Could not retrieve Google Drive access token during linking.");
    }

    // Save the token to be used by the application
    localStorage.setItem('googleDriveAccessToken', googleAccessToken);
    
    console.log("Successfully linked Google Account and stored access token!");
    alert("Google Drive connected!");
    
    // Return the token so the UI can update immediately
    return googleAccessToken;

  } catch (error: any) {
    // Handle common errors, like if the Google account is already linked to another user
    if (error.code === 'auth/credential-already-in-use') {
      alert("This Google account is already linked to another user.");
    } else {
      console.error("Error linking Google account:", error);
      alert("Failed to connect Google Drive. Please try again.");
    }
    return null;
  }
};