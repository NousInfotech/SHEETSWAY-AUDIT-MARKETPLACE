import { listMilestones } from '@/api/engagement';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Milestone } from '@/features/engagements/types/milestone';
import { MilestoneCard } from '@/features/engagements/components/MilestoneCard';
import { MilestoneSkeleton } from '@/features/engagements/components/MilestoneSkeleton';
import { CreateMilestoneDialog } from '@/features/engagements/components/CreateMilestoneDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList } from 'lucide-react';

function MilestoneTab({ engagement }: any) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchMileStones = useCallback(async () => {
    // Keep loading true on manual refetch to show skeletons
    setLoading(true);
    setError(null);
    try {
      const data = await listMilestones({engagementId:engagement.id});
      console.log(data)
      setMilestones(data);
    } catch (err) {
      console.error('Failed to fetch milestones:', err);
      setError('Could not load milestones. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!engagement?.id) {
      setError('Engagement information is not available.');
      setLoading(false);
      return;
    }
    fetchMileStones();
  }, [engagement?.id, fetchMileStones]);

  const filteredMilestones = useMemo(() => {
    if (!engagement?.id) return [];
    // Sort milestones by creation date, newest first
    return milestones
      .filter((m) => m.engagementId === engagement.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [milestones, engagement?.id]);

  const renderContent = () => {
    if (loading) {
      // Render the new horizontal skeleton loaders
      return Array.from({ length: 3 }).map((_, index) => (
        <MilestoneSkeleton key={index} />
      ));
    }

    if (error) {
      return (
        <div className='col-span-full mt-10 text-center text-red-500'>
          <p>{error}</p>
        </div>
      );
    }

    if (filteredMilestones.length === 0) {
      return (
        <div className='mt-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
          <ClipboardList className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-2 text-xl font-semibold text-gray-900'>
            No Milestones Found
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Get started by adding a new milestone for this engagement.
          </p>
        </div>
      );
    }

    return filteredMilestones.map((milestone) => (
      <MilestoneCard key={milestone.id} milestone={milestone} />
    ));
  };

  if (!engagement?.id) {
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>
          Engagement or Auditor information is missing and required to manage
          milestones.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='p-4 md:p-6'>
        <header className='mx-auto mb-8 flex max-w-7xl items-center justify-between lg:w-4/5 xl:w-2/3'>
          <h2 className='text-3xl font-extrabold tracking-tight text-gray-900'>
            Engagement Milestones
          </h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add Milestone
          </Button>
        </header>

        {/* This container centers the content and controls the width */}
        <div className='mx-auto w-full max-w-7xl space-y-6 lg:w-4/5 xl:w-2/3'>
          {renderContent()}
        </div>
      </div>

      {/* The Dialog is rendered here but only visible when its state is open */}
      <CreateMilestoneDialog
        engagementId={engagement.id}
        auditorId={engagement.proposal.auditorId}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onMilestoneCreated={fetchMileStones}
      />
    </>
  );
}

export default MilestoneTab;
