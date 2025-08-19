import { useEffect, useRef } from 'react';
import { Message, User } from '@/features/chat/lib/types';
import { MessageBubble } from './MessageBubble';
import {
  ChatScrollArea,
  ChatScrollBar,
  ChatScrollAreaViewport
} from '@/components/ui/chat-scroll-area';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  sendMessage: (
    content: string,
    type: 'text' | 'image' | 'file',
    failedMessageId?: string | null // It can be a string, null, or undefined
  ) => void;
}

export const MessageList = ({
  messages,
  currentUser,
  sendMessage
}: MessageListProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRetry = (content: string, type: 'text' | 'image' | 'file') => {
    // When retrying, we can just call the main sendMessage function again.
    // The optimistic logic in the hook will handle removing the failed message
    // and adding the new 'sending' message.
    sendMessage(content, type);
  };

  return (
    <ChatScrollArea className='h-full w-full flex-1'>
      <ChatScrollAreaViewport ref={viewportRef} className='h-full w-full'>
        <div className='space-y-4 p-4'>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUser={currentUser}
              onRetry={(content, type) => {
                sendMessage(content, type, msg.id);
              }}
            />
          ))}
        </div>
      </ChatScrollAreaViewport>
      <ChatScrollBar orientation='vertical' />
    </ChatScrollArea>
  );
};
