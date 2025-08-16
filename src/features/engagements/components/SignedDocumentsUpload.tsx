'use client';
import { makeEngaementToStart } from '@/api/engagement';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ENGAGEMENT_API } from '@/config/api';
import instance from '@/lib/axios';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

// A small helper component to display uploaded file info, to avoid repetition.
const UploadedFileInfo = ({ doc, onPreview, loadingPreviewKey }: any) => {
  if (!doc) return null;
  const isLoading = loadingPreviewKey === doc.fileKey;

  return (
    <div className='mt-4 rounded-lg border'>
      <h3 className='text-foreground border-b px-4 py-2 text-sm font-medium'>
        Uploaded File
      </h3>
      <ul className='divide-y'>
        <li key={doc.fileKey} className='flex items-center justify-between p-3'>
          <div className='flex items-center space-x-3 overflow-hidden'>
            <FileIcon className='text-muted-foreground h-5 w-5 flex-shrink-0' />
            <span
              className='text-foreground truncate text-sm'
              title={doc.fileName}
            >
              {doc.fileName}
            </span>
          </div>
          <button
            type='button'
            onClick={() => onPreview(doc.fileKey)}
            disabled={isLoading}
            className={cn(
              'text-primary ml-4 flex-shrink-0 text-sm font-medium hover:underline focus:outline-none',
              isLoading && 'cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <Spinner size={16} />
                <span>Loading...</span>
              </div>
            ) : (
              'Preview'
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

function SignedDocumentsUpload({ engagement }: any) {
  const router = useRouter();
  // State for files selected in the uploader inputs
  const [ndaInputFile, setNdaInputFile] = useState<File[]>([]);
  const [engagementLetterInputFile, setEngagementLetterInputFile] = useState<
    File[]
  >([]);

  // State for successfully uploaded document data from S3
  const [ndaDocument, setNdaDocument] = useState<{
    fileName: string;
    fileUrl: string;
    fileKey: string;
  } | null>(null);
  const [engagementLetterDocument, setEngagementLetterDocument] = useState<{
    fileName: string;
    fileUrl: string;
    fileKey: string;
  } | null>(null);

  // State for UI feedback
  const [uploading, setUploading] = useState<'nda' | 'engagementLetter' | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [loadingPreviewKey, setLoadingPreviewKey] = useState<string | null>(
    null
  );

  const getUploadUrl = async (
    fileName: string,
    contentType: string,
    folder?: string
  ) => {
    const response = await instance.post('/api/v1/upload/single', {
      fileName,
      contentType,
      folder
    });
    return response.data;
  };

  const getAccessUrl = async (fileKey: string, expiresIn = 10000) => {
    const response = await instance.post('/api/v1/upload/single/access', {
      fileKey,
      expiresIn
    });
    return response.data;
  };

  const handleFileUpload = async (
    file: File,
    docType: 'nda' | 'engagementLetter'
  ) => {
    if (!file) {
      toast.warning('No file selected for upload.');
      return;
    }

    setUploading(docType);
    try {
      const { uploadUrl, fileUrl, fileKey } = await getUploadUrl(
        file.name,
        file.type,
        'signed-documents'
      );

      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });

      if (!s3Response.ok) {
        throw new Error('S3 upload failed');
      }

      const uploadedDocData = { fileName: file.name, fileUrl, fileKey };

      if (docType === 'nda') {
        setNdaDocument(uploadedDocData);
        setNdaInputFile([]);
      } else {
        setEngagementLetterDocument(uploadedDocData);
        setEngagementLetterInputFile([]);
      }

      toast.success(
        `${docType === 'nda' ? 'NDA' : 'Engagement Letter'} uploaded successfully.`
      );
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('File upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  async function handlePreview(fileKey: string) {
    setLoadingPreviewKey(fileKey);
    try {
      const urlToOpen = await getAccessUrl(fileKey);
      if (!urlToOpen || typeof urlToOpen !== 'string') {
        throw new Error('Invalid access URL received from server.');
      }
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to get preview URL:', error);
      toast.error('Could not generate file preview. Please try again.');
    } finally {
      setLoadingPreviewKey(null);
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ndaDocument || !engagementLetterDocument) {
      toast.error(
        'Please upload both the NDA and the Engagement Letter before submitting.'
      );
      return;
    }

    setSubmitting(true);
    const body = {
      nda: { fileName: ndaDocument.fileName, fileKey: ndaDocument.fileKey },
      engagementLetter: {
        fileName: engagementLetterDocument.fileName,
        fileKey: engagementLetterDocument.fileKey
      }
    };

    try {
      if (engagement.status === 'PENDING') {
        await makeEngaementToStart(engagement.id);
      }
      await instance.patch(
        `${ENGAGEMENT_API}/${engagement.id}/pre-engagement-documents/submit`,
        body
      );
      toast.success('Documents submitted successfully!');
      setNdaDocument(null);
      setEngagementLetterDocument(null);
      router.refresh();
      router.push('/dashboard/engagements');
    } catch (error) {
      console.error('Failed to submit documents:', error);
      toast.error('An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='p-4'>
      <form onSubmit={onSubmit} className='space-y-8'>
        {/* NDA Uploader Section */}
        <div>
          <label className='mb-2 block font-medium'>
            NDA (Non-Disclosure Agreement)
          </label>
          <p className='py-1 text-sm text-gray-500'>
            Please upload the signed NDA document.
          </p>
          {!ndaDocument ? (
            <FileUploader
              value={ndaInputFile}
              onValueChange={setNdaInputFile}
              onUpload={(files) => handleFileUpload(files[0], 'nda')}
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
              accept={{ 'application/pdf': ['.pdf'] }}
              disabled={uploading === 'nda' || uploading === 'engagementLetter'}
              showPreview={false}
            />
          ) : (
            <UploadedFileInfo
              doc={ndaDocument}
              onPreview={handlePreview}
              loadingPreviewKey={loadingPreviewKey}
            />
          )}
        </div>

        {/* Engagement Letter Uploader Section */}
        <div>
          <label className='mb-2 block font-medium'>Engagement Letter</label>
          <p className='py-1 text-sm text-gray-500'>
            Please upload the signed Engagement Letter.
          </p>
          {!engagementLetterDocument ? (
            <FileUploader
              value={engagementLetterInputFile}
              onValueChange={setEngagementLetterInputFile}
              onUpload={(files) =>
                handleFileUpload(files[0], 'engagementLetter')
              }
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
              accept={{ 'application/pdf': ['.pdf'] }}
              disabled={uploading === 'nda' || uploading === 'engagementLetter'}
              showPreview={false}
            />
          ) : (
            <UploadedFileInfo
              doc={engagementLetterDocument}
              onPreview={handlePreview}
              loadingPreviewKey={loadingPreviewKey}
            />
          )}
        </div>

        <Button
          type='submit'
          disabled={
            submitting ||
            uploading !== null ||
            !ndaDocument ||
            !engagementLetterDocument
          }
          className='w-full'
        >
          {submitting ? 'Submitting...' : 'Submit Documents'}
        </Button>
      </form>
    </div>
  );
}

export default SignedDocumentsUpload;
