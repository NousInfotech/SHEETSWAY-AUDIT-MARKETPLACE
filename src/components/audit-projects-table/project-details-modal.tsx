'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Project } from './columns';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

// Re-using helper functions from columns.tsx for consistency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

const getStatusBadgeVariant = (
  status: Project['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Fieldwork':
    case 'Manager Review':
    case 'Partner Review':
      return 'secondary';
    case 'Planning':
      return 'outline';
    case 'Awaiting Client Info':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project
}: ProjectDetailsModalProps) {
  // Don't render anything if there's no project selected
  if (!project) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{project.projectName}</DialogTitle>
          <DialogDescription>
            Detailed information for this engagement.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-muted-foreground'>Status</span>
            <div className='col-span-2'>
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {project.status}
              </Badge>
            </div>
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-muted-foreground'>Budget</span>
            <span className='col-span-2 font-mono text-lg font-semibold'>
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-muted-foreground'>Start Date</span>
            <span className='col-span-2'>
              {new Date(project.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-muted-foreground'>End Date</span>
            <span className='col-span-2'>
              {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
