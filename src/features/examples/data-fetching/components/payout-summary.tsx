import { Skeleton } from '@/components/ui/skeleton';
import type { Payout } from '@/features/payouts/api/types';
import { PayoutStatusBadge } from '@/features/payouts/components/payout-status-badge';
import { formatCurrency, formatDate, SHORT_DATE_FORMAT } from '@/lib/format';

/** Partner, amount, date and status of one payout. */
export function PayoutSummary({ payout }: { payout: Payout }) {
  return (
    <span className='flex min-w-0 flex-1 items-center justify-between gap-3'>
      <span className='grid min-w-0 gap-0.5'>
        <span className='truncate font-medium tabular-nums'>
          {formatCurrency(payout.amount, payout.currency)}
        </span>
        <span className='text-muted-foreground truncate text-xs'>
          {payout.partnerName} · {formatDate(payout.scheduledFor, SHORT_DATE_FORMAT)}
        </span>
      </span>
      <PayoutStatusBadge status={payout.status} />
    </span>
  );
}

export function PayoutSummarySkeleton() {
  return (
    <span className='flex flex-1 items-center justify-between gap-3'>
      <span className='grid gap-0.5'>
        <Skeleton className='h-lh w-24' />
        <Skeleton className='h-4 w-44' />
      </span>
      <Skeleton className='h-5 w-16 rounded-full' />
    </span>
  );
}
