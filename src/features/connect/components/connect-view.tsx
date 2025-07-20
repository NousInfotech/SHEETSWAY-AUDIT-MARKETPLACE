// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import React, { useState } from 'react';
// Removed unused icon imports
import { useConnect } from '@/hooks/use-connect';
import { DashboardView, ChatView, ScheduleView, CalendarView } from './index';
import { UserChatView } from './user-chat-view';

export default function ConnectViewPage() {
  // State management
  const [currentView, setCurrentView] = useState('dashboard');
  // Removed unused state variables

  // Use custom hook for connect functionality
  const {
    chatMessages,
    activeChat,
    message,
    meetings,
    selectedDate,
    selectedTime,
    isDark,
    contacts,
    availableSlots,
    setActiveChat,
    setMessage,
    setSelectedDate,
    setSelectedTime,
    // toggleTheme is available but not used in this component
    handleSendMessage,
    handleScheduleMeeting,
    cancelMeeting
  } = useConnect();

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Custom scrollbar styles */}
      <style jsx>{`
        /* Light theme scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDark ? '#1a1a1a' : '#f1f5f9'};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDark ? '#4a4a4a' : '#cbd5e1'};
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#5a5a5a' : '#94a3b8'};
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? '#4a4a4a #1a1a1a' : '#cbd5e1 #f1f5f9'};
        }

        /* Ensure the main container can scroll */
        .scroll-container {
          max-height: calc(100vh - 50px);
          overflow-y: auto;
          overflow-x: hidden;
        }
      `}</style>

      <div className='scroll-container'>
        {/* Main Content */}
        <div className='min-h-screen p-6'>
          {currentView === 'dashboard' && (
            <DashboardView
              meetings={meetings}
              contacts={contacts}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'chat' && (
            <ChatView
              chatMessages={chatMessages}
              activeChat={activeChat}
              message={message}
              setActiveChat={setActiveChat}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          )}

          {currentView === 'user-chat' && <UserChatView onBack={handleBack} />}

          {currentView === 'schedule' && (
            <ScheduleView
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              meetings={meetings}
              availableSlots={availableSlots}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
              handleScheduleMeeting={handleScheduleMeeting}
              onBack={handleBack}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              cancelMeeting={cancelMeeting}
              onBack={handleBack}
            />
          //   <CalendarView
          //   meetings={meetings}
          //   contacts={contacts}
          //   cancelMeeting={cancelMeeting}
          //   onBack={handleBack}
          // />
          )}
        </div>
      </div>
    </div>
  );
}
