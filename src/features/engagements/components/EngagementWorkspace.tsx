import React from 'react';
import { Engagement } from '../types/engagement-types';
import { statusConfig } from '../constants/config';
import { ArrowLeft, Database, Banknote, FileText, History, Settings, MessageCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EngagementWorkspaceProps {
  engagement: Engagement;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
  children: React.ReactNode;
}

const EngagementWorkspace: React.FC<EngagementWorkspaceProps> = ({
  engagement,
  currentTab,
  onTabChange,
  onBack,
  children
}) => {
  const StatusIcon = statusConfig[engagement.status].icon;
  const router = useRouter();

  const Header = () => (
    <header className="bg-card rounded-t-xl dark:bg-card border-b border-border px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
            aria-label="Back to engagements"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {engagement.clientName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[engagement.status].textColor} bg-opacity-10`}>
                <StatusIcon className="h-4 w-4" />
                {engagement.status}
              </div>
              <span className="text-muted-foreground text-sm">
                {engagement.type} • {engagement.framework}
              </span>
            </div>
          </div>
        </div>
        {/* Messages Icon Button */}
        <button
          onClick={() => router.push(`/dashboard/connect?engagementId=${engagement.id}`)}
          className="p-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors ml-4"
          aria-label="Open Messages"
        >
          <MessageCircle className="h-6 w-6 text-foreground" />
        </button>
      </div>
    </header>
  );

  const TabNavigation = () => {
    const tabs = [
      { id: 'accounting', label: 'Audit Access', icon: Database },
      { id: 'banking', label: 'Banking Data', icon: Banknote },
      { id: 'payments', label: 'Payments & Escrow', icon: FileText },
      { id: 'reviews', label: 'Milestones', icon: History },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
    return (
      <nav className="bg-card dark:bg-card border-b border-border px-6 transition-colors">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  return (
    <div className='overflow-x-auto grid grid-cols-1'>
    <div className="bg-background dark:bg-background min-h-screen min-w-[1280px] lg:min-w-full transition-colors">
      <Header />
      <TabNavigation />
      <main className="p-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
        {children}
      </main>
    </div>
    </div>
  );
};

export default EngagementWorkspace; 