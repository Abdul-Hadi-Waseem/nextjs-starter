'use client';

import { useSuspenseQueries } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { payoutsQueryOptions } from '@/features/payouts/api/queries';
import { ExampleCard } from '../../shared/components/example-card';
import { TOTALS_FILTERS } from '../../shared/constants/demo';

const COPY = {
  title: 'Parallel: two totals at once',
  description: 'useSuspenseQueries starts both requests together and waits for both.',
  source: 'src/features/examples/data-fetching/components/parallel-totals.tsx'
} as const;

const LABELS = ['Partners', 'Payouts'] as const;

export function ParallelTotals() {
  const [partners, payouts] = useSuspenseQueries({
    queries: [partnersQueryOptions(TOTALS_FILTERS), payoutsQueryOptions(TOTALS_FILTERS)]
  });
  const totals = [partners.data.total_partners, payouts.data.total_payouts];

  return (
    <ExampleCard {...COPY}>
      <dl className='grid grid-cols-2 gap-4'>
        {LABELS.map((label, index) => (
          <div key={label} className='grid gap-1'>
            <dt className='text-muted-foreground text-sm'>{label}</dt>
            <dd className='text-2xl font-semibold tabular-nums'>{totals[index]}</dd>
          </div>
        ))}
      </dl>
    </ExampleCard>
  );
}

export function ParallelTotalsSkeleton() {
  return (
    <ExampleCard {...COPY}>
      <div className='grid grid-cols-2 gap-4'>
        {LABELS.map((label) => (
          <div key={label} className='grid gap-1'>
            <span className='text-muted-foreground text-sm'>{label}</span>
            <Skeleton className='h-8 w-16' />
          </div>
        ))}
      </div>
    </ExampleCard>
  );
}
