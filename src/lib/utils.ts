import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

const auth = getAuth(app);

// This function needs to be async now because getting the ID token is an async operation
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    // This is the official Firebase function to get the ID token
    // The `true` argument forces a refresh if the token is expired.
    return await user.getIdToken(true);
  }
  return null;
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}



// get latest firebase refresh token

export const getLatestToken = async (): Promise<string | null> => {
  const auth = getAuth();
  if (auth.currentUser) {
    try {
      // Force refresh the token
      const token = await auth.currentUser.getIdToken(true);
      return token;
    } catch (error) {
      console.error('Error refreshing Firebase ID token:', error);
      return null;
    }
  }
  return null;
};






// utils/token.ts

const TOKEN_KEY = 'sheetsway-007';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};



export const generateYearOptions = (start: number, end: number): number[] => {
  const years: number[] = [];
  for (let y = end; y >= start; y--) {
    years.push(y);
  }
  return years;
};
