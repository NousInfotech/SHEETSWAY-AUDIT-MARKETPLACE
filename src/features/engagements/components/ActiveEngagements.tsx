'use client';
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
  User,
  RefreshCcw // Using RefreshCcw for a more modern refresh icon
} from 'lucide-react';
import { Icons } from '@/components/icons'; // Assuming Icons.refresh is used for refresh. If not, replace with RefreshCcw
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input'; // Import Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'; // Import Select components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { Badge } from '@/components/ui/badge'; // Import Badge for status/priority

// payment
import { loadStripe } from '@stripe/stripe-js';
import PaymentModal from './PaymentModal';
import { SigningPortalModal } from './SigningPortalModal';

import { useAuth } from '@/components/layout/providers';
import instance from '@/lib/axios';
import { ENGAGEMENT_API } from '@/config/api';
import { useClientEngagementStore } from '../store';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class merging

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    type: '',
    framework: ''
  });
  const [sortOption, setSortOption] = useState<
    | 'clientName'
    | 'status'
    | 'startDate'
    | 'deadline'
    | 'progress'
    | 'createdAt'
    | 'updatedAt'
  >('createdAt');

  const { appUser, loading: authLoading } = useAuth();
  let userId = appUser?.id;

  const { loadClientEngagements } = useClientEngagementStore();

  const handleUploadSuccess = () => {
    setIsSignModalOpen(false);
    if (appUser?.id) {
      loadClientEngagements(appUser.id);
    } else {
      console.error('User ID not available to refresh engagements.');
    }
  };

  const handlePayment = async (id: string) => {
    setIsProcessing(true);
    try {
      const res = await instance.post(
        `${ENGAGEMENT_API}/${id}/pre-engagement-payment/create`,
        { userId }
      );
      const checkoutUrl = res.data?.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error("Checkout URL was not found in the server's response.");
      }
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Payment Error:', error);
      alert(
        `Payment failed: ${error instanceof Error ? error.message : 'Unknown Error'}`
      );
      setIsProcessing(false);
    }
  };

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
        'engagement description' // Placeholder, replace with actual description field
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || 'In Progress' === filters.status; // engagement.status;
      const matchesType =
        !filters.type || engagement.request.type === filters.type;
      const matchesFramework =
        !filters.framework ||
        engagement.request.framework === filters.framework;
      return matchesSearch && matchesStatus && matchesType && matchesFramework;
    })
  );

  const Header = () => (
    <CardHeader className='bg-card flex flex-row items-center justify-between rounded-t-xl border-b px-6 py-4'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => location.reload()} // Or call onRefresh if it's external
          className='text-muted-foreground hover:bg-muted hover:text-foreground'
          title='Refresh engagements'
          aria-label='Refresh engagements'
        >
          <RefreshCcw className='h-5 w-5' /> {/* Using RefreshCcw */}
        </Button>
        <div>
          <CardTitle className='text-3xl font-bold'>
            Active Engagements
          </CardTitle>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage and track your ongoing projects
          </p>
        </div>
      </div>
    </CardHeader>
  );

  const FilterBar = () => {
    const totalEngagements = engagements.length;
    const activeEngagements = engagements.filter(
      (e) => e.status === 'In Progress'
    ).length; // Adjust based on actual status field
    const pendingReview = engagements.filter(
      (e) => e.status === 'Under Review'
    ).length; // Adjust based on actual status field

    return (
      <div className='bg-card border-b px-6 py-4'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                type='text'
                placeholder='Search engagements...'
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className='w-full pl-9 focus-visible:ring-amber-500 md:w-[200px]'
              />
            </div>
            <Select
              value={sortOption}
              onValueChange={(value: typeof sortOption) => setSortOption(value)}
            >
              <SelectTrigger className='w-[180px] focus:ring-amber-500'>
                <SelectValue placeholder='Sort: Created At' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt'>Sort: Created At</SelectItem>
                <SelectItem value='clientName'>Sort: Client Name</SelectItem>
                <SelectItem value='status'>Sort: Status</SelectItem>
                <SelectItem value='startDate'>Sort: Start Date</SelectItem>
                <SelectItem value='deadline'>Sort: Deadline</SelectItem>
                <SelectItem value='progress'>Sort: Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status === '' ? 'all' : filters.status}
              onValueChange={(newValue) => {
                // Renamed 'value' to 'newValue' to avoid confusion
                // Determine the actual status value for your filters state
                const statusValue: Filters['status'] =
                  newValue === 'all'
                    ? '' // If 'all' was selected, set internal status to empty string
                    : (newValue as Filters['status']); // Cast to Filters['status']
                setFilters((prev) => ({ ...prev, status: statusValue }));
              }}
            >
              <SelectTrigger className='w-[160px] focus:ring-amber-500'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='Planning'>Planning</SelectItem>
                <SelectItem value='In Progress'>In Progress</SelectItem>
                <SelectItem value='Under Review'>Under Review</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type === '' ? 'all' : filters.type}
              onValueChange={(newValue) => {
                const typeValue: Filters['type'] =
                  newValue === 'all' ? '' : (newValue as Filters['type']);
                setFilters((prev) => ({ ...prev, type: typeValue }));
              }}
            >
              <SelectTrigger className='w-[140px] focus:ring-amber-500'>
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='Audit'>Audit</SelectItem>
                <SelectItem value='Tax'>Tax</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.framework === '' ? 'all' : filters.framework}
              onValueChange={(newValue) => {
                const frameworkValue: Filters['framework'] =
                  newValue === 'all' ? '' : (newValue as Filters['framework']);
                setFilters((prev) => ({ ...prev, framework: frameworkValue }));
              }}
            >
              <SelectTrigger className='w-[180px] focus:ring-amber-500'>
                <SelectValue placeholder='All Frameworks' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Frameworks</SelectItem>
                <SelectItem value='IFRS'>IFRS</SelectItem>
                <SelectItem value='GAPSME'>GAPSME</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-4'>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <span className='whitespace-nowrap'>
                Total: <span className='font-semibold'>{totalEngagements}</span>
              </span>
              <span className='whitespace-nowrap'>
                Active:{' '}
                <span className='font-semibold'>{activeEngagements}</span>
              </span>
              <span className='whitespace-nowrap'>
                Review: <span className='font-semibold'>{pendingReview}</span>
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size='icon'
                onClick={() => setViewMode('grid')}
                className={cn(
                  viewMode === 'grid'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                title='Grid View'
              >
                <Grid className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size='icon'
                onClick={() => setViewMode('list')}
                className={cn(
                  viewMode === 'list'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                title='List View'
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EngagementCard = ({ engagement }: { engagement: any }) => {
    const currentStatusConfig = statusConfig['In Progress']; // Fallback
    const StatusIcon = currentStatusConfig.icon;
    const isOverdue = new Date(engagement.request.deadline) < new Date();
    const priority = engagement.priority || 'Medium'; // Default to Medium if not set
    const currentPriorityConfig = priorityConfig['Medium'];

    return (
      <Card className='group transform-gpu overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-gray-50 hover:border-indigo-300 hover:shadow-xl dark:hover:border-indigo-600'>
        <CardContent className='p-6'>
          <div className='mb-4 flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='text-foreground mb-1 text-lg font-semibold'>
                {engagement.request.title}
              </h3>
              <p className='mb-1 text-sm text-amber-700 dark:text-amber-300'>
                {engagement.auditor.name}
              </p>
              <p className='mb-1 text-sm text-green-700 dark:text-green-300'>
                Proposal: View proposal details
              </p>
              <p className='text-muted-foreground mb-2 text-sm'>
                Scope: tax compliance and filing requirements
              </p>
              <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                <div className='flex items-center gap-1'>
                  <Building className='h-4 w-4' />
                  <span>{engagement.request.type}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Tag className='h-4 w-4' />
                  <span>{engagement.request.framework}</span>
                </div>
              </div>
            </div>
            <Badge
              className={cn(
                'ml-auto',
                currentPriorityConfig.bgColor, // Use actual background color if defined
                currentPriorityConfig.textColor, // Use actual text color if defined
                'group-hover:ring-2 group-hover:ring-amber-500' // Stunning hover effect
              )}
            >
              {priority}
            </Badge>
          </div>

          <div className='mb-4 flex items-center justify-between'>
            <Badge
              className={cn(
                'inline-flex items-center gap-1.5',
                currentStatusConfig.bgColor, // Assuming statusConfig has a bgColor property
                currentStatusConfig.textColor, // Assuming statusConfig has a textColor property
                'group-hover:ring-2 group-hover:ring-amber-500' // Stunning hover effect
              )}
            >
              <StatusIcon className='h-3.5 w-3.5' />
              {engagement.status}
            </Badge>
            <div className='text-muted-foreground text-sm whitespace-nowrap'>
              {engagement.progress || 0}% Complete
            </div>
          </div>

          <div className='mb-4'>
            <div className='text-muted-foreground mb-1 flex justify-between text-sm'>
              <span>Progress</span>
              <span>{engagement.progress || 0}%</span>
            </div>
            <Progress
              value={engagement.progress || 0}
              className='h-2 [&>*]:bg-amber-500'
            />
          </div>

          <div className='text-muted-foreground mb-6 flex items-center justify-between text-sm'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              <span>
                Start: {new Date(engagement.startDate).toLocaleDateString()}
              </span>
            </div>
            <div
              className={cn(
                'flex items-center gap-1',
                isOverdue && 'font-medium text-red-600 dark:text-red-400'
              )}
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
              <User className='text-muted-foreground h-4 w-4' />
              <span className='text-xs text-muted-foreground whitespace-nowrap'>
                1
              </span>
            </div>
            {engagement.status !== 'AWAITING_PAYMENT' &&
              engagement.status !== 'ACTIVE' && (
                <Button
                  onClick={() => {
                    setSelectedEngagement(engagement);
                    setIsSignModalOpen(true);
                  }}
                  className='bg-indigo-500 text-white shadow-lg transition-all duration-200 group-hover:scale-[1.02] hover:bg-indigo-600 active:bg-indigo-700'
                >
                  <Play className='mr-1 h-4 w-4' />
                  GO TO START
                  <ArrowRight className='ml-1 h-4 w-4' />
                </Button>
              )}
            {engagement.status === 'AWAITING_PAYMENT' && (
              <Button
                onClick={() => {
                  setSelectedEngagement(engagement);
                  setIsPaymentModalOpen(true);
                }}
                className='bg-indigo-500 text-white shadow-lg transition-all duration-200 group-hover:scale-[1.02] hover:bg-indigo-600 active:bg-indigo-700'
              >
                <Play className='mr-2 h-4 w-4' />
                GO TO PAYMENT
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            )}
            {engagement.status === 'ACTIVE' && (
              <Button
                onClick={() => onEnterWorkspace(engagement)}
                className='bg-indigo-500 text-white shadow-lg transition-all duration-200 group-hover:scale-[1.02] hover:bg-indigo-600 active:bg-indigo-700'
              >
                <Play className='mr-2 h-4 w-4' />
                WORKSPACE
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EngagementListItem = ({ engagement }: { engagement: any }) => {
    const currentStatusConfig = statusConfig['In Progress'];
    const StatusIcon = currentStatusConfig.icon;
    const isOverdue = new Date(engagement.request.deadline) < new Date();

    return (
      <div className='group hover:bg-muted/50 grid min-w-[1280px] shrink-0 grid-cols-[2fr_1fr_1fr_150px_180px_auto] items-center gap-4 border-b p-4 transition-all duration-200 ease-in-out last:border-b-0 hover:shadow-sm md:min-w-full'>
        <div className=''>
          <div className='text-foreground font-semibold transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-300'>
            {engagement.request.title}
          </div>
          <div className='text-muted-foreground line-clamp-1 text-sm'>
            tax compliance and filing requirements
          </div>
        </div>

        <div className='text-muted-foreground text-sm'>
          <div className='flex items-center gap-1.5'>
            <Building className='h-4 w-4 flex-shrink-0' />
            <span>{engagement.request.type}</span>
          </div>
          <div className='mt-1 flex items-center gap-1.5'>
            <Tag className='h-4 w-4 flex-shrink-0' />
            <span>{engagement.request.framework}</span>
          </div>
        </div>

        <div
          className={cn(
            'flex items-center gap-2 text-sm font-medium',
            currentStatusConfig.textColor
          )}
        >
          <StatusIcon className='h-4 w-4' />
          <span>{engagement.status}</span>
        </div>

        <div>
          <Progress
            value={engagement.progress || 0}
            className='h-2 [&>*]:bg-amber-500'
          />
          <div className='text-muted-foreground mt-1 text-right text-xs'>
            {engagement.progress || 0}%
          </div>
        </div>

        <div
          className={cn(
            'flex items-center gap-1.5 text-sm whitespace-nowrap',
            isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
          )}
        >
          <Clock className='h-4 w-4' />
          <span>
            {new Date(engagement.request.deadline).toLocaleDateString()}
          </span>
          {isOverdue && <AlertCircle className='h-4 w-4' />}
        </div>

        <div className='text-right'>
          {engagement.status !== 'AWAITING_PAYMENT' &&
            engagement.status !== 'ACTIVE' && (
              <Button
                onClick={() => {
                  setSelectedEngagement(engagement);
                  setIsSignModalOpen(true);
                }}
                variant='outline'
                size='sm'
                className='border-amber-500 text-amber-500 group-hover:ring-2 group-hover:ring-amber-500 hover:bg-amber-50 hover:text-amber-600'
              >
                <Play className='h-4 w-4 md:mr-1' />
                <span className='inline text-xs'>GO TO START</span>
              </Button>
            )}
          {engagement.status === 'AWAITING_PAYMENT' && (
            <Button
              onClick={() => {
                setSelectedEngagement(engagement);
                setIsPaymentModalOpen(true);
              }}
              variant='outline'
              size='sm'
              className='border-amber-500 text-amber-500 group-hover:ring-2 group-hover:ring-amber-500 hover:bg-amber-50 hover:text-amber-600'
            >
              <Play className='h-4 w-4 md:mr-2' />
              <span className='inline text-xs'>GO TO PAYMENT</span>
            </Button>
          )}
          {engagement.status === 'ACTIVE' && (
            <Button
              onClick={() => onEnterWorkspace(engagement)}
              variant='outline'
              size='sm'
              className='border-amber-500 text-amber-500 group-hover:ring-2 group-hover:ring-amber-500 hover:bg-amber-50 hover:text-amber-600'
            >
              <Play className='h-4 w-4 md:mr-2' />
              <span className='inline text-xs'>WORKSPACE</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='bg-muted mb-4 rounded-full p-6'>
        <FileText className='text-muted-foreground h-12 w-12' />
      </div>
      <h3 className='text-foreground mb-2 text-lg font-semibold'>
        No Active Engagements
      </h3>
      <p className='text-muted-foreground max-w-md'>
        You don&apos;t have any active engagements matching your current
        filters. Try adjusting your search criteria or create a new engagement.
      </p>
    </div>
  );

  return (
    <Card className='min-h-fit w-full overflow-hidden'>
      <Header />
      <FilterBar />
      <main className='max-h-[calc(100vh-280px)] overflow-y-auto p-6'>
        {filteredEngagements.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'
                : 'space-y-4'
            )}
          >
            {filteredEngagements.map((engagement) =>
              viewMode === 'grid' ? (
                <EngagementCard key={engagement.id} engagement={engagement} />
              ) : (
                <div
                  key={engagement.id}
                  className='bg-card grid grid-cols-1 overflow-x-auto rounded-lg border shadow-sm'
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
          handleUploadSuccess={handleUploadSuccess}
        />
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        engagement={selectedEngagement}
        handlePayment={handlePayment}
        isProcessing={isProcessing}
      />
    </Card>
  );
};

export default ActiveEngagements;
