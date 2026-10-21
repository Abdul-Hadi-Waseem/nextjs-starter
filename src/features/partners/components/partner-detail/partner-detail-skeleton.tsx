import { StatCardSkeleton } from '@/components/stat-card';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PARTNER_STAT_CARDS } from '../../constants/partner-stats';
import { PARTNER_RECENT_PAYOUTS_LIMIT } from '../../constants/partner-table';

// Same wrappers and text classes as PartnerDetail; `h-lh` makes each placeholder exactly
// one line of the text it stands in for, so nothing moves when the data arrives.
export function PartnerDetailSkeleton() {
  return (
    <div role='status' className='flex flex-col gap-6'>
      <span className='sr-only'>Loading partner…</span>
      <div
        aria-hidden='true'
        className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
      >
        <div className='flex min-w-0 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
            <div className='text-3xl font-bold'>
              <Skeleton className='h-lh w-56' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-16 rounded-4xl' />
              <Skeleton className='h-5 w-14 rounded-4xl' />
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-x-5 gap-y-1 text-sm'>
            <Skeleton className='my-1 h-4 w-28' />
            <Skeleton className='my-1 h-4 w-52' />
            <Skeleton className='my-1 h-4 w-32' />
            <Skeleton className='my-1 h-4 w-36' />
          </div>
        </div>
        <Skeleton className='h-8 w-28 shrink-0 rounded-lg' />
      </div>

      <div aria-hidden='true' className='grid gap-4 sm:grid-cols-3'>
        {PARTNER_STAT_CARDS.map((card) => (
          <StatCardSkeleton key={card.key} label={card.label} icon={card.icon} />
        ))}
      </div>

      <Card aria-hidden='true'>
        <CardHeader>
          <CardTitle>Recent payouts</CardTitle>
          <CardAction>
            <Skeleton className='h-7 w-16 rounded-lg' />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul className='divide-y'>
            {Array.from({ length: PARTNER_RECENT_PAYOUTS_LIMIT }, (_, i) => (
              <li
                key={i}
                className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'
              >
                <div>
                  <div className='font-medium'>
                    <Skeleton className='h-lh w-20' />
                  </div>
                  <div className='text-xs'>
                    <Skeleton className='h-lh w-48' />
                  </div>
                </div>
                <Skeleton className='h-5 w-16 rounded-4xl' />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
