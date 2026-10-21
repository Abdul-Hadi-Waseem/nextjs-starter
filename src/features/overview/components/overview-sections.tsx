import { AveragePayoutSection } from './average-payout-section';
import { KpiCards, KpiCardsSkeleton } from './kpi-cards';
import { OverviewGrid } from './overview-grid';
import {
  ChartSectionSkeleton,
  PayoutMethodsSkeleton,
  RecentPayoutsSkeleton,
  StatusBreakdownSkeleton
} from './overview-skeletons';
import { PartnerGrowthSection } from './partner-growth-section';
import { PayoutMethodsSection } from './payout-methods-section';
import { RecentPayouts } from './recent-payouts';
import { StatusBreakdown } from './status-breakdown';
import { TopPartnersSection } from './top-partners-section';
import { TrendSection } from './trend-section';
import { OVERVIEW_SECTION } from '../constants/sections';

// Every section reads the one overview query, so they all suspend on the same
// request and appear together behind the route's single loading.tsx.
export function OverviewSections() {
  return (
    <OverviewGrid
      kpis={<KpiCards />}
      trend={<TrendSection />}
      status={<StatusBreakdown />}
      growth={<PartnerGrowthSection />}
      methods={<PayoutMethodsSection />}
      average={<AveragePayoutSection />}
      top={<TopPartnersSection />}
      recent={<RecentPayouts />}
    />
  );
}

export function OverviewSectionsSkeleton() {
  return (
    <OverviewGrid
      kpis={<KpiCardsSkeleton />}
      trend={<ChartSectionSkeleton section={OVERVIEW_SECTION.TREND} />}
      status={<StatusBreakdownSkeleton />}
      growth={<ChartSectionSkeleton section={OVERVIEW_SECTION.GROWTH} />}
      methods={<PayoutMethodsSkeleton />}
      average={<ChartSectionSkeleton section={OVERVIEW_SECTION.AVERAGE} />}
      top={<ChartSectionSkeleton section={OVERVIEW_SECTION.TOP_PARTNERS} />}
      recent={<RecentPayoutsSkeleton />}
    />
  );
}
