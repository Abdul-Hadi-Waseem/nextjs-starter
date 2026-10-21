'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { overviewQueryOptions } from '../api/queries';
import { OVERVIEW_SECTION } from '../constants/sections';
import { partnerGrowthSummary } from '../lib/chart-summaries';
import { ChartCard } from './chart-card';
import { ChartPlotSkeleton } from './chart-placeholders';
import { clientOnly } from './lazy-graphs';

const PartnerGrowthChart = clientOnly(
  () => import('./partner-growth-chart').then((m) => m.PartnerGrowthChart),
  <ChartPlotSkeleton />
);

export function PartnerGrowthSection() {
  const { data } = useSuspenseQuery(overviewQueryOptions());

  return (
    <ChartCard {...OVERVIEW_SECTION.GROWTH} summary={partnerGrowthSummary(data.partnerGrowth)}>
      <PartnerGrowthChart data={data.partnerGrowth} />
    </ChartCard>
  );
}
