// Plain-text descriptions of each chart, rendered as the chart's (visually hidden)
// figcaption. A chart alone isn't readable by a screen reader; these say what it shows.
import { formatCurrency } from '@/lib/format';
import {
  PARTNER_TIER_LABEL,
  partnerTierOptions
} from '@/features/partners/constants/partner-options';
import { PAYOUT_METHOD_LABEL } from '@/features/payouts/constants/payout-options';
import type {
  OverviewAveragePayout,
  OverviewMethodBreakdown,
  OverviewPartnerGrowthPoint,
  OverviewTopPartner,
  OverviewTrendPoint
} from '../api/types';
import { formatCount, formatMonth, formatPercent } from './chart-format';

const NO_DATA = 'No data yet.';

export function trendSummary(trend: OverviewTrendPoint[]) {
  const first = trend[0];
  const last = trend.at(-1);
  if (!first || !last) return NO_DATA;
  const paidTotal = trend.reduce((total, point) => total + point.payouts, 0);
  return `Revenue went from ${formatCurrency(first.revenue)} in ${formatMonth(first.month, true)} to ${formatCurrency(last.revenue)} in ${formatMonth(last.month, true)}. Paid payouts totalled ${formatCurrency(paidTotal)} over the 12 months.`;
}

function partnerTotal(point: OverviewPartnerGrowthPoint) {
  return partnerTierOptions.reduce((total, { value }) => total + point[value], 0);
}

export function partnerGrowthSummary(points: OverviewPartnerGrowthPoint[]) {
  const first = points[0];
  const last = points.at(-1);
  if (!first || !last) return NO_DATA;
  const byTier = partnerTierOptions
    .map(({ value }) => `${formatCount(last[value])} ${PARTNER_TIER_LABEL[value].toLowerCase()}`)
    .join(', ');
  return `Active partners went from ${formatCount(partnerTotal(first))} in ${formatMonth(first.month, true)} to ${formatCount(partnerTotal(last))} in ${formatMonth(last.month, true)}: ${byTier}.`;
}

export function methodSummary(rows: OverviewMethodBreakdown[], totalAmount: number) {
  const largest = rows.toSorted((a, b) => b.amount - a.amount)[0];
  if (!largest || totalAmount === 0) return 'No paid payouts in the last 12 months.';
  return `${PAYOUT_METHOD_LABEL[largest.method]} carries the largest share, ${formatPercent(largest.amount / totalAmount)} of ${formatCurrency(totalAmount)} paid.`;
}

export function averagePayoutSummary({ months, overall }: OverviewAveragePayout) {
  const paidMonths = months.filter(
    (point): point is { month: string; average: number } => point.average !== null
  );
  if (paidMonths.length === 0) return 'No paid payouts in the last 12 months.';
  const byAverage = paidMonths.toSorted((a, b) => a.average - b.average);
  const lowest = byAverage[0];
  const highest = byAverage[byAverage.length - 1];
  return `The monthly average ranged from ${formatCurrency(lowest.average)} in ${formatMonth(lowest.month, true)} to ${formatCurrency(highest.average)} in ${formatMonth(highest.month, true)}. The 12-month average is ${formatCurrency(overall)}.`;
}

export function topPartnersSummary(partners: OverviewTopPartner[]) {
  if (partners.length === 0) return 'No partners yet.';
  const list = partners
    .map((partner) => `${partner.name} (${formatCurrency(partner.revenue)})`)
    .join(', ');
  return `Lifetime revenue, highest first: ${list}.`;
}
