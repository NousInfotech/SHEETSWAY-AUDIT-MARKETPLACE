import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
}

export const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    console.log('[FORM] handleSubmit fired!');
    e.preventDefault();
    if (content.trim()) {
      onSendMessage(content);
      setContent('');
    }
  };
  const handleButtonClick = () => {
    // --- TEST 2: IS THE BUTTON CLICKING? ---
    console.log('[BUTTON] Send button clicked!');
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t bg-background md:p-4 w-full">
      <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type a message..." disabled={disabled}/>
      <Button onClick={handleButtonClick} type="submit" disabled={disabled || !content.trim()}>Send</Button>
    </form>
  );
};