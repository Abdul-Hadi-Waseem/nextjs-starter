'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatCurrency, formatDate, SHORT_DATE_FORMAT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { overviewQueryOptions } from '../api/queries';
import { PARTNER_ROUTES } from '@/features/partners/constants/partner-routes';
import { LIST_ROW_GRID, RECENT_PAYOUT_ROW_HEIGHT } from '../constants/layout';
import { OVERVIEW_SECTION } from '../constants/sections';
import { ChartCard } from './chart-card';
import { ViewAllPayoutsLink } from './view-all-payouts-link';
import { PayoutStatusBadge } from '@/features/payouts/components/payout-status-badge';

export function RecentPayouts() {
  const { data } = useSuspenseQuery(overviewQueryOptions());
  const payouts = data.recentPayouts;

  return (
    <ChartCard {...OVERVIEW_SECTION.RECENT} action={<ViewAllPayoutsLink />}>
      {payouts.length === 0 ? (
        <p className='text-muted-foreground text-sm'>
          No payouts yet. Create one on the payouts page and it shows up here.
        </p>
      ) : (
        <ul className='divide-y'>
          {payouts.map((payout) => (
            <li
              key={payout.id}
              // The partner link stretches over the row (after:inset-0), so the whole
              // row is the click target and shows the link's focus ring.
              className={cn(
                LIST_ROW_GRID,
                RECENT_PAYOUT_ROW_HEIGHT,
                'hover:bg-muted/50 has-focus-visible:bg-muted/50 has-focus-visible:ring-ring/50 relative rounded-md px-2 has-focus-visible:ring-3 motion-safe:transition-transform motion-safe:active:scale-[0.99]'
              )}
            >
              <div className='flex min-w-0 flex-col gap-0.5'>
                <Link
                  href={PARTNER_ROUTES.detail(payout.partnerId)}
                  className='truncate text-sm font-medium outline-none after:absolute after:inset-0 after:rounded-md'
                >
                  {payout.partnerName}
                </Link>
                <span className='text-muted-foreground text-xs'>
                  Scheduled {formatDate(payout.scheduledFor, SHORT_DATE_FORMAT)}
                </span>
              </div>
              <PayoutStatusBadge status={payout.status} />
              <span className='text-right text-sm font-medium tabular-nums'>
                {formatCurrency(payout.amount, payout.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
