import type { PayoutMethod, PayoutStatus } from '@/features/payouts/constants/payout-options';
import type { Payout } from '@/features/payouts/api/types';
import type { Partner } from '@/features/partners/api/types';
import type { PartnerTier } from '@/features/partners/constants/partner-options';

export type OverviewKpiValues = {
  activePartners: number;
  /** Paid amount (USD) in the period */
  payoutsThisMonth: number;
  /** Pending amount (USD) */
  pendingPayouts: number;
  pendingCount: number;
  /** Average paid payout (USD) in the period */
  averagePayout: number;
};

export type OverviewKpis = OverviewKpiValues & {
  /** Same values for the previous month, for deltas */
  previous: OverviewKpiValues;
};

export type OverviewTrendPoint = {
  /** YYYY-MM */
  month: string;
  revenue: number;
  payouts: number;
};

export type OverviewStatusBreakdown = {
  status: PayoutStatus;
  count: number;
  amount: number;
};

/** Active partners that had joined by the end of the month, per tier */
export type OverviewPartnerGrowthPoint = { month: string } & Record<PartnerTier, number>;

/** Paid payouts in the last 12 months, per method */
export type OverviewMethodBreakdown = {
  method: PayoutMethod;
  count: number;
  amount: number;
};

export type OverviewAveragePayoutPoint = {
  /** YYYY-MM */
  month: string;
  /** Average paid payout (USD); null when nothing was paid that month */
  average: number | null;
};

export type OverviewAveragePayout = {
  /** Last 12 months, oldest first */
  months: OverviewAveragePayoutPoint[];
  /** Average paid payout (USD) over all 12 months */
  overall: number;
};

export type OverviewTopPartner = Pick<Partner, 'id' | 'name' | 'revenue'>;

export type OverviewSummary = {
  kpis: OverviewKpis;
  /** Last 12 months, oldest first */
  trend: OverviewTrendPoint[];
  statusBreakdown: OverviewStatusBreakdown[];
  /** Latest 6 payouts by createdAt */
  recentPayouts: Payout[];
  /** Last 12 months, oldest first */
  partnerGrowth: OverviewPartnerGrowthPoint[];
  methodBreakdown: OverviewMethodBreakdown[];
  averagePayout: OverviewAveragePayout;
  /** Top 5 partners by lifetime revenue, highest first */
  topPartners: OverviewTopPartner[];
};

export type OverviewResponse = OverviewSummary & {
  success: boolean;
  time: string;
};
