"use client"
import React, { useEffect, useState } from 'react';
import { Video, PhoneCall, Settings, User } from 'lucide-react';
import { ChatMessage } from '@/types/connect';
import { getAuditorById } from '@/api/auditor.api';

interface ChatOnlyViewProps {
  chatMessages: Record<string, ChatMessage[]>;
  activeChat: string;
  message: string;
  setActiveChat: (chat: string) => void;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  engagement:any;
}

export const ChatOnlyView: React.FC<ChatOnlyViewProps> = ({
  chatMessages,
  activeChat,
  message,
  setActiveChat,
  setMessage,
  handleSendMessage,
  engagement
}) => {
  // Helper functions from ChatView
  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'bot':
        return <User className='h-5 w-5 text-blue-500' />;
      case 'user':
        return <User className='h-5 w-5 text-green-500' />;
      case 'agent':
        return <User className='h-5 w-5 text-purple-500' />;
      default:
        return <User className='h-5 w-5 text-gray-500' />;
    }
  };
  const getSenderName = (sender: string) => {
    switch (sender) {
      case 'bot':
        return 'AI Assistant';
      case 'user':
        return 'You';
      case 'agent':
        return 'Support Agent';
      default:
        return 'Unknown';
    }
  };

  // Find engagement for dynamic name
  // const engagement = engagements.find(e => e.id === activeChat);
  // const engagementName = engagement ? engagement.clientName : 'Chat';


  const [auditor, setAuditor] = useState<any>({})


  useEffect(() => {
    const findAuditor = async () => {
      try {
        let current_auditor = await getAuditorById(engagement.proposal.auditorId)
        setAuditor(current_auditor)
      } catch (error) {
        console.log(error)
      }
    }

    findAuditor();
  })





  return (
    <div className='flex flex-col h-full min-h-[calc(100vh-100px)] w-full'>
      {/* Chat Header */}
      <div className='border-border bg-card border-b p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
              <User className='h-5 w-5 text-primary' />
            </div>
            <div>
              <h3 className='text-foreground font-semibold'>{auditor.name}</h3>
              <p className='text-muted-foreground text-sm'>Active now</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              <Video className='text-muted-foreground h-4 w-4' />
            </button>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              <PhoneCall className='text-muted-foreground h-4 w-4' />
            </button>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              <Settings className='text-muted-foreground h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
      {/* Chat Body: messages and input, flex-grow */}
      <div className='flex flex-col flex-1 min-h-0'>
        {/* Messages */}
        <div className='flex-1 space-y-4 overflow-y-auto p-6'>
          {chatMessages[activeChat]?.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'user' && (
                <div className='bg-secondary flex h-8 w-8 items-center justify-center rounded-full'>
                  {getSenderIcon(msg.sender)}
                </div>
              )}
              <div
                className={`max-w-xs rounded-2xl p-4 lg:max-w-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
              >
                <div className='mb-2 flex items-center gap-2'>
                  <span className='text-xs font-medium opacity-70'>{getSenderName(msg.sender)}</span>
                  <span className='text-xs opacity-50'>{msg.time}</span>
                </div>
                <p className='text-sm'>{msg.message}</p>
              </div>
              {msg.sender === 'user' && (
                <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-full'>
                  <User className='text-primary-foreground h-4 w-4' />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Message Input */}
        <div className='border-border bg-card border-t p-6 '>
          <div className='flex items-center gap-3'>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              {/* Mic icon can be added here if needed */}
            </button>
            <div className='relative flex-1'>
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder='Type your message...'
                className='bg-secondary border-border focus:ring-primary w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none'
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
            >
              {/* Send icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 