'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { useAuth } from '@/components/layout/providers'; // Your custom auth hook
import { linkGoogleAccount } from '@/lib/auth-functions';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Icons & Components
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

// --- (Optional but recommended) Your GoogleDrivePicker logic should be in a hook or separate file ---
// For this example, we'll assume the logic is available to be called directly.
import { openGooglePicker } from '@/lib/google-picker'; // We'll create this helper
import { useRouter } from 'next/navigation';


declare const Dropbox: any;

// --- MAIN COMPONENT ---
export function FileUploadZone() {
  const router = useRouter();
  const { firebaseUser: user } = useAuth();
  const [localFiles, setLocalFiles] = useState<FileWithPath[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDropboxConnected, setDropboxConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('googleDriveAccessToken');
    if (user && token) {
      setAccessToken(token);
    } else {
      setAccessToken(null);
      localStorage.removeItem('googleDriveAccessToken');
    }
  }, [user]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setLocalFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleRemoveFile = (path: string) => {
    setLocalFiles((prevFiles) =>
      prevFiles.filter((file) => file.path !== path)
    );
  };

  const handleConnectGoogle = async () => {
    const token = await linkGoogleAccount();
    if (token) setAccessToken(token);
  };

  const handleSelectFromGoogle = () => {
    if (!accessToken) return;
    openGooglePicker(accessToken, (files) => {
      console.log('Files selected from Google Drive:', files);
      alert(`You selected ${files.length} file(s) from Google Drive!`);
    });
  };

  const handleDropboxClick = () => {
    alert('Dropbox integration logic would be triggered here!');
  };

  const handleConnectDropbox = () => {
    if (user) {
      router.push(`/api/auth/dropbox/redirect?uid=${user.uid}`);
    }
  };

  

  const handleSelectFromDropbox = () => {
    if (!isDropboxConnected) return;

    // Use the global Dropbox object to open the Chooser
    Dropbox.choose({
      success: (files: any[]) => {
        alert(
          `You selected ${files.length} file(s) from Dropbox! Check the console.`
        );
        console.log('Selected files from Dropbox:', files);
      },
      linkType: 'direct', // Provides a direct link to the file content
      multiselect: true
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true
  });

  const { open: openFileDialog } = useDropzone({ onDrop });

  return (
    <div className='mx-auto w-full max-w-4xl'>
      {/* --- The Dropzone Area --- */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${isDragActive ? 'shadow-primary/20 scale-105 shadow-2xl' : ''}`}
      >
        {/* The inner div gets the dropzone props */}
        <div
          {...getRootProps()}
          className={`bg-card/50 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors duration-300 ${isDragActive ? 'border-primary' : 'border-border'}`}
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
          description={
            user && accessToken ? 'Select from Drive' : 'Connect your account'
          }
          onClick={
            user && accessToken ? handleSelectFromGoogle : handleConnectGoogle
          }
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
          description='Connect your account'
          onClick={
            isDropboxConnected ? handleSelectFromDropbox : handleConnectDropbox
          }
          // disabled={!user} // Enable when logic is ready
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

// --- A Reusable, Beautiful Button Component for Sources ---
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
      type='button' // Explicitly set the type to "button" to avoid any form submission behavior
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
