// src/features/chat/components/MessageBubble.tsx

import { Message, User } from '@/features/chat/lib/types';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  onRetry: (content: string, type: 'text' | 'image' | 'file') => void;
}

export const MessageBubble = ({ message, currentUser, onRetry }: MessageBubbleProps) => {
  const isCurrentUser = message.senderId === currentUser.id;

  const handleRetry = () => {
    onRetry(message.content, message.type);
  };

  return (
    <div className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
      {/* --- FIX 2: CONSTRAIN THE WIDTH OF THE BUBBLE'S CONTAINER --- */}
      {/* This gives the inner bubble a stable parent to calculate its own max-width from. */}
      <div className={cn('flex flex-col max-w-[80%] gap-1 sm:max-w-[75%]', isCurrentUser ? 'items-end' : 'items-start')}>
        {/* The main message content bubble */}
        <div 
          className={cn(
            // The max-w here is now relative to the parent div above
            'max-w-full rounded-lg px-3 py-2 text-sm shadow-sm', 
            isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none',
            message.status === 'sending' && 'opacity-70',
            message.status === 'failed' && 'bg-destructive/20 border border-destructive/50 text-destructive-foreground'
          )}
        >
          {/* --- FIX 3: ADD WORD BREAKING FOR ROBUST TEXT HANDLING --- */}
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className="flex items-center gap-2 px-1 h-5">
          {isCurrentUser && (
            <>
              {message.status === 'sending' && (
                <p className="text-xs text-muted-foreground animate-pulse">Sending...</p>
              )}

              {message.status === 'failed' && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <p className="text-xs font-semibold">Failed</p>
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
          
          {/* --- FIX 1: USE `message.sentAt` AND CHECK IF IT EXISTS --- */}
          {message.status !== 'sending' && message.status !== 'failed' && message.sentAt && (
             <p className="text-xs text-muted-foreground">
              {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};