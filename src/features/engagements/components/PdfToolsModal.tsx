'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  mergePdfs,
  splitPdf,
  renderPdfPageToCanvas,
  downloadFile,
} from '@/lib/pdf-utils/pdf-utils'; // Your existing PDF utilities
import {
  File as FileIcon,
  Loader2,
} from 'lucide-react';

// 1. IMPORT THE AWS UTILITY DIRECTLY
import { getAccessUrlForFile } from '@/lib/aws-s3-utils';

// Define the shape of the file data this component receives
interface FileToProcess {
  id: string;
  name: string;
  url: string; // This is the S3 file key
}

interface PdfToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileToProcess[];
  mode: 'split' | 'merge';
}

export function PdfToolsModal({ isOpen, onClose, files, mode }: PdfToolsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For the splitter
  const [splitRanges, setSplitRanges] = useState('');
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);

  const fileToSplit = mode === 'split' && files.length === 1 ? files[0] : null;

  // Effect to generate thumbnails for the splitter
  useEffect(() => {
    if (mode !== 'split' || !fileToSplit || !isOpen) {
      setPageThumbnails([]);
      return;
    }

    const generateThumbnails = async () => {
      setIsProcessing(true);
      setError(null);
      try {
        // 2. CALL getAccessUrlForFile DIRECTLY FROM THE CLIENT
        const accessUrl = await getAccessUrlForFile(fileToSplit.url);
        if (!accessUrl) throw new Error("Could not get a secure URL for the file.");

        // 3. FETCH DIRECTLY FROM THE SECURE S3 URL
        const response = await fetch(accessUrl);
        if (!response.ok) throw new Error('Failed to fetch file for preview.');

        const buffer = await response.arrayBuffer();
        const tempUrls: string[] = [];
        const pdfForRendering = await import('pdfjs-dist').then((pdfjs) =>
          pdfjs.getDocument({ data: buffer.slice(0) }).promise
        );

        for (let i = 1; i <= pdfForRendering.numPages; i++) {
          const canvas = document.createElement('canvas');
          await renderPdfPageToCanvas(buffer.slice(0), i, canvas);
          tempUrls.push(canvas.toDataURL());
        }
        setPageThumbnails(tempUrls);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Could not generate page previews.');
      } finally {
        setIsProcessing(false);
      }
    };

    generateThumbnails();
  }, [fileToSplit, isOpen, mode]);

  // Fetches all selected files and merges them
  const handleMerge = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // 2. CALL getAccessUrlForFile FOR EACH FILE
      const fetchPromises = files.map(async (file) => {
        const accessUrl = await getAccessUrlForFile(file.url);
        if (!accessUrl) throw new Error(`Could not get URL for ${file.name}`);
        
        // 3. FETCH DIRECTLY FROM THE SECURE S3 URL
        const response = await fetch(accessUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${file.name}`);
        return response.arrayBuffer();
      });

      const pdfBuffers = await Promise.all(fetchPromises);
      const mergedPdfData = await mergePdfs(pdfBuffers);
      downloadFile(mergedPdfData, 'merged-document.pdf');
      onClose(); // Close modal on success
    } catch (err: any) {
      console.error('Error merging PDFs:', err);
      setError(err.message || 'An error occurred while merging the files.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetches the single selected file and splits it
  const handleSplit = async () => {
    if (!fileToSplit || !splitRanges) return;
    setIsProcessing(true);
    setError(null);
    try {
        // 2. CALL getAccessUrlForFile DIRECTLY
        const accessUrl = await getAccessUrlForFile(fileToSplit.url);
        if (!accessUrl) throw new Error("Could not get a secure URL for the file.");

        // 3. FETCH DIRECTLY FROM THE SECURE S3 URL
        const response = await fetch(accessUrl);
        if (!response.ok) throw new Error('Failed to fetch file.');

        const pdfBuffer = await response.arrayBuffer();
        const splitPdfData = await splitPdf(pdfBuffer, splitRanges);
        
        // This is a placeholder for a future enhancement
        if (splitPdfData.length > 1) {
            alert("Splitting into multiple files is supported, but each will be downloaded individually for now.");
        }
        
        splitPdfData.forEach((pdfData, index) => {
          downloadFile(pdfData, `${fileToSplit.name.replace('.pdf', '')}-split-${index + 1}.pdf`);
        });

        onClose(); // Close modal on success
    } catch (err: any) {
        console.error('Error splitting PDF:', err);
        setError(err.message || 'An error occurred. Check if your page ranges are valid.');
    } finally {
        setIsProcessing(false);
    }
  };

  // ... the rest of your renderContent and JSX for the modal remains exactly the same ...
  // (The code below is unchanged)

  const renderContent = () => {
    if (mode === 'merge') {
      return (
        <div>
          <DialogDescription>
            The following {files.length} files will be merged in the order they are listed.
          </DialogDescription>
          <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded-md border">
                <FileIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="font-medium text-sm truncate">{file.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleMerge}
            className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Merge and Download'}
          </button>
        </div>
      );
    }

    if (mode === 'split' && fileToSplit) {
      return (
        <div>
           <DialogDescription>
            File to split: <strong>{fileToSplit.name}</strong>
          </DialogDescription>
          
          {isProcessing && pageThumbnails.length === 0 && (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Generating Page Previews...</span>
             </div>
          )}

          {pageThumbnails.length > 0 && (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 my-4 max-h-60 overflow-y-auto p-2 border rounded">
                {pageThumbnails.map((src, index) => (
                    <div key={index} className="text-center">
                        <img src={src} alt={`Page ${index + 1}`} className="border rounded shadow-sm"/>
                        <p className="text-xs mt-1">{index + 1}</p>
                    </div>
                ))}
              </div>
              <div>
                  <label htmlFor="ranges" className="block text-sm font-medium text-gray-700">Ranges to extract</label>
                  <input
                      type="text"
                      id="ranges"
                      value={splitRanges}
                      onChange={(e) => setSplitRanges(e.target.value)}
                      placeholder="e.g., 1, 3-5, 8"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
              </div>
            </>
          )}

          <button
            onClick={handleSplit}
            className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={isProcessing || pageThumbnails.length === 0}
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Split and Download'}
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{mode} PDF Files</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
        <div className="py-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}