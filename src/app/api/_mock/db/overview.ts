////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { fakePartners } from '@/app/api/_mock/db/partners';
import { fakePayouts } from '@/app/api/_mock/db/payouts';
import {
  MOCK_DELAY,
  createSeededFaker,
  delay,
  getReferenceDate,
  roundMoney
} from '@/app/api/_mock/db/utils';
import { PARTNER_STATUS, PARTNER_TIER } from '@/features/partners/constants/partner-options';
import { PAYOUT_METHOD, PAYOUT_STATUS } from '@/features/payouts/constants/payout-options';
import type { Partner } from '@/features/partners/api/types';
import type { Payout } from '@/features/payouts/api/types';
import type {
  OverviewAveragePayout,
  OverviewKpiValues,
  OverviewMethodBreakdown,
  OverviewPartnerGrowthPoint,
  OverviewSummary,
  OverviewTopPartner,
  OverviewTrendPoint
} from '@/features/overview/api/types';

const OVERVIEW_SEED = 1907;
const TREND_MONTHS = 12;
const RECENT_PAYOUTS = 6;
const TOP_PARTNERS = 5;
// Partner revenue is lifetime (~3 years of history); spread it into a monthly baseline.
const LIFETIME_MONTHS = 36;
const GROWTH = { start: 0.8, end: 1.1 } as const;
const NOISE = { min: 0.88, max: 1.12 } as const;

const faker = createSeededFaker(OVERVIEW_SEED);
// One stable noise factor per trend month so the revenue line isn't a straight ramp.
const revenueNoise = Array.from({ length: TREND_MONTHS }, () =>
  faker.number.float({ ...NOISE, fractionDigits: 3 })
);

function monthStart(date: Date, offset = 0) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
}

function monthKey(date: Date) {
  return date.toISOString().slice(0, 7);
}

function sum(payouts: Payout[]) {
  return roundMoney(payouts.reduce((total, payout) => total + payout.amount, 0));
}

function paidBetween(payouts: Payout[], from: Date, to: Date) {
  return payouts.filter((payout) => {
    if (payout.status !== PAYOUT_STATUS.PAID || !payout.paidAt) return false;
    const paidAt = new Date(payout.paidAt).getTime();
    return paidAt >= from.getTime() && paidAt < to.getTime();
  });
}

type MonthWindow = { month: string; from: Date; to: Date };

/** The last TREND_MONTHS calendar months, oldest first; `to` is exclusive */
function trendWindows(reference: Date): MonthWindow[] {
  return Array.from({ length: TREND_MONTHS }, (_, index) => {
    const from = monthStart(reference, index - (TREND_MONTHS - 1));
    return { month: monthKey(from), from, to: monthStart(reference, index - (TREND_MONTHS - 2)) };
  });
}

function average(payouts: Payout[]) {
  return payouts.length > 0 ? roundMoney(sum(payouts) / payouts.length) : 0;
}

// Derived from joinedAt with today's status, so it's deterministic: a partner that is
// active now counts from the month it joined.
function partnerGrowth(
  windows: MonthWindow[],
  activePartners: Partner[]
): OverviewPartnerGrowthPoint[] {
  return windows.map(({ month, to }) => {
    const joined = activePartners.filter(
      (partner) => new Date(partner.joinedAt).getTime() < to.getTime()
    );
    const countTier = (tier: Partner['tier']) =>
      joined.filter((partner) => partner.tier === tier).length;
    return {
      month,
      [PARTNER_TIER.GOLD]: countTier(PARTNER_TIER.GOLD),
      [PARTNER_TIER.SILVER]: countTier(PARTNER_TIER.SILVER),
      [PARTNER_TIER.BRONZE]: countTier(PARTNER_TIER.BRONZE)
    };
  });
}

function methodBreakdown(paid: Payout[]): OverviewMethodBreakdown[] {
  return Object.values(PAYOUT_METHOD).map((method) => {
    const matching = paid.filter((payout) => payout.method === method);
    return { method, count: matching.length, amount: sum(matching) };
  });
}

