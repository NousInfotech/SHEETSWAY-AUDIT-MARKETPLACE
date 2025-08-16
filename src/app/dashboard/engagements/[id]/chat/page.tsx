// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useConnect } from '@/hooks/use-connect';
import { ChatOnlyView } from '@/features/connect/components/ChatOnlyView';
import { generateMockEngagements } from '@/features/engagements/data/mock-data';
import type { Engagement } from '@/features/engagements/types/engagement-types';

export default function EngagementChatPage({engagement}:any) {
  const params = useParams();
  const engagementId = params?.id as string;
  const [engagements, setEngagements] = React.useState<Engagement[]>([]);

  React.useEffect(() => {
    setEngagements(generateMockEngagements());
  }, []);

  const {
    chatMessages,
    activeChat,
    message,
    setActiveChat,
    setMessage,
    handleSendMessage,
    isDark
  } = useConnect();

  React.useEffect(() => {
    if (engagementId) {
      setActiveChat(engagementId);
    }
  }, [engagementId, setActiveChat]);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      <div className='flex justify-center items-center min-h-screen'>
        <div className='w-full'>
          <ChatOnlyView
            chatMessages={chatMessages}
            activeChat={engagementId}
            message={message}
            setActiveChat={setActiveChat}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            engagement={engagement}
          />
        </div>
      </div>
    </div>
  );
} 