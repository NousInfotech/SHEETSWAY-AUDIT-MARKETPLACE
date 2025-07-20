import React, { useState } from 'react';
import type { JSX } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Headphones,
  FileText,
  ArrowLeft,
  XCircle,
  Plus,
  Users,
  Mail,
  Edit3,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock data for demonstration
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Product Demo Call',
    date: '2025-07-25',
    time: '10:00',
    duration: 60,
    status: 'scheduled',
    type: 'onboarding',
    attendees: ['user1', 'user2'],
    description: 'Product demonstration for new client'
  },
  {
    id: '2',
    title: 'Support Session',
    date: '2025-07-25',
    time: '14:30',
    duration: 30,
    status: 'upcoming',
    type: 'support',
    attendees: ['user1'],
    description: 'Technical support session'
  },
  {
    id: '3',
    title: 'Team Meeting',
    date: '2025-07-28',
    time: '09:00',
    duration: 45,
    status: 'completed',
    type: 'consultation',
    attendees: ['user1', 'user2', 'user3'],
    description: 'Weekly team sync'
  },
  {
    id: '4',
    title: 'Client Onboarding',
    date: '2025-07-30',
    time: '11:00',
    duration: 90,
    status: 'cancelled',
    type: 'onboarding',
    attendees: ['user1', 'user2'],
    description: 'New client onboarding session'
  }
];

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Product Manager',
    status: 'online',
    lastSeen: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Developer',
    status: 'away',
    lastSeen: '15 minutes ago'
  }
];

// TypeScript interfaces and types
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'upcoming' | 'completed' | 'cancelled' | string;
  type: 'onboarding' | 'support' | 'consultation' | string;
  attendees: string[];
  description?: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline' | string;
  lastSeen?: string;
}