function monthlyAverages(
  windows: MonthWindow[],
  payouts: Payout[]
): OverviewAveragePayout['months'] {
  return windows.map(({ month, from, to }) => {
    const paid = paidBetween(payouts, from, to);
    return { month, average: paid.length > 0 ? average(paid) : null };
  });
}

function topPartners(partners: Partner[]): OverviewTopPartner[] {
  return partners
    .toSorted((a, b) => b.revenue - a.revenue)
    .slice(0, TOP_PARTNERS)
    .map(({ id, name, revenue }) => ({ id, name, revenue }));
}

function kpiValues({
  activePartners,
  paid,
  pending
}: {
  activePartners: number;
  paid: Payout[];
  pending: Payout[];
}): OverviewKpiValues {
  const paidTotal = sum(paid);
  return {
    activePartners,
    payoutsThisMonth: paidTotal,
    pendingPayouts: sum(pending),
    pendingCount: pending.length,
    averagePayout: average(paid)
  };
}

export function buildOverviewSummary(): OverviewSummary {
  const reference = getReferenceDate();
  const thisMonth = monthStart(reference);
  const lastMonth = monthStart(reference, -1);
  const nextMonth = monthStart(reference, 1);
  const payouts = fakePayouts.records;
  const activePartners = fakePartners.records.filter(
    (partner) => partner.status === PARTNER_STATUS.ACTIVE
  );

  const current = kpiValues({
    activePartners: activePartners.length,
    paid: paidBetween(payouts, thisMonth, nextMonth),
    pending: payouts.filter((payout) => payout.status === PAYOUT_STATUS.PENDING)
  });

  // Approximation of the state at the start of this month: partners that had already
  // joined, and payouts created before then that were still unpaid at that point.
  const previous = kpiValues({
    activePartners: activePartners.filter(
      (partner) => new Date(partner.joinedAt).getTime() < thisMonth.getTime()
    ).length,
    paid: paidBetween(payouts, lastMonth, thisMonth),
    pending: payouts.filter((payout) => {
      if (new Date(payout.createdAt).getTime() >= thisMonth.getTime()) return false;
      if (payout.status === PAYOUT_STATUS.PENDING) return true;
      return (
        payout.status === PAYOUT_STATUS.PAID &&
        payout.paidAt !== null &&
        new Date(payout.paidAt).getTime() >= thisMonth.getTime()
      );
    })
  });

  const monthlyRevenueBase =
    fakePartners.records.reduce((total, partner) => total + partner.revenue, 0) / LIFETIME_MONTHS;

  const windows = trendWindows(reference);
  const trend: OverviewTrendPoint[] = windows.map(({ month, from, to }, index) => {
    const growth = GROWTH.start + ((GROWTH.end - GROWTH.start) * index) / (TREND_MONTHS - 1);
    return {
      month,
      revenue: roundMoney(monthlyRevenueBase * growth * revenueNoise[index]),
      payouts: sum(paidBetween(payouts, from, to))
    };
  });

  const statusBreakdown = Object.values(PAYOUT_STATUS).map((status) => {
    const matching = payouts.filter((payout) => payout.status === status);
    return { status, count: matching.length, amount: sum(matching) };
  });

  const recentPayouts = payouts
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_PAYOUTS);

  const paidInWindow = paidBetween(payouts, windows[0].from, windows[windows.length - 1].to);

  return {
    kpis: { ...current, previous },
    trend,
    statusBreakdown,
    recentPayouts,
    partnerGrowth: partnerGrowth(windows, activePartners),
    methodBreakdown: methodBreakdown(paidInWindow),
    averagePayout: { months: monthlyAverages(windows, payouts), overall: average(paidInWindow) },
    topPartners: topPartners(fakePartners.records)
  };
}

export async function getOverview() {
  await delay(MOCK_DELAY.DETAIL);
  return {
    success: true,
    time: new Date().toISOString(),
    ...buildOverviewSummary()
  };
}
