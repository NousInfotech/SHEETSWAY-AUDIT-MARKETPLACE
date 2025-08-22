'use client';

import { useChat } from '@/features/chat/hooks/use-chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { User } from '@/features/chat/lib/types';
import { cn } from '@/lib/utils';
import { CircleUserRound, MessageSquareText } from 'lucide-react';

interface ChatThreadProps {
  threadId: string;
  currentUser: User;
  receiverName: string;
}

export const ChatThread = ({
  threadId,
  currentUser,
  receiverName
}: ChatThreadProps) => {
  const { messages, isConnected, sendMessage, isReceiverOnline } = useChat({
    threadId,
    currentUser
  });
  return (
    <div className='bg-muted/20 flex h-screen flex-col items-center justify-center p-0 sm:p-4'>
      <Card className='flex h-full w-full max-w-4xl flex-col rounded-none shadow-lg sm:h-[calc(100vh-2rem)] sm:rounded-xl'>
        <CardHeader className='flex flex-row items-center justify-between border-b p-4'>
          {/* --- IMPROVED HEADER UI --- */}
          <div className='flex items-center gap-3'>
            <CircleUserRound className="h-8 w-8 text-gray-400" />
            <div>
              <CardTitle className='text-lg'>{receiverName}</CardTitle>
              <div className='flex items-center gap-1.5'>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    isReceiverOnline ? 'bg-green-500' : 'bg-gray-400'
                  )}
                />
                <p className='text-muted-foreground text-xs'>
                  {isReceiverOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <span>
            <MessageSquareText className="h-8 w-8 text-gray-400"/>
          </span>
          {/* ... your 'Connected' status indicator ... */}
        </CardHeader>
        <CardContent className='flex-1 overflow-hidden p-0'>
          <MessageList
            messages={messages}
            currentUser={currentUser}
            sendMessage={sendMessage}
          />
        </CardContent>
        <CardFooter className='border-t p-0'>
          <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
        </CardFooter>
      </Card>
    </div>
  );
};
