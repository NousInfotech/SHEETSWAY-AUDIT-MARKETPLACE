'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { renderAsync } from 'docx-preview';
import { getAccessUrlForFile } from '@/lib/aws-s3-utils'; // IMPORTANT: Import the AWS utility

// This is the actual viewer component logic
function Viewer() {
  const searchParams = useSearchParams();
  const viewerRef = useRef<HTMLDivElement>(null); // For docx-preview

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null); // This will hold the secure AWS URL
  const [fileName, setFileName] = useState<string>('Document');
  const [fileType, setFileType] = useState<string | null>(null);

  // Effect 1: Get parameters from URL and fetch the secure AWS URL
  useEffect(() => {
    console.log('VIEWER LOG 1: First useEffect has started.');
    const key = searchParams.get('fileKey');
    const name = searchParams.get('fileName');
    const type = searchParams.get('fileType');

    console.log(
      `VIEWER LOG 2: URL Params found - fileKey: ${key}, fileName: ${name}, fileType: ${type}`
    );

    if (!key || !name || !type) {
      setError('File information is missing from the URL.');
      setIsLoading(false);
      return;
    }

    setFileName(name);
    setFileType(type);

    console.log('VIEWER LOG 3: Calling getAccessUrlForFile...');

    // Fetch the secure, temporary access URL using the permanent fileKey
    getAccessUrlForFile(key)
      .then((accessUrl) => {
        console.log('VIEWER LOG 4: SUCCESS - Got secure URL:', accessUrl);
        if (!accessUrl) {
          console.error(
            'VIEWER LOG: ERROR - API returned a null or empty URL.'
          );
          setError('The server returned an invalid link for this file.');
          setIsLoading(false);
          return;
        }
        setFileUrl(accessUrl); // Now we have the real AWS URL to work with
      })
      .catch((err) => {
        console.error(
          'VIEWER LOG 5: FAILED - getAccessUrlForFile threw an error:',
          err
        );
        setError(
          'Could not retrieve a secure link for this file. It may have been moved or deleted.'
        );
        setIsLoading(false);
      });
  }, [searchParams]);

  // Effect 2: Render the document once the secure fileUrl is available
  useEffect(() => {
    console.log(
      `VIEWER LOG 6: Second useEffect has started. fileUrl is: ${fileUrl}`
    );
    if (!fileUrl || !fileType) {
      console.log('VIEWER LOG: Second useEffect is waiting for fileUrl...');
      return; // Wait for the secure URL to be fetched
    }

    const isWordDoc = fileType.includes('wordprocessingml');
    const isNativelySupported =
      fileType.startsWith('application/pdf') ||
      fileType.startsWith('image/') ||
      fileType.startsWith('text/');

    if (isWordDoc) {
      if (viewerRef.current) {
        fetch(fileUrl) // Use the secure URL
          .then((response) => response.blob())
          .then((blob) => {
            renderAsync(blob, viewerRef.current!)
              .then(() => setIsLoading(false))
              .catch((e) => {
                setError('Could not render the Word document.');
                setIsLoading(false);
              });
          })
          .catch((e) => {
            setError('Could not load the file data from the secure URL.');
            setIsLoading(false);
          });
      }
    } else if (isNativelySupported) {
      setIsLoading(false); // The iframe will handle it from here
    } else {
      setError(`Preview is not available for this file type (${fileType}).`);
      setIsLoading(false);
    }
  }, [fileUrl, fileType]); // This effect runs only when fileUrl or fileType changes

  const isWordDoc = fileType?.includes('wordprocessingml');
  const isNativelySupported =
    fileType?.startsWith('application/pdf') ||
    fileType?.startsWith('image/') ||
    fileType?.startsWith('text/');

  // --- RENDER LOGIC ---
  return (
    <div className='flex h-screen w-full flex-col'>
      <header className='flex-shrink-0 border-b bg-gray-50 p-4'>
        <h1 className='truncate text-lg font-semibold'>Viewing: {fileName}</h1>
      </header>
      <div className='h-full w-full flex-grow overflow-auto bg-gray-200'>
        {isLoading && (
          <div className='p-4 text-center'>Loading document preview...</div>
        )}
        {error && (
          <div className='p-8 text-center text-red-600'>
            <h2 className='text-xl font-bold'>Preview Error</h2>
            <p className='mt-2'>{error}</p>
            {fileUrl && ( // Only show download button if we have a URL
              <a
                href={fileUrl}
                download={fileName}
                className='mt-4 inline-block ...'
              >
                Download File
              </a>
            )}
          </div>
        )}
        <div
          style={{
            display: !isLoading && !error ? 'block' : 'none',
            height: '100%'
          }}
        >
          {isWordDoc && (
            <div ref={viewerRef} className='docx-container bg-white' />
          )}
          {isNativelySupported && fileUrl && (
            <iframe
              src={fileUrl}
              className='h-full w-full border-none'
              title={fileName}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the component in Suspense
export default function DocumentViewerPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <Viewer />
    </Suspense>
  );
}
