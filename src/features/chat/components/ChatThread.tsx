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
import { Button } from '@/components/ui/button';

interface ChatThreadProps {
  threadId: string;
  currentUser: User;
}

export const ChatThread = ({ threadId, currentUser }: ChatThreadProps) => {
  const { messages, isConnected, sendMessage } = useChat({
    threadId,
    currentUser
  });
  return (
    <div className='bg-muted/20 flex h-screen flex-col items-center justify-center p-0 sm:p-4'>
      <Card className='flex h-full w-full max-w-3xl flex-col rounded-none shadow-lg sm:h-[calc(100vh-2rem)] sm:rounded-xl'>
        <CardHeader className='flex flex-row items-center justify-between border-b p-4'>
          <CardTitle className='text-lg'>Chats</CardTitle>
          {/* --- ADD THIS TEST BUTTON --- */}
          {/* <Button variant="outline" size="sm" onClick={addLocalTestMessage}>
            Test Add Message
          </Button> */}
          {/* --- END TEST BUTTON --- */}
          <div className='flex items-center gap-2'>
            <span
              className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <p className='text-muted-foreground text-sm'>
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
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
