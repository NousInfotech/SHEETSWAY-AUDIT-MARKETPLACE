'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { useAuth } from '@/components/layout/providers';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import {
  linkGoogleAccountRedirect,
  completeGoogleLinkRedirect
} from '@/lib/auth-functions';

// EXPLANATION: Ensure this path correctly points to your useGooglePicker hook file.
import { useGooglePicker } from '@/features/engagements/hooks/use-google-picker';

// Icons & Components
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

// Declare Dropbox for the Dropbox Chooser script, if you are using it.
declare const Dropbox: any;

// --- MAIN COMPONENT ---
export function FileUploadZone() {
  const router = useRouter();
  const { firebaseUser: user } = useAuth();
  const [localFiles, setLocalFiles] = useState<FileWithPath[]>([]);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    null
  );
  const [isDropboxConnected, setDropboxConnected] = useState(false); // Placeholder for Dropbox logic
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

  // --- Google Picker Hook Integration ---
  const { openPicker } = useGooglePicker({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    accessToken: googleAccessToken,
    onFilesSelected: (files) => {
      console.log('Files selected from Google Drive:', files);
      alert(`You selected ${files.length} file(s) from Google Drive!`);
      // You can further process the selected files here
    }
  });

  // Effect 1: Checks for a redirect result ONCE on component mount.
  useEffect(() => {
    const checkRedirect = async () => {
      const token = await completeGoogleLinkRedirect();
      if (token) {
        setGoogleAccessToken(token);
      }
      setIsCheckingRedirect(false);
    };
    checkRedirect();
  }, []); // Empty dependency array is crucial for running this only once.

  // Effect 2: Syncs the access token state with localStorage and the user's auth status.
  useEffect(() => {
    if (user) {
      const storedToken = localStorage.getItem('googleDriveAccessToken');
      if (storedToken) {
        setGoogleAccessToken(storedToken);
      }
    } else {
      // If user logs out, clear the token from state and storage.
      setGoogleAccessToken(null);
      localStorage.removeItem('googleDriveAccessToken');
    }
  }, [user]);

  // Callback for handling local file drops
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setLocalFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  // Removes a file from the staged local files list
  const handleRemoveFile = (path: string) => {
    setLocalFiles((prevFiles) =>
      prevFiles.filter((file) => file.path !== path)
    );
  };

  // Starts the Google account linking process
  const handleConnectGoogle = async () => {
    if (user) {
      await linkGoogleAccountRedirect(user);
    } else {
      alert('Please sign in to connect your Google Account.');
    }
  };

  // --- Dropbox Handlers (as per your original code) ---
  const handleConnectDropbox = () => {
    if (user) {
      router.push(`/api/auth/dropbox/redirect?uid=${user.uid}`);
    }
  };

  const handleSelectFromDropbox = () => {
    if (!isDropboxConnected) return;
    Dropbox.choose({
      success: (files: any[]) => {
        alert(
          `You selected ${files.length} file(s) from Dropbox! Check the console.`
        );
        console.log('Selected files from Dropbox:', files);
      },
      linkType: 'direct',
      multiselect: true
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog
  } = useDropzone({
    onDrop,
    noKeyboard: true
  });

  // Render a loading state while checking for the redirect result
  if (isCheckingRedirect) {
    return <div>Loading...</div>; // Or a more sophisticated spinner component
  }

  return (
    <div className='mx-auto w-full max-w-4xl'>
      {/* --- The Dropzone Area --- */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          isDragActive ? 'shadow-primary/20 scale-105 shadow-2xl' : ''
        }`}
      >
        <div
          {...getRootProps()}
          className={`bg-card/50 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors duration-300 ${
            isDragActive ? 'border-primary' : 'border-border'
          }`}
        >
          <div className='from-primary/5 absolute inset-0 -z-10 bg-gradient-to-br to-transparent'></div>
          <input {...getInputProps()} />
          <motion.div
            animate={{
              y: isDragActive ? -10 : 0,
              scale: isDragActive ? 1.1 : 1
            }}
            className='bg-background mb-4 rounded-full p-4 shadow-md'
          >
            <UploadCloud className='text-primary h-12 w-12' />
          </motion.div>
          <h1 className='text-foreground text-3xl font-bold tracking-tight'>
            Organize Your Files
          </h1>
          <p className='text-muted-foreground mt-2 text-lg'>
            Drag & drop files here
          </p>
        </div>
      </motion.div>

      {/* --- Divider --- */}
      <div className='my-8 flex items-center'>
        <div className='border-border flex-grow border-t'></div>
        <span className='text-muted-foreground mx-4 flex-shrink text-xs font-semibold uppercase'>
          OR SELECT A SOURCE
        </span>
        <div className='border-border flex-grow border-t'></div>
      </div>

      {/* --- Source Selection Grid --- */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Source: Your Computer */}
        <SourceButton
          icon={<UploadCloud className='text-foreground/80 h-8 w-8' />}
          title='Your Computer'
          description='Browse local files'
          onClick={openFileDialog}
        />

        {/* Source: Google Drive */}
        <SourceButton
          icon={
            <Image
              src='/assets/google-drive-logo2.png'
              alt='Google Drive'
              width={32}
              height={32}
            />
          }
          title='Google Drive'
          // EXPLANATION: Corrected `accessToken` to `googleAccessToken`
          description={
            user && googleAccessToken
              ? 'Select from Drive'
              : 'Connect your account'
          }
          // EXPLANATION: Corrected logic to use `openPicker` from the hook or `handleConnectGoogle`
          onClick={user && googleAccessToken ? openPicker : handleConnectGoogle}
          disabled={!user}
        />

        {/* Source: Dropbox */}
        <SourceButton
          icon={
            <Image
              src='/assets/dropbox-logo.png'
              alt='Dropbox'
              width={32}
              height={32}
            />
          }
          title='Dropbox'
          description='Connect your account' // This can be updated when Dropbox logic is complete
          onClick={
            isDropboxConnected ? handleSelectFromDropbox : handleConnectDropbox
          }
          disabled={!user}
        />
      </div>

      {/* --- Staged Files List --- */}
      <AnimatePresence>
        {localFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className='bg-card/50 mt-10 rounded-xl border p-6'
          >
            <h3 className='mb-4 text-lg font-semibold'>Ready to Organize</h3>
            <ul className='space-y-3'>
              {localFiles.map((file) => (
                <motion.li
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  key={file.path}
                  className='bg-background hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors'
                >
                  <div className='flex items-center gap-3 overflow-hidden'>
                    <FileIcon className='text-muted-foreground h-5 w-5 flex-shrink-0' />
                    <span className='text-foreground truncate text-sm font-medium'>
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 flex-shrink-0 rounded-full'
                    onClick={() => handleRemoveFile(file.path!)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Reusable Button Component for Sources ---
interface SourceButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

function SourceButton({
  icon,
  title,
  description,
  onClick,
  disabled = false
}: SourceButtonProps) {
  return (
    <motion.button
      type='button'
      whileHover={{
        y: -5,
        boxShadow:
          '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className='bg-card hover:border-primary/50 flex h-full w-full flex-col items-center justify-center space-y-3 rounded-xl border p-6 text-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50'
    >
      <div className='bg-background flex h-16 w-16 items-center justify-center rounded-2xl'>
        {icon}
      </div>
      <div className='pt-2'>
        <h4 className='text-foreground font-semibold'>{title}</h4>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>
    </motion.button>
  );
}
