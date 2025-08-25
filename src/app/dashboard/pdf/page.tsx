"use client"

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the PdfTools component and disable Server-Side Rendering (SSR) for it.
const PdfTools = dynamic(
  () => import('@/features/engagements/components/PdfTools'), 
  { 
    ssr: false,  // This is the crucial part
    loading: () => ( // Optional: Show a loading spinner while the component is being loaded
      <div className="flex items-center justify-center text-lg text-gray-600">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading PDF Tools...
      </div>
    )
  }
);

export default function PdfToolsPage() {
    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <PdfTools />
        </main>
    );
}