interface CustomCalendarProps {
  meetings: Meeting[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

interface CalendarViewProps {
  meetings?: Meeting[];
  contacts?: Contact[];
  cancelMeeting?: (id: string) => void;
  onBack?: () => void;
}

// Utility functions
const getTypeColor = (type: Meeting['type']): string => {
  switch (type) {
    case 'onboarding': return 'bg-blue-100 text-blue-600';
    case 'support': return 'bg-green-100 text-green-600';
    case 'consultation': return 'bg-purple-100 text-purple-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusColor = (status: Meeting['status']): string => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'upcoming': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Contact['status']): string => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'away': return 'bg-yellow-500';
    case 'offline': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

// Custom Calendar Component
const CustomCalendar: React.FC<CustomCalendarProps> = ({ meetings, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Group meetings by date and status for badge rendering
  const meetingStatusByDate: { [date: string]: Set<Meeting['status']> } = {};
  meetings.forEach((m: Meeting) => {
    const dateKey = new Date(m.date).toDateString();
    if (!meetingStatusByDate[dateKey]) meetingStatusByDate[dateKey] = new Set();
    meetingStatusByDate[dateKey].add(m.status);
  });

  // Get days in month
  const getDaysInMonth = (date: Date): { date: Date; isCurrentMonth: boolean }[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const goToPreviousMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelectedDate = (date: Date): boolean => {
    return selectedDate !== null &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const getBadgesForDate = (date: Date): { status: Meeting['status']; color: string; label: string }[] => {
    const dateKey = date.toDateString();
    const statuses = meetingStatusByDate[dateKey];
    if (!statuses) return [];
    
    return Array.from(statuses).map((status) => ({
      status: status as Meeting['status'],
      color: status === 'scheduled' ? 'bg-blue-500' :
             status === 'upcoming' ? 'bg-yellow-500' :
             status === 'completed' ? 'bg-green-500' :
             status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500',
      label: (status as string).charAt(0).toUpperCase()
    }));
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-semibold">{monthYear}</h3>
        <button 
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, index) => {
          const badges = getBadgesForDate(date);
          const isSelected = isSelectedDate(date);
          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && onDateSelect(date)}
              className={`
                relative p-1 min-h-[60px] border rounded-lg cursor-pointer transition-colors
                ${isCurrentMonth ? 'hover:bg-blue-50' : 'text-gray-300'}
                ${isSelected ? 'bg-blue-100 border-blue-300' : 'border-gray-200'}
                ${isToday && isCurrentMonth ? 'ring-2 ring-blue-400' : ''}
              `}
            >
              {/* Date Number */}
              <div className="text-sm font-medium text-center mb-1">
                {date.getDate()}
              </div>
              
              {/* Status Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {badges.slice(0, 3).map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className={`w-2 h-2 rounded-full ${badge.color}`}
                      title={badge.status}
                    />
                  ))}
                  {badges.length > 3 && (
                    <div className="text-xs text-gray-500">+{badges.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Badge Component
const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700',
    destructive: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Main Calendar View Component
export default function CalendarView({ 
  meetings = mockMeetings, 
  contacts = mockContacts, 
  cancelMeeting = (id: string) => console.log('Cancelling meeting:', id), 
  onBack = () => console.log('Going back') 
}: CalendarViewProps = {}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIconComponent = (status: Contact['status']): JSX.Element => {
    const statusClass = getStatusIcon(status);
    return <div className={`h-2 w-2 rounded-full ${statusClass}`}></div>;
  };

  // Meetings for the selected date
  const selectedMeetings: Meeting[] = selectedDate
    ? meetings.filter((m: Meeting) => {
        const d = new Date(m.date);
        return (
          d.getFullYear() === selectedDate.getFullYear() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getDate() === selectedDate.getDate()
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="hover:bg-gray-200 rounded-lg p-2 transition-colors"
          >
            <ArrowLeft className="text-gray-600 h-5 w-5" />
          </button>
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Calendar</h1>
            <p className="text-gray-600">Manage your meetings and appointments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Calendar View + Selected Day Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl border p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-gray-900 text-lg font-semibold">
                  Upcoming Meetings
                </h2>
                <button className="hover:bg-gray-100 rounded-lg p-2 transition-colors">
                  <Plus className="text-gray-600 h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <CustomCalendar 
                    meetings={meetings}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </div>
                
                <div className="flex-1">
                  {selectedDate ? (
                    <div>
                      <h3 className="text-gray-900 mb-4 text-lg font-semibold">
                        Meetings on {selectedDate.toLocaleDateString()}
                      </h3>
                      {selectedMeetings.length > 0 ? (
                        <div className="space-y-4">
                          {selectedMeetings.map((meeting) => (
                            <div
                              key={meeting.id}
                              className="border-gray-200 bg-gray-50 rounded-xl border p-4"
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${getTypeColor(meeting.type)}`}
                                >
                                  {meeting.type === 'onboarding' ? (
                                    <Phone className="h-6 w-6" />
                                  ) : meeting.type === 'support' ? (
                                    <Headphones className="h-6 w-6" />
                                  ) : (
                                    <FileText className="h-6 w-6" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-gray-900 font-semibold">
                                      {meeting.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={
                                        meeting.status === 'scheduled' ? 'default' :
                                        meeting.status === 'completed' ? 'secondary' :
                                        meeting.status === 'upcoming' ? 'outline' :
                                        'destructive'
                                      }>
                                        {meeting.status}
                                      </Badge>
                                      <button className="hover:bg-white rounded p-1 transition-colors">
                                        <MoreHorizontal className="text-gray-600 h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-gray-600 mb-3 text-sm">
                                    {formatDate(meeting.date)} at {formatTime(meeting.time)}
                                  </p>
                                  <div className="text-gray-600 mb-3 flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {meeting.duration} minutes
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {meeting.attendees.length} attendees
                                    </span>
                                  </div>
                                  {meeting.description && (
                                    <p className="text-gray-600 text-sm">
                                      {meeting.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* Action Buttons */}
                              <div className="border-gray-200 mt-4 flex items-center gap-2 border-t pt-4">
                                <button className="flex items-center gap-2 rounded-lg px-3 py-1 text-xs text-blue-500 transition-colors hover:bg-blue-500/10">
                                  <Edit3 className="h-3 w-3" />
                                  Edit
                                </button>
                                {meeting.status === 'scheduled' && (
                                  <button
                                    onClick={() => cancelMeeting(meeting.id)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-1 text-xs text-red-500 transition-colors hover:bg-red-500/10"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-600 py-8 text-center">
                          <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                          <p className="mb-2 text-lg font-medium">
                            No meetings on this day
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-600 py-8 text-center">
                      <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p className="mb-2 text-lg font-medium">
                        Select a date to view meetings
                      </p>
                      <p className="text-sm">
                        Click on any date in the calendar to see scheduled meetings
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Status */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-gray-900 mb-4 text-lg font-semibold">
                Team Status
              </h2>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-gray-50 flex items-center gap-3 rounded-xl p-3"
                  >
                    <div className="relative">
                      <div className="bg-blue-100 flex h-10 w-10 items-center justify-center rounded-full">
                        <span className="text-blue-600 text-sm font-medium">
                          {contact.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="absolute -right-1 -bottom-1">
                        {getStatusIconComponent(contact.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        {contact.name}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {contact.role}
                      </p>
                      {contact.lastSeen && (
                        <p className="text-gray-600 text-xs">
                          Last seen {contact.lastSeen}
                        </p>
                      )}
                    </div>
                    <button className="hover:bg-white rounded-lg p-2 transition-colors">
                      <Mail className="text-gray-600 h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Stats */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-gray-900 mb-4 text-lg font-semibold">
                Meeting Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Total Meetings
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {meetings.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Scheduled</span>
                  <span className="font-semibold text-blue-500">
                    {meetings.filter((m) => m.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Completed</span>
                  <span className="font-semibold text-green-500">
                    {meetings.filter((m) => m.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Cancelled</span>
                  <span className="font-semibold text-red-500">
                    {meetings.filter((m) => m.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}