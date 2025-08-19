// src/features/chat/components/MessageBubble.tsx

import { Message, User } from '@/features/chat/lib/types';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import the Shadcn Button

// --- 1. UPDATE THE PROPS INTERFACE ---
interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  /** A function to call when the user clicks the 'Retry' button. */
  onRetry: (content: string, type: 'text' | 'image' | 'file') => void;
}

export const MessageBubble = ({ message, currentUser, onRetry }: MessageBubbleProps) => {
  const isCurrentUser = message.senderId === currentUser.id;

  const handleRetry = () => {
    // Call the onRetry function with the content of the failed message
    onRetry(message.content, message.type);
  };

  return (
    <div className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex flex-col gap-1', isCurrentUser ? 'items-end' : 'items-start')}>
        {/* The main message content bubble */}
        <div 
          className={cn(
            'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm sm:max-w-[65%]', 
            isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none',
            // --- 2. ADD OPACITY FOR 'SENDING' AND 'FAILED' STATES ---
            message.status === 'sending' && 'opacity-70',
            message.status === 'failed' && 'bg-destructive/20 border border-destructive/50 text-destructive-foreground'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {/* --- 3. THE COMPLETE STATUS INDICATOR SECTION --- */}
        <div className="flex items-center gap-2 px-1 h-5">
          {/* We only show status indicators on messages sent by the current user */}
          {isCurrentUser && (
            <>
              {message.status === 'sending' && (
                <p className="text-xs text-muted-foreground animate-pulse">Sending...</p>
              )}

              {message.status === 'failed' && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <p className="text-xs font-semibold">Failed</p>
                  {/* The Retry Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="sr-only">Retry sending message</span>
                  </Button>
                </div>
              )}
            </>
          )}
          
          {/* For all other statuses ('sent' or undefined), show the time */}
          {message.status !== 'sending' && message.status !== 'failed' && (
             <p className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};