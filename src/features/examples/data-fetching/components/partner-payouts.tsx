'use client';

import { useQuery } from '@tanstack/react-query';
import { payoutsQueryOptions } from '@/features/payouts/api/queries';
import { QueryError } from '../../shared/components/query-error';
import { PayoutSummary, PayoutSummarySkeleton } from './payout-summary';
import { SummaryList } from './summary-list';
import { EXAMPLE_PAGE_SIZE } from '../../shared/constants/demo';

// Dependent query: `enabled` keeps it idle until a partner is picked.
export function PartnerPayouts({ partnerId }: { partnerId: string | null }) {
  const { data, error, isPending, fetchStatus } = useQuery({
    ...payoutsQueryOptions({ partnerId: partnerId ?? undefined, limit: EXAMPLE_PAGE_SIZE }),
    enabled: partnerId !== null
  });

  // Disabled and never fetched: pending, but idle.
  if (isPending && fetchStatus === 'idle') {
    return <p className='text-muted-foreground text-sm'>Pick a partner to load their payouts.</p>;
  }

  if (isPending) {
    return (
      <SummaryList>
        {Array.from({ length: EXAMPLE_PAGE_SIZE }, (_, index) => (
          <li key={index}>
            <PayoutSummarySkeleton />
          </li>
        ))}
      </SummaryList>
    );
  }

  if (error) return <QueryError error={error} />;

  if (!data || data.payouts.length === 0) {
    return <p className='text-muted-foreground text-sm'>No payouts for this partner yet.</p>;
  }

  return (
    <SummaryList>
      {data.payouts.map((payout) => (
        <li key={payout.id}>
          <PayoutSummary payout={payout} />
        </li>
      ))}
    </SummaryList>
  );
}
