import { Skeleton } from '@/components/ui/skeleton';
import { PartnerTierBadge } from '@/features/partners/components/partner-tier-badge';
import type { Partner } from '@/features/partners/api/types';
import { formatCountry } from '@/features/partners/lib/format-country';
import { formatCurrency } from '@/lib/format';

/** Name, country and revenue of one partner: the row used by the data-fetching examples. */
export function PartnerSummary({ partner }: { partner: Partner }) {
  return (
    <span className='flex min-w-0 flex-1 items-center justify-between gap-3'>
      <span className='grid min-w-0 gap-0.5'>
        <span className='truncate font-medium'>{partner.name}</span>
        <span className='text-muted-foreground truncate text-xs'>
          {formatCountry(partner.country)} · {formatCurrency(partner.revenue)} revenue
        </span>
      </span>
      <PartnerTierBadge tier={partner.tier} />
    </span>
  );
}

export function PartnerSummarySkeleton() {
  return (
    <span className='flex flex-1 items-center justify-between gap-3'>
      <span className='grid gap-0.5'>
        <Skeleton className='h-lh w-36' />
        <Skeleton className='h-4 w-48' />
      </span>
      <Skeleton className='h-5 w-14 rounded-full' />
    </span>
  );
}
