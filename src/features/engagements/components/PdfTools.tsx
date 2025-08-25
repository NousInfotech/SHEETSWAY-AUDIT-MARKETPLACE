'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  mergePdfs,
  splitPdf,
  renderPdfPageToCanvas,
  downloadFile
} from '@/lib/pdf-utils/pdf-utils';
import {
  File,
  UploadCloud,
  ArrowRight,
  Scissors,
  Copy,
  Trash2,
  Loader2,
  Download
} from 'lucide-react';

// Main component to switch between tools
export default function PdfTools() {
  const [tool, setTool] = useState<'merge' | 'split'>('merge');

  return (
    <div className='mx-auto w-full max-w-4xl rounded-lg bg-white p-4 shadow-xl sm:p-6 lg:p-8'>
      <div className='mb-6 flex justify-center border-b'>
        <button
          onClick={() => setTool('merge')}
          className={`px-6 py-3 text-lg font-semibold transition-colors ${tool === 'merge' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Merge PDF
        </button>
        <button
          onClick={() => setTool('split')}
          className={`px-6 py-3 text-lg font-semibold transition-colors ${tool === 'split' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Split PDF
        </button>
      </div>

      {tool === 'merge' ? <MergePdf /> : <SplitPdf />}
    </div>
  );
}

// --- Merge PDF Component ---
function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least two PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    try {
      const pdfBuffers = await Promise.all(
        files.map((file) => file.arrayBuffer())
      );
      const mergedPdfData = await mergePdfs(pdfBuffers);
      downloadFile(mergedPdfData, 'merged.pdf');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert(
        'An error occurred while merging the PDFs. Please check the console.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className='text-center'>
      <input
        type='file'
        accept='application/pdf'
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className='hidden'
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50'
        disabled={isProcessing}
      >
        <UploadCloud className='mr-2 h-5 w-5' />
        Select PDF Files
      </button>
      <p className='mt-2 text-sm text-gray-500'>
        Select two or more files to merge.
      </p>

      <div className='mt-6 space-y-3 text-left'>
        {files.map((file, index) => (
          <div
            key={index}
            className='flex items-center justify-between rounded-md border bg-gray-50 p-3'
          >
            <div className='flex items-center'>
              <File className='mr-3 h-6 w-6 text-blue-500' />
              <span className='font-medium'>{file.name}</span>
            </div>
            <button
              onClick={() => removeFile(index)}
              className='text-red-500 hover:text-red-700'
            >
              <Trash2 className='h-5 w-5' />
            </button>
          </div>
        ))}
      </div>

      {files.length > 1 && (
        <div className='mt-8'>
          <button
            onClick={handleMerge}
            className='inline-flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-4 text-base font-medium text-white hover:bg-green-700 disabled:opacity-50'
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Merging...
              </>
            ) : (
              <>
                Merge PDFs <ArrowRight className='ml-2 h-5 w-5' />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Split PDF Component ---
function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [ranges, setRanges] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return;

    const generateThumbnails = async () => {
      setIsProcessing(true);
      const buffer = await file.arrayBuffer();
      const tempUrls: string[] = [];
      const pdfForRendering = await import('pdfjs-dist').then(
        (pdfjs) => pdfjs.getDocument({ data: buffer.slice(0) }).promise
      );
      setTotalPages(pdfForRendering.numPages);

      for (let i = 1; i <= pdfForRendering.numPages; i++) {
        const canvas = document.createElement('canvas');
        await renderPdfPageToCanvas(buffer.slice(0), i, canvas);
        tempUrls.push(canvas.toDataURL());
      }
      setPageThumbnails(tempUrls);
      setIsProcessing(false);
    };

    generateThumbnails();
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPageThumbnails([]);
      setRanges('');
    }
  };

  const handleSplit = async () => {
    if (!file || !ranges) {
      alert('Please select a file and specify the page ranges to extract.');
      return;
    }
    setIsProcessing(true);
    try {
      const pdfBuffer = await file.arrayBuffer();
      const splitPdfData = await splitPdf(pdfBuffer, ranges);

      if (splitPdfData.length > 1) {
        // Logic to download as a zip might be needed here for many files
        // For now, download individually
        splitPdfData.forEach((pdf, index) => {
          downloadFile(
            pdf,
            `${file.name.replace('.pdf', '')}-part-${index + 1}.pdf`
          );
        });
      } else {
        downloadFile(
          splitPdfData[0],
          `${file.name.replace('.pdf', '')}-split.pdf`
        );
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert(
        'An error occurred while splitting the PDF. Please check the ranges and console.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='text-center'>
      {!file ? (
        <>
          <input
            type='file'
            accept='application/pdf'
            onChange={handleFileChange}
            ref={fileInputRef}
            className='hidden'
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700'
          >
            <UploadCloud className='mr-2 h-5 w-5' />
            Select a PDF File
          </button>
        </>
      ) : (
        <div className='text-left'>
          <div className='mb-4 rounded-md border bg-gray-50 p-3 font-medium'>
            {file.name}
          </div>
          {isProcessing && pageThumbnails.length === 0 && (
            <div className='flex h-40 items-center justify-center'>
              <Loader2 className='mr-2 h-8 w-8 animate-spin' />
              <span>Generating Page Previews...</span>
            </div>
          )}
          <div className='mb-6 grid max-h-80 grid-cols-3 gap-4 overflow-y-auto rounded border p-2 sm:grid-cols-4 md:grid-cols-6'>
            {pageThumbnails.map((src, index) => (
              <div key={index} className='text-center'>
                <img
                  src={src}
                  alt={`Page ${index + 1}`}
                  className='rounded border shadow-sm'
                />
                <p className='mt-1 text-xs'>{index + 1}</p>
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor='ranges'
              className='block text-sm font-medium text-gray-700'
            >
              Ranges to extract
            </label>
            <input
              type='text'
              id='ranges'
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder='e.g., 1, 3-5, 8'
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm'
            />
            <p className='mt-2 text-xs text-gray-500'>
              Use commas to separate pages or ranges. Example: 1-3 for pages 1
              to 3, 5 for page 5.
            </p>
          </div>

          <div className='mt-8'>
            <button
              onClick={handleSplit}
              className='inline-flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-4 text-base font-medium text-white hover:bg-green-700 disabled:opacity-50'
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  Splitting...
                </>
              ) : (
                <>
                  Split PDF <Scissors className='ml-2 h-5 w-5' />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
