'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { partnerByIdOptions } from '@/features/partners/api/queries';
import { PartnerStatusBadge } from '@/features/partners/components/partner-status-badge';
import { QueryError } from '../../shared/components/query-error';
import { formatCurrency } from '@/lib/format';

const DETAIL_ROWS = 3;

export function PrefetchPartnerDetail({ partnerId }: { partnerId: string | null }) {
  const { data, error } = useQuery({
    ...partnerByIdOptions(partnerId ?? ''),
    enabled: partnerId !== null
  });

  if (partnerId === null) {
    return (
      <p className='text-muted-foreground text-sm'>
        Hover or tab to a partner, then pick it. Its detail is usually in the cache already.
      </p>
    );
  }

  if (error) return <QueryError error={error} />;

  if (!data) {
    return (
      <div className='grid gap-2' role='status' aria-label='Loading partner'>
        {Array.from({ length: DETAIL_ROWS }, (_, index) => (
          <Skeleton key={index} className='h-lh w-48' />
        ))}
      </div>
    );
  }

  const { partner, stats } = data;
  return (
    <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm'>
      <dt className='text-muted-foreground'>Contact</dt>
      <dd className='truncate'>{partner.contactName}</dd>
      <dt className='text-muted-foreground'>Status</dt>
      <dd>
        <PartnerStatusBadge status={partner.status} />
      </dd>
      <dt className='text-muted-foreground'>Paid out</dt>
      <dd className='tabular-nums'>
        {formatCurrency(stats.paidTotal)} in {stats.payoutCount} payouts
      </dd>
    </dl>
  );
}
