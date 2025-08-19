'use client';
import React, { useEffect, useState } from 'react';
import { getAuditorById } from '@/api/auditor.api';
import { ChatThread } from '@/features/chat/components/ChatThread';

export default function ChatOnlyView({ engagement }: any) {
  const [auditor, setAuditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (engagement?.proposal?.auditorId) {
      const findAuditor = async () => {
        try {
          const currentAuditor = await getAuditorById(
            engagement.proposal.auditorId
          );
          setAuditor(currentAuditor);
        } catch (error) {
          console.error('Failed to fetch auditor:', error);
        } finally {
          setIsLoading(false);
        }
      };
      findAuditor();
    } else {
      setIsLoading(false);
      console.warn(
        'Engagement is missing an auditorId. Chat cannot be loaded.'
      );
    }
  }, [engagement]);

  // --- Show a loading state until all data is ready ---
  if (isLoading || !engagement || !auditor) {
    return <p>Loading Chat...</p>; // Or a spinner component
  }

  // --- CORRECTED LOGIC ---
  // 1. Assign threadId directly from engagement.id
  const threadId = engagement.id;

  // 2. The currentUser is the full auditor object we fetched
  const currentUser = auditor;

  return (
    <main>
      <ChatThread threadId={threadId} currentUser={currentUser} />
    </main>
  );
}
