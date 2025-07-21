// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Headphones,
  FileText,
  Phone,
  Search,
  Video,
  Mic,
  PhoneCall,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { ChatMessage } from '@/types/connect';

interface ChatViewProps {
  chatMessages: Record<string, ChatMessage[]>;
  activeChat: string;
  message: string;
  setActiveChat: (chat: string) => void;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  onBack: () => void;
  engagements: any[]; // Accept mock engagements
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chatMessages,
  activeChat,
  message,
  setActiveChat,
  setMessage,
  handleSendMessage,
  onBack,
  engagements
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'online'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      status: 'busy'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      status: 'offline',
      lastSeen: '2 hours ago'
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      status: 'online'
    },
    {
      id: '5',
      name: 'David Lee',
      email: 'david.lee@example.com',
      status: 'offline',
      lastSeen: '1 day ago'
    }
  ]);

  const chatChannels = [
    {
      id: 'support',
      name: 'Support',
      icon: Headphones,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'onboarding',
      name: 'Onboarding',
      icon: Phone,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'audit',
      name: 'Audit',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'bot':
        return <Bot className='h-5 w-5 text-blue-500' />;
      case 'user':
        return <User className='h-5 w-5 text-green-500' />;
      case 'agent':
        return <Headphones className='h-5 w-5 text-purple-500' />;
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

  const addNewUser = () => {
    if (newUserName.trim() && newUserEmail.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        status: 'online'
      };
      setUsers((prev) => [...prev, newUser]);
      setNewUserName('');
      setNewUserEmail('');
      setShowUserList(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='border-border bg-card flex items-center gap-4 border-b p-6'>
        <button
          onClick={onBack}
          className='hover:bg-secondary rounded-lg p-2 transition-colors'
        >
          <ArrowLeft className='text-muted-foreground h-5 w-5' />
        </button>
        <div>
          <h1 className='text-foreground text-2xl font-bold'>Chat Channels</h1>
          <p className='text-muted-foreground'>Manage your conversations</p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className='flex min-h-0 flex-1'>
        {/* Chat Channels Sidebar */}
        <div className='border-border bg-card w-80 flex-shrink-0 border-r'>
          <div className='border-border border-b p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-foreground font-semibold'>Conversations</h3>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className='hover:bg-secondary rounded-lg p-2 transition-colors'
              >
                <User className='text-muted-foreground h-4 w-4' />
              </button>
            </div>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  showUserList ? 'Search users...' : 'Search conversations...'
                }
                className='bg-secondary border-border focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none'
              />
            </div>
          </div>

          <div className='space-y-2 p-4'>
            {!showUserList ? (
              // Chat Channels
              <>
                {chatChannels.map((channel) => {
                  const Icon = channel.icon;
                  const isActive = activeChat === channel.id;
                  const messageCount = chatMessages[channel.id]?.length || 0;

                  return (
                    <div
                      key={channel.id}
                      onClick={() => setActiveChat(channel.id)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 border-primary/20 border'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${channel.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${channel.color}`} />
                      </div>
                      <div className='flex-1'>
                        <p
                          className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}
                        >
                          {channel.name}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {messageCount} messages
                        </p>
                      </div>
                      {isActive && (
                        <div className='bg-primary h-2 w-2 rounded-full'></div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              // User List
              <>
                <div className='mb-4'>
                  <button
                    onClick={() => setShowUserList(false)}
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    ← Back to channels
                  </button>
                </div>

                {/* Add New User */}
                <div className='border-border bg-secondary rounded-xl border p-3'>
                  <div className='space-y-2'>
                    <input
                      type='text'
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder='User name'
                      className='bg-background border-border focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
                    />
                    <input
                      type='email'
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder='User email'
                      className='bg-background border-border focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
                    />
                    <button
                      onClick={addNewUser}
                      disabled={!newUserName.trim() || !newUserEmail.trim()}
                      className='bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      Add User
                    </button>
                  </div>
                </div>

                {/* User List */}
                {filteredUsers.map((user) => {
                  const isActive = activeChat === `user-${user.id}`;

                  return (
                    <div
                      key={user.id}
                      onClick={() => setActiveChat(`user-${user.id}`)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 border-primary/20 border'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <div className='relative'>
                        <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                          <span className='text-primary text-sm font-medium'>
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div
                          className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full ${getStatusIcon(user.status)}`}
                        ></div>
                      </div>
                      <div className='flex-1'>
                        <p
                          className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}
                        >
                          {user.name}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {user.email}
                        </p>
                        {user.status === 'offline' && user.lastSeen && (
                          <p className='text-muted-foreground text-xs'>
                            {user.lastSeen}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <div className='bg-primary h-2 w-2 rounded-full'></div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className='flex min-w-0 flex-1 flex-col'>
          {/* Chat Header */}
          <div className='border-border bg-card border-b p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {(() => {
                  if (activeChat.startsWith('user-')) {
                    const userId = activeChat.replace('user-', '');
                    const user = users.find((u) => u.id === userId);
                    if (user) {
                      return (
                        <div className='relative'>
                          <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                            <span className='text-primary text-sm font-medium'>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div
                            className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full ${getStatusIcon(user.status)}`}
                          ></div>
                        </div>
                      );
                    }
                  }
                  const channel = chatChannels.find((c) => c.id === activeChat);
                  const Icon = channel?.icon || MessageSquare;
                  return (
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${channel?.bgColor}`}
                    >
                      <Icon className={`h-5 w-5 ${channel?.color}`} />
                    </div>
                  );
                })()}
                <div>
                  <h3 className='text-foreground font-semibold'>
                    {(() => {
                      if (activeChat.startsWith('user-')) {
                        const userId = activeChat.replace('user-', '');
                        const user = users.find((u) => u.id === userId);
                        return user ? user.name : 'Unknown User';
                      }
                      // Engagement chat: if activeChat matches an engagementId, show its clientName
                      const engagement = engagements.find(e => e.id === activeChat);
                      if (engagement) {
                        return engagement.clientName;
                      }
                      return (
                        chatChannels.find((c) => c.id === activeChat)?.name ||
                        'Unknown'
                      );
                    })()}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {(() => {
                      if (activeChat.startsWith('user-')) {
                        const userId = activeChat.replace('user-', '');
                        const user = users.find((u) => u.id === userId);
                        return user ? user.email : '';
                      }
                      return 'Active now';
                    })()}
                  </p>
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

          {/* Messages */}
          <div className='flex-1 space-y-4 overflow-y-auto p-6'>
            {chatMessages[activeChat]?.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender !== 'user' && (
                  <div className='bg-secondary flex h-8 w-8 items-center justify-center rounded-full'>
                    {getSenderIcon(msg.sender)}
                  </div>
                )}
                <div
                  className={`max-w-xs rounded-2xl p-4 lg:max-w-md ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <div className='mb-2 flex items-center gap-2'>
                    <span className='text-xs font-medium opacity-70'>
                      {getSenderName(msg.sender)}
                    </span>
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
          <div className='border-border bg-card border-t p-6'>
            <div className='flex items-center gap-3'>
              <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
                <Mic className='text-muted-foreground h-4 w-4' />
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
                <Send className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
