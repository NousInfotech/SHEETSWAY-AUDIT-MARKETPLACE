

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MilestoneSkeleton() {
  return (
    <Card className='w-full overflow-hidden border-l-4 border-l-gray-200'>
      <div className='flex items-stretch justify-between'>
        {/* Main Content Area */}
        <div className='flex-grow'>
          <CardHeader className='pb-2'>
            <Skeleton className='h-8 w-3/4' />
          </CardHeader>
          <CardContent className='grid gap-4 pt-2 text-sm sm:grid-cols-2 md:grid-cols-3'>
            {/* Due Date Skeleton */}
            <div className='flex flex-col space-y-2'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-5 w-2/3' />
            </div>
            {/* Auditor Skeleton */}
            <div className='flex flex-col space-y-2'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-5 w-2/3' />
            </div>
            {/* Date Info Skeleton */}
            <div className='flex flex-col space-y-2'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-5 w-2/3' />
            </div>
          </CardContent>
        </div>
        {/* Right Meta & Actions Area */}
        <div className='flex flex-shrink-0 flex-col items-center justify-between bg-muted/30 p-4'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-9 w-9 rounded-md' />
        </div>
      </div>
    </Card>
  );
}