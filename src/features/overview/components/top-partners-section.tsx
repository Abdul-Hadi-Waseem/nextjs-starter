'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { overviewQueryOptions } from '../api/queries';
import { OVERVIEW_SECTION } from '../constants/sections';
import { topPartnersSummary } from '../lib/chart-summaries';
import { ChartCard } from './chart-card';
import { ChartEmpty, ChartPlotSkeleton } from './chart-placeholders';
import { clientOnly } from './lazy-graphs';

const TopPartnersChart = clientOnly(
  () => import('./top-partners-chart').then((m) => m.TopPartnersChart),
  <ChartPlotSkeleton />
);

export function TopPartnersSection() {
  const { data } = useSuspenseQuery(overviewQueryOptions());
  const partners = data.topPartners;

  return (
    <ChartCard
      {...OVERVIEW_SECTION.TOP_PARTNERS}
      summary={partners.length > 0 ? topPartnersSummary(partners) : undefined}
    >
      {partners.length > 0 ? (
        <TopPartnersChart data={partners} />
      ) : (
        <ChartEmpty message='No partners yet. Add a partner on the partners page to see it here.' />
      )}
    </ChartCard>
  );
}
