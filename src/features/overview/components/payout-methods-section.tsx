'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PAYOUT_METHOD_LABEL } from '@/features/payouts/constants/payout-options';
import { overviewQueryOptions } from '../api/queries';
import { DONUT_PLOT_HEIGHT, METHOD_CHART_COLOR } from '../constants/chart';
import { BREAKDOWN_CONTENT, LIST_ROW_GRID, STATUS_ROW_HEIGHT } from '../constants/layout';
import { OVERVIEW_SECTION } from '../constants/sections';
import { formatCount, formatPercent } from '../lib/chart-format';
import { methodSummary } from '../lib/chart-summaries';
import { ChartCard } from './chart-card';
import { ChartEmpty, ChartPlotSkeleton } from './chart-placeholders';
import { clientOnly } from './lazy-graphs';

const PayoutMethodsChart = clientOnly(
  () => import('./payout-methods-chart').then((m) => m.PayoutMethodsChart),
  <ChartPlotSkeleton heightClassName={DONUT_PLOT_HEIGHT} />
);

// Donut plus legend. The legend is a plain list with the values, so it's readable
// without the chart and rendered on the server; the donut loads lazily above it.
export function PayoutMethodsSection() {
  const { data } = useSuspenseQuery(overviewQueryOptions());
  const rows = data.methodBreakdown;
  const totalAmount = rows.reduce((total, row) => total + row.amount, 0);

  if (totalAmount === 0) {
    return (
      <ChartCard {...OVERVIEW_SECTION.METHODS}>
        <ChartEmpty
          heightClassName={DONUT_PLOT_HEIGHT}
          message='No paid payouts in the last 12 months. Paid payouts show up here by method.'
        />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      {...OVERVIEW_SECTION.METHODS}
      summary={methodSummary(rows, totalAmount)}
      contentClassName={BREAKDOWN_CONTENT}
    >
      <PayoutMethodsChart data={rows} totalAmount={totalAmount} />
      <ul aria-label='Paid amount by method'>
        {rows.map((row) => (
          <li key={row.method} className={cn(LIST_ROW_GRID, STATUS_ROW_HEIGHT)}>
            <span className='flex items-center gap-2'>
              <span
                aria-hidden='true'
                className='size-2.5 shrink-0 rounded-[2px]'
                style={{ backgroundColor: METHOD_CHART_COLOR[row.method] }}
              />
              {PAYOUT_METHOD_LABEL[row.method]}
            </span>
            <span className='text-muted-foreground tabular-nums'>
              {formatCount(row.count)} payouts · {formatPercent(row.amount / totalAmount)}
            </span>
            <span className='text-right font-medium tabular-nums'>
              {formatCurrency(row.amount)}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
