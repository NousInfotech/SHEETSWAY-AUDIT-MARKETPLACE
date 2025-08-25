import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// Configuration for pdf.js worker.
// This now points to the local copy in our /public directory.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

/**
 * Merges an array of PDF files (as ArrayBuffers) into a single PDF.
 * @param pdfBuffers An array of ArrayBuffers, each representing a PDF file.
 * @returns A Uint8Array representing the merged PDF file.
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

/**
 * Splits a PDF into multiple documents based on specified page ranges.
 * @param pdfBuffer The ArrayBuffer of the PDF file to split.
 * @param ranges A string representing page ranges (e.g., "1, 3-5, 8").
 * @returns An array of Uint8Arrays, each representing a new PDF file.
 */
export async function splitPdf(pdfBuffer: ArrayBuffer, ranges: string): Promise<Uint8Array[]> {
  const originalPdf = await PDFDocument.load(pdfBuffer);
  const pageIndices = parsePageRanges(ranges, originalPdf.getPageCount());
  
  const groupedPages = groupConsecutivePages(pageIndices);
  
  const pdfs: Uint8Array[] = [];

  for (const group of groupedPages) {
    if (group.length === 0) continue;
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(originalPdf, group);
    copiedPages.forEach(page => newPdf.addPage(page));
    pdfs.push(await newPdf.save());
  }

  return pdfs;
}

/**
 * Renders a specific page of a PDF onto a canvas element.
 * @param pdfBuffer The ArrayBuffer of the PDF file.
 * @param pageNum The page number to render (1-based).
 * @param canvas The HTMLCanvasElement to draw the page onto.
 */
export async function renderPdfPageToCanvas(pdfBuffer: ArrayBuffer, pageNum: number, canvas: HTMLCanvasElement) {
  const pdf = await pdfjs.getDocument({ data: pdfBuffer }).promise;
  const page = await pdf.getPage(pageNum);

  const viewport = page.getViewport({ scale: 0.5 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get 2D context from canvas');
  }

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext as any).promise;
}


// --- Helper functions for splitting ---

function parsePageRanges(rangeStr: string, maxPage: number): number[] {
  const indices = new Set<number>();
  if (!rangeStr) return [];
  
  const parts = rangeStr.replace(/\s/g, '').split(',');

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= maxPage) indices.add(i - 1);
        }
      }
    } else {
      const page = Number(part);
      if (!isNaN(page) && page > 0 && page <= maxPage) {
        indices.add(page - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

function groupConsecutivePages(indices: number[]): number[][] {
    if (indices.length === 0) return [];
    
    const groups: number[][] = [[indices[0]]];
    
    for (let i = 1; i < indices.length; i++) {
        if (indices[i] === indices[i-1] + 1) {
            groups[groups.length - 1].push(indices[i]);
        } else {
            groups.push([indices[i]]);
        }
    }
    return groups;
}

/**
 * Helper function to trigger a file download in the user's browser.
 * @param data The file data as a Uint8Array or Blob.
 * @param fileName The name for the downloaded file.
 * @param mimeType The MIME type of the file.
 */
export function downloadFile(data: Uint8Array | Blob, fileName: string, mimeType = 'application/pdf') {
    const blob = data instanceof Blob ? data : new Blob([new Uint8Array(data)], { type: mimeType });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}