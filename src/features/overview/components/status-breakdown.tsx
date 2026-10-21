'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PAYOUT_STATUS_LABEL } from '@/features/payouts/constants/payout-options';
import { PAYOUT_STATUS_STYLE } from '@/features/payouts/constants/payout-status-style';
import { overviewQueryOptions } from '../api/queries';
import { BREAKDOWN_CONTENT, LIST_ROW_GRID, STATUS_ROW_HEIGHT } from '../constants/layout';
import { OVERVIEW_SECTION } from '../constants/sections';
import { formatCount, formatPercent } from '../lib/chart-format';
import { ChartCard } from './chart-card';

export function StatusBreakdown() {
  const { data } = useSuspenseQuery(overviewQueryOptions());
  const rows = data.statusBreakdown;
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  const totalCount = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <ChartCard {...OVERVIEW_SECTION.STATUS} contentClassName={BREAKDOWN_CONTENT}>
      {totalCount === 0 ? (
        <p className='text-muted-foreground'>
          No payouts yet. Payouts you create on the payouts page show up here.
        </p>
      ) : (
        <>
          <p className='text-muted-foreground'>
            <span className='text-foreground font-medium tabular-nums'>
              {formatCurrency(totalAmount)}
            </span>{' '}
            across {formatCount(totalCount)} payouts
          </p>
          {/* Share of the total amount per status. Decorative: the rows below carry the numbers. */}
          <div
            aria-hidden='true'
            className='bg-muted flex h-2 w-full gap-0.5 overflow-hidden rounded-full'
          >
            {rows.map((row) =>
              row.amount > 0 ? (
                <div
                  key={row.status}
                  className={PAYOUT_STATUS_STYLE[row.status].barClassName}
                  style={{ width: `${(row.amount / totalAmount) * 100}%` }}
                />
              ) : null
            )}
          </div>
        </>
      )}
      <ul>
        {rows.map((row) => {
          const Icon = Icons[PAYOUT_STATUS_STYLE[row.status].icon];
          return (
            <li key={row.status} className={cn(LIST_ROW_GRID, STATUS_ROW_HEIGHT)}>
              <span className='flex items-center gap-2'>
                <Icon className='text-muted-foreground size-4' aria-hidden='true' />
                {PAYOUT_STATUS_LABEL[row.status]}
              </span>
              <span className='text-muted-foreground tabular-nums'>
                {formatCount(row.count)} payouts
                {totalAmount > 0 && <> · {formatPercent(row.amount / totalAmount)}</>}
              </span>
              <span className='text-right font-medium tabular-nums'>
                {formatCurrency(row.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}
