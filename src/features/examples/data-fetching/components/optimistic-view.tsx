import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { checklistQueryOptions } from '../../shared/api/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { AddTaskCardSkeleton } from './add-task-card';
import { ChecklistCardSkeleton } from './checklist-card';
import { OptimisticDemo } from './optimistic-demo';
import { EXAMPLE_GRID } from '../../shared/constants/layout';

export function OptimisticView() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(checklistQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OptimisticDemo />
    </HydrationBoundary>
  );
}

export function OptimisticSkeleton() {
  return (
    <div className='grid gap-4'>
      <div className='flex min-h-8 flex-wrap items-center justify-between gap-4'>
        <Skeleton className='h-5 w-48' />
        <Skeleton className='h-5 w-28' />
      </div>
      <div className={EXAMPLE_GRID}>
        <ChecklistCardSkeleton />
        <AddTaskCardSkeleton />
      </div>
    </div>
  );
}
