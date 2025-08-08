'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { renderAsync } from 'docx-preview';

// This is the actual viewer component logic
function Viewer() {
  const searchParams = useSearchParams();
  // This ref will be the container where the .docx content is rendered
  const viewerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('Document');
  const [fileType, setFileType] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This effect runs once to get the initial file info from the URL
    const url = searchParams.get('fileUrl');
    const name = searchParams.get('fileName');
    const type = searchParams.get('fileType');

    if (url && name && type) {
      setFileUrl(decodeURIComponent(url));
      setFileName(decodeURIComponent(name));
      setFileType(decodeURIComponent(type));
    } else {
      setError('File information is missing from the URL.');
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    // This effect runs once the file info is available and is responsible for rendering
    if (!fileUrl || !fileType) {
      return; // Wait for the file info
    }

    const isWordDoc = fileType.includes('wordprocessingml');
    const isNativelySupported =
      fileType.startsWith('application/pdf') ||
      fileType.startsWith('image/') ||
      fileType.startsWith('text/');

    if (isWordDoc) {
      // The target div (viewerRef) is now guaranteed to be in the DOM, so we can proceed.
      if (viewerRef.current) {
        fetch(fileUrl)
          .then((response) => response.blob())
          .then((blob) => {
            renderAsync(blob, viewerRef.current!)
              .then(() => {
                setIsLoading(false); // Success! Stop loading.
              })
              .catch((e) => {
                console.error('docx-preview error:', e);
                setError('Could not render the Word document.');
                setIsLoading(false);
              });
          })
          .catch((e) => {
            console.error('Fetch error:', e);
            setError('Could not load the file data from the URL.');
            setIsLoading(false);
          });
      }
    } else if (isNativelySupported) {
      // For native types, we don't need to do anything special, just stop loading.
      setIsLoading(false);
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
            <a
              href={fileUrl}
              download={fileName}
              className='mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Download File
            </a>
          </div>
        )}

        {/* We now render the correct container based on fileType, and control visibility with CSS */}
        <div
          style={{
            display: !isLoading && !error ? 'block' : 'none',
            height: '100%'
          }}
        >
          {isWordDoc && (
            // This div is now always in the DOM when it should be, solving the ref issue.
            <div ref={viewerRef} className='docx-container bg-white' />
          )}
          {isNativelySupported && (
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

// Wrap the component in Suspense because useSearchParams is a Client Component hook.
export default function DocumentViewerPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <Viewer />
    </Suspense>
  );
}
