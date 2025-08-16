// // src/lib/auth-functions.ts

// import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth';

// // Import the already initialized 'auth' instance from your firebase config file.
// import { auth } from '@/lib/firebase';

// export const linkGoogleAccount = async () => {
//   try {
//     // Now 'auth' is the initialized service. We do NOT call getAuth() anymore.
//     if (!auth.currentUser) {
//       throw new Error("No user is currently signed in.");
//     }

//     const provider = new GoogleAuthProvider();
//     provider.addScope('https://www.googleapis.com/auth/drive.readonly');

//     const result = await linkWithPopup(auth.currentUser, provider);
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const googleAccessToken = credential?.accessToken;

//     if (!googleAccessToken) {
//       throw new Error("Could not retrieve Google Drive access token during linking.");
//     }

//     localStorage.setItem('googleDriveAccessToken', googleAccessToken);
//     console.log("Successfully linked Google Account and stored access token!");
    
//     return googleAccessToken;

//   } catch (error: any) {
//     if (error.code === 'auth/credential-already-in-use') {
//       alert("This Google account is already linked to another user.");
//     } else {
//       console.error("Error linking Google account:", error);
//       alert("Failed to connect Google Drive. Please try again.");
//     }
//     return null;
//   }
// };









// ##########################################################################################################







// src/lib/auth-functions.ts

import { 
  GoogleAuthProvider, 
  linkWithRedirect, // Import linkWithRedirect
  getRedirectResult // Import getRedirectResult to handle the return
} from 'firebase/auth';

// Import the already initialized 'auth' instance from your firebase config file.
import { auth } from '@/lib/firebase';

// This function STARTS the linking process by redirecting the user
export const linkGoogleAccountRedirect = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    
    // This will navigate the user away from your app to Google
    await linkWithRedirect(auth.currentUser, provider);

  } catch (error: any) {
    console.error("Error starting Google account link redirect:", error);
    alert("Could not start the Google Drive connection process. Please try again.");
  }
};

// This function COMPLETES the linking process when the user returns to your app
export const completeGoogleLinkRedirect = async (): Promise<string | null> => {
   console.log('TIMELINE STEP 3: Inside completeGoogleLinkRedirect function.');
  try {
    const result = await getRedirectResult(auth);
    console.log('TIMELINE STEP 4: getRedirectResult returned:', result);

    // If result is null, it means the page was loaded without a redirect
    if (!result) {
      console.log('No redirect result found. This is normal on first load.');
      return null;
    }
    
    console.log('SUCCESS: A redirect result was found!');
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const googleAccessToken = credential?.accessToken;

    if (!googleAccessToken) {
      throw new Error("Could not retrieve Google Drive access token after redirect.");
    }

    localStorage.setItem('googleDriveAccessToken', googleAccessToken);
    console.log("Successfully linked Google Account and stored access token!");
    
    return googleAccessToken;

  } catch (error: any) {
    if (error.code === 'auth/credential-already-in-use') {
      alert("This Google account is already linked to another user.");
    } else {
      console.error("Error completing Google account link:", error);
      alert("Failed to connect Google Drive after returning. Please try again.");
    }
    return null;
  }
};