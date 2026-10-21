'use client';

import { useMutationState, useSuspenseQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { checklistMutationKeys } from '../api/mutations';
import { checklistQueryOptions } from '../../shared/api/queries';
import type { AddChecklistItem } from '../../shared/api/types';
import { ExampleCard } from '../../shared/components/example-card';
import { SummaryList } from './summary-list';
import { ChecklistRow } from './checklist-row';

const COPY = {
  title: 'Update the cache',
  description:
    'Ticking a task writes it into the cache at once and rolls back if the request fails.',
  source: 'src/features/examples/data-fetching/components/checklist-card.tsx'
} as const;

const SKELETON_ROWS = 4;

const PENDING_ADDS = { mutationKey: checklistMutationKeys.add(), status: 'pending' } as const;

export function ChecklistCard({ takeFailFlag }: { takeFailFlag: () => boolean }) {
  const { data } = useSuspenseQuery(checklistQueryOptions());
  // Pattern 2's pending input, read from the mutation cache: the form lives in another component.
  const pendingAdds = useMutationState({
    filters: PENDING_ADDS,
    select: (mutation) => ({
      id: mutation.mutationId,
      title: (mutation.state.variables as AddChecklistItem).title
    })
  });

  return (
    <ExampleCard {...COPY}>
      <SummaryList>
        {data.items.map((item) => (
          <ChecklistRow key={item.id} item={item} takeFailFlag={takeFailFlag} />
        ))}
        {pendingAdds.map(({ id, title }) => (
          <li
            key={id}
            className='text-muted-foreground gap-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150'
          >
            <Spinner className='size-4' />
            <span>{title}</span>
            <span className='ms-auto text-xs'>Saving</span>
          </li>
        ))}
      </SummaryList>
    </ExampleCard>
  );
}

export function ChecklistCardSkeleton() {
  return (
    <ExampleCard {...COPY}>
      <SummaryList>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <li key={index} className='gap-3'>
            <Skeleton className='size-4 rounded-[4px]' />
            <Skeleton className='h-lh w-40' />
          </li>
        ))}
      </SummaryList>
    </ExampleCard>
  );
}
