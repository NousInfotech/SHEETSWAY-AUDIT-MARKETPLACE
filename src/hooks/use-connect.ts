import { useState, useEffect } from 'react';
import { ChatMessage, Meeting } from '@/types/connect';
import {
  initialChatMessages,
  initialMeetings,
  contacts,
  availableSlots
} from '@/constants/connect-data';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  formatTime,
  generateMeetingTitle,
  getMeetingDuration
} from '@/lib/connect-utils';
import { useTheme } from 'next-themes';

export const useConnect = () => {
  // ✅ Get theme from the central provider
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  // Chat state
  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >(loadFromLocalStorage('chatMessages', initialChatMessages));
  const [activeChat, setActiveChat] = useState<string>('support');
  const [message, setMessage] = useState<string>('');

  // Meeting state
  const [meetings, setMeetings] = useState<Meeting[]>(
    loadFromLocalStorage('meetings', initialMeetings)
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // ✅ Corrected Effect: No longer responsible for the theme
  useEffect(() => {
    saveToLocalStorage('chatMessages', chatMessages);
    saveToLocalStorage('meetings', meetings);
  }, [chatMessages, meetings]);

  // ✅ Corrected theme toggler
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: message.trim(),
        time: formatTime(new Date()),
        timestamp: Date.now()
      };

      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMessage]
      }));

      setMessage('');

      // Simulate agent response
      setTimeout(() => {
        const agentResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          message:
            "Thank you for your message. I'm reviewing your request and will get back to you shortly.",
          time: formatTime(new Date()),
          timestamp: Date.now()
        };

        setChatMessages((prev) => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), agentResponse]
        }));
      }, 2000);
    }
  };

  const handleScheduleMeeting = (type: 'onboarding' | 'support' | 'audit') => {
    if (selectedDate && selectedTime) {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: generateMeetingTitle(type),
        date: selectedDate,
        time: selectedTime,
        duration: getMeetingDuration(type),
        type,
        status: 'scheduled',
        attendees: ['john.doe@example.com', `${type}@sheetsway.com`],
        description: `Scheduled ${type} meeting`
      };

      setMeetings((prev) => [...prev, newMeeting]);
      setSelectedDate('');
      setSelectedTime('');
      alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} meeting scheduled successfully!`
      );
    }
  };

  const cancelMeeting = (id: string) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id
          ? { ...meeting, status: 'cancelled' as const }
          : meeting
      )
    );
  };

  return {
    // State
    chatMessages,
    activeChat,
    message,
    meetings,
    selectedDate,
    selectedTime,
    isDark,
    contacts,
    availableSlots,

    // Setters
    setActiveChat,
    setMessage,
    setSelectedDate,
    setSelectedTime,

    // Handlers
    toggleTheme,
    handleSendMessage,
    handleScheduleMeeting,
    cancelMeeting
  };
};
