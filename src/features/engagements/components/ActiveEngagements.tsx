import React, { useState } from 'react';
import { Engagement, Filters } from '../types/engagement-types';
import { statusConfig, priorityConfig } from '../constants/config';
import {
  Search,
  Grid,
  List,
  FileText,
  Building,
  Tag,
  Play,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle,
  User
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SigningPortalModal } from './SigningPortalModal';

interface ActiveEngagementsProps {
  engagements: any[];
  selectedEngagement: any | null;
  setSelectedEngagement: React.Dispatch<React.SetStateAction<any | null>>;
  onEnterWorkspace: (engagement: any) => void;
  onRefresh?: () => void;
}

const ActiveEngagements: React.FC<ActiveEngagementsProps> = ({
  engagements,
  selectedEngagement,
  setSelectedEngagement,
  onEnterWorkspace,
  onRefresh
}) => {
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    type: '',
    framework: ''
  });
  const [sortOption, setSortOption] = useState<
    'clientName' | 'status' | 'startDate' | 'deadline' | 'progress'
  >('clientName');

  const sortEngagements = (list: any[]) => {
    switch (sortOption) {
      case 'clientName':
        return [...list].sort((a, b) =>
          a.request.title.localeCompare(b.request.title)
        );
      case 'status':
        return [...list].sort((a, b) => 'In Progress'.localeCompare(b.status));
      case 'startDate':
        return [...list].sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case 'deadline':
        return [...list].sort(
          (a, b) =>
            new Date(a.request.deadline).getTime() -
            new Date(b.request.deadline).getTime()
        );
      case 'progress':
        return [...list].sort((a, b) => b.progress - a.progress);
      default:
        return list;
    }
  };

  const filteredEngagements = sortEngagements(
    engagements.filter((engagement) => {
      const matchesSearch =
        engagement.request.title
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        'engagement description'
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || 'In Progress' === filters.status;
      const matchesType = !filters.type || engagement.type === filters.type;
      const matchesFramework =
        !filters.framework ||
        engagement.request.framework === filters.framework;
      return matchesSearch && matchesStatus && matchesType && matchesFramework;
    })
  );

  const Header = () => (
    <header className='bg-card dark:bg-card border-border rounded-t-xl border-b px-6 py-4 transition-colors'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {typeof onRefresh === 'function' && (
            <button
              onClick={onRefresh}
              className='hover:bg-muted text-muted-foreground rounded p-1 transition-colors'
              title='Refresh engagements'
              aria-label='Refresh engagements'
            >
              <Icons.refresh className='h-5 w-5' />
            </button>
          )}
          <div>
            <h1 className='text-foreground text-3xl font-bold'>
              Active Engagements
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage and track your ongoing projects
            </p>
          </div>
        </div>
      </div>
    </header>
  );

  const FilterBar = () => {
    const totalEngagements = engagements.length;
    const activeEngagements = engagements.filter(
      (e) => e.status === 'In Progress'
    ).length;
    const pendingReview = engagements.filter(
      (e) => e.status === 'Under Review'
    ).length;
    return (
      <div className='bg-card dark:bg-card border-border border-b px-6 py-4 transition-colors'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <input
                type='text'
                placeholder='Search engagements...'
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className='border-border bg-background text-foreground placeholder-muted-foreground rounded-lg border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as typeof sortOption)
              }
              className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
            >
              <option value='clientName'>Sort: Client Name</option>
              <option value='status'>Sort: Status</option>
              <option value='startDate'>Sort: Start Date</option>
              <option value='deadline'>Sort: Deadline</option>
              <option value='progress'>Sort: Progress</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as Filters['status']
                }))
              }
              className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Status</option>
              <option value='Planning'>Planning</option>
              <option value='In Progress'>In Progress</option>
              <option value='Under Review'>Under Review</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  type: e.target.value as Filters['type']
                }))
              }
              className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Types</option>
              <option value='Audit'>Audit</option>
              <option value='Tax'>Tax</option>
            </select>
            <select
              value={filters.framework}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  framework: e.target.value as Filters['framework']
                }))
              }
              className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Frameworks</option>
              <option value='IFRS'>IFRS</option>
              <option value='GAPSME'>GAPSME</option>
            </select>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
              <span className='whitespace-nowrap'>
                Total: {totalEngagements}
              </span>
              <span className='whitespace-nowrap'>
                Active: {activeEngagements}
              </span>
              <span className='whitespace-nowrap'>Review: {pendingReview}</span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className='h-4 w-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <List className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EngagementCard = ({ engagement }: { engagement: any }) => {
    const StatusIcon = statusConfig['In Progress'].icon;
    const isOverdue = new Date(engagement.request.deadline) < new Date();
    return (
      <div className='bg-card dark:bg-card border-border rounded-lg border transition-all duration-200 hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-600'>
        <div className='p-2'>
          <div className='mb-4 flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='text-foreground mb-1 text-lg font-semibold'>
                {engagement.request.title}
              </h3>
              {/* Auditor Names */}
              <p className='mb-1 text-sm text-blue-700 dark:text-blue-300'>
                {engagement.auditor.name}
              </p>
              {/* Proposal (mocked) */}
              <p className='mb-1 text-sm text-green-700 dark:text-green-300'>
                Proposal: View proposal details
              </p>
              {/* Scope */}
              <p className='mb-2 text-sm text-gray-600 dark:text-gray-300'>
                Scope: tax compliance and filing requirements
              </p>
              <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                <div className='flex items-center gap-1'>
                  <Building className='h-4 w-4' />
                  <span>Audit</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Tag className='h-4 w-4' />
                  <span>{engagement.request.framework}</span>
                </div>
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${priorityConfig['Medium'].textColor} bg-opacity-10`}
            >
              Medium
              <span
                className={`h-2 w-2 rounded-full ${priorityConfig['Medium'].color}`}
              ></span>
              {engagement.priority}
            </div>
          </div>
          <div className='mb-4 flex items-center justify-between'>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusConfig['In Progress'].textColor} bg-opacity-10`}
            >
              <StatusIcon className='h-4 w-4' />
              In progress
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              {20}% Complete
            </div>
          </div>
          <div className='mb-4'>
            <div className='mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-300'>
              <span>Progress</span>
              <span>{20}%</span>
            </div>
            <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                style={{ width: `${20}%` }}
              ></div>
            </div>
          </div>
          <div className='mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              <span>
                Start: {new Date(engagement.startDate).toLocaleDateString()}
              </span>
            </div>
            <div
              className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}
            >
              <Clock className='h-4 w-4' />
              <span>
                Due:{' '}
                {new Date(engagement.request.deadline).toLocaleDateString()}
              </span>
              {isOverdue && (
                <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
              )}
            </div>
          </div>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-1'>
              <User className='h-4 w-4 text-gray-500 dark:text-gray-400' />
              <span className='text-sm whitespace-nowrap text-gray-600 dark:text-gray-300'>
                1 member
              </span>
            </div>
            <button
              // onClick={() => onEnterWorkspace(engagement)}
              onClick={() => {
                setSelectedEngagement(engagement);
                setIsSignModalOpen(true);
              }}
              className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700'
            >
              <Play className='h-4 w-4' />
              Enter Workspace
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EngagementListItem = ({ engagement }: { engagement: any }) => {
    const StatusIcon = statusConfig['In Progress'].icon;
    const isOverdue = new Date(engagement.request.deadline) < new Date();
    return (
      <div className='bg-card hover:bg-muted/50 grid min-w-[1280px] shrink-0 grid-cols-[2fr_1fr_1fr_150px_180px_auto] items-center gap-4 border-b p-4 transition-colors last:border-b-0 md:min-w-full'>
        <div className=''>
          <div className='text-foreground font-semibold'>
            {engagement.request.title}
          </div>
          <div className='text-muted-foreground line-clamp-1 text-sm'>
            tax compliance and filing requirements
          </div>
        </div>

        <div className='text-muted-foreground text-sm'>
          <div className='flex items-center gap-1.5'>
            <Building className='h-4 w-4 flex-shrink-0' />
            <span>Audit</span>
          </div>
          <div className='mt-1 flex items-center gap-1.5'>
            <Tag className='h-4 w-4 flex-shrink-0' />
            <span>{engagement.request.framework}</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 text-sm font-medium ${'text-yellow-500' /*statusConfig[engagement.status].textColor*/}`}
        >
          <Clock className='h-4 w-4' /* <StatusIcon /> */ />
          <span>In progress</span>
        </div>

        <div>
          <Progress value={engagement.progress} />
          <div className='text-muted-foreground mt-1 text-right text-xs'>
            {20}%
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 text-sm whitespace-nowrap ${true ? 'text-destructive font-medium' : 'text-muted-foreground'}`}
        >
          <Clock className='h-4 w-4' />
          <span>
            {new Date(engagement.request.deadline).toLocaleDateString()}
          </span>
          {true && <AlertCircle className='h-4 w-4' />}
        </div>

        <div className='text-right'>
          <Button
            // onClick={() => onEnterWorkspace(engagement)}
            onClick={() => {
              setSelectedEngagement(engagement);
              setIsSignModalOpen(true);
            }}
            variant='outline'
            size='sm'
          >
            <Play className='h-4 w-4 md:mr-2' />
            <span className='inline'>Workspace</span>
          </Button>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-700'>
        <FileText className='h-12 w-12 text-gray-500 dark:text-gray-400' />
      </div>
      <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
        No Active Engagements
      </h3>
      <p className='max-w-md text-gray-600 dark:text-gray-300'>
        You don&apos;t have any active engagements matching your current
        filters. Try adjusting your search criteria or create a new engagement.
      </p>
    </div>
  );

  return (
    <div className='bg-background dark:bg-background min-h-fit w-full shrink-0 transition-colors'>
      <Header />
      <FilterBar />
      <main className='max-h-[calc(100vh-280px)] overflow-y-auto py-6'>
        {filteredEngagements.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredEngagements.map((engagement) =>
              viewMode === 'grid' ? (
                <EngagementCard key={engagement.id} engagement={engagement} />
              ) : (
                <div
                  key={engagement.id}
                  className='grid grid-cols-1 overflow-x-auto'
                >
                  <EngagementListItem engagement={engagement} />
                </div>
              )
            )}
          </div>
        )}
      </main>

      {isSignModalOpen && (
        <SigningPortalModal
          selectedEngagement={selectedEngagement}
          open={isSignModalOpen}
          onOpenChange={setIsSignModalOpen}
          onEnterWorkspace={onEnterWorkspace}
        />
      )}
    </div>
  );
};

export default ActiveEngagements;
