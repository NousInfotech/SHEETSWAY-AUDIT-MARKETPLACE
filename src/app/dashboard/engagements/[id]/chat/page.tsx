'use client';
import ChatOnlyView from '@/features/connect/components/ChatOnlyView';
import { useParams } from 'next/navigation';
import React from 'react';

export default function EngagementChatPage({ engagement }: any) {
  const params = useParams();
  const engagementId = params?.id as string;

  return (
    <>
      <div className='w-full'>
        <ChatOnlyView engagement={engagement} />
      </div>
    </>
  );
}
