'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { overviewQueryOptions } from '../api/queries';
import { OVERVIEW_SECTION } from '../constants/sections';
import { trendSummary } from '../lib/chart-summaries';
import { ChartCard } from './chart-card';
import { ChartPlotSkeleton } from './chart-placeholders';
import { clientOnly } from './lazy-graphs';

const TrendChart = clientOnly(
  () => import('./trend-chart').then((m) => m.TrendChart),
  <ChartPlotSkeleton />
);

export function TrendSection() {
  const { data } = useSuspenseQuery(overviewQueryOptions());

  return (
    <ChartCard {...OVERVIEW_SECTION.TREND} summary={trendSummary(data.trend)}>
      <TrendChart data={data.trend} />
    </ChartCard>
  );
}
