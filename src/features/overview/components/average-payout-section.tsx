'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { overviewQueryOptions } from '../api/queries';
import { OVERVIEW_SECTION } from '../constants/sections';
import { averagePayoutSummary } from '../lib/chart-summaries';
import { ChartCard } from './chart-card';
import { ChartEmpty, ChartPlotSkeleton } from './chart-placeholders';
import { clientOnly } from './lazy-graphs';

const AveragePayoutChart = clientOnly(
  () => import('./average-payout-chart').then((m) => m.AveragePayoutChart),
  <ChartPlotSkeleton />
);

export function AveragePayoutSection() {
  const { data } = useSuspenseQuery(overviewQueryOptions());
  const { averagePayout } = data;
  const hasPaid = averagePayout.months.some((point) => point.average !== null);

  return (
    <ChartCard
      {...OVERVIEW_SECTION.AVERAGE}
      summary={hasPaid ? averagePayoutSummary(averagePayout) : undefined}
    >
      {hasPaid ? (
        <AveragePayoutChart data={averagePayout} />
      ) : (
        <ChartEmpty message='No paid payouts in the last 12 months. Paid payouts show up here.' />
      )}
    </ChartCard>
  );
}
