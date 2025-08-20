

import React from 'react';
import { Milestone, MilestoneStatus } from '@/features/engagements/types/milestone';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Circle,
  CircleCheck,
  CircleDotDashed,
  CalendarDays,
  UserCircle,
  MoreVertical,
  PauseCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced status config to include border colors for the horizontal design
const statusConfig: Record<
  MilestoneStatus,
  {
    label: string;
    icon: React.ReactNode;
    badgeColor: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
    textColor: string;
    borderColor: string;
  }
> = {
  not_started: {
    label: 'Not Started',
    icon: <Circle className='mr-2 h-4 w-4' />,
    badgeColor: 'secondary',
    textColor: 'text-muted-foreground',
    borderColor: 'border-l-gray-400',
  },
  in_progress: {
    label: 'In Progress',
    icon: <CircleDotDashed className='mr-2 h-4 w-4 animate-spin' />,
    badgeColor: 'outline',
    textColor: 'text-blue-500',
    borderColor: 'border-l-blue-500',
  },
  completed: {
    label: 'Completed',
    icon: <CircleCheck className='mr-2 h-4 w-4' />,
    badgeColor: 'success',
    textColor: 'text-green-600',
    borderColor: 'border-l-green-600',
  },
  on_hold: {
    label: 'On Hold',
    icon: <PauseCircle className='mr-2 h-4 w-4' />,
    badgeColor: 'warning',
    textColor: 'text-yellow-600',
    borderColor: 'border-l-yellow-500',
  },
};

interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { label, status, dueDate, completedAt, auditorId, createdAt } = milestone;
  const config = statusConfig[status] || statusConfig.not_started;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className='text-gray-400'>—</span>;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Card
        className={cn(
          'w-full overflow-hidden border-l-4 transition-all duration-300 hover:shadow-xl',
          config.borderColor
        )}
      >
        <div className='flex items-stretch justify-between'>
          {/* Main Content Area */}
          <div className='flex-grow'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-2xl font-bold tracking-tight'>{label}</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 pt-2 text-sm sm:grid-cols-2 md:grid-cols-3'>
              {/* Due Date */}
              <div className='flex flex-col'>
                <span className='font-semibold text-muted-foreground'>Due Date</span>
                <div className='mt-1 flex items-center font-medium'>
                  <CalendarDays className='mr-2 h-4 w-4 text-primary/80' />
                  {formatDate(dueDate)}
                </div>
              </div>

              {/* Auditor */}
              <div className='flex flex-col'>
                <span className='font-semibold text-muted-foreground'>Assigned Auditor</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='mt-1 flex cursor-pointer items-center font-medium'>
                      <UserCircle className='mr-2 h-4 w-4 text-primary/80' />
                      <span className='font-mono text-xs'>...{auditorId.slice(-12)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{auditorId}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Date Info */}
              <div className='flex flex-col'>
                 <span className='font-semibold text-muted-foreground'>
                   {status === 'completed' ? 'Completed On' : 'Created On'}
                 </span>
                 <div className='mt-1 flex items-center font-medium'>
                   <Clock className='mr-2 h-4 w-4 text-primary/80' />
                   {formatDate(status === 'completed' ? completedAt : createdAt)}
                 </div>
              </div>
            </CardContent>
          </div>

          {/* Right Meta & Actions Area */}
          <div className='flex flex-shrink-0 flex-col items-center justify-between bg-muted/30 p-4'>
            <Badge variant={config.badgeColor} className={`text-base font-bold ${config.textColor}`}>
              {config.icon}
              {config.label}
            </Badge>
            <Button variant='outline' size='icon' className='h-9 w-9'>
              <MoreVertical className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}