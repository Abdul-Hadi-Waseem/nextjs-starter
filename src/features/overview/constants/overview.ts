import { STAT_FORMAT, type StatFormat } from '@/components/count-up';
import type { IconName } from '@/components/stat-card';
import type { OverviewKpiValues } from '../api/types';

// Imported only by client components: STAT_FORMAT comes from a client module.

export const KPI_COMPARISON_LABEL = 'vs last month';
export const KPI_NO_PREVIOUS_TEXT = 'No data for last month';

type KpiCard = {
  key: keyof Omit<OverviewKpiValues, 'pendingCount'>;
  label: string;
  icon: IconName;
  format: StatFormat;
  /** Sub-line under the delta */
  hint?: (kpis: OverviewKpiValues) => string;
};

export const KPI_CARDS: readonly KpiCard[] = [
  {
    key: 'activePartners',
    label: 'Active partners',
    icon: 'partners',
    format: STAT_FORMAT.NUMBER
  },
  {
    key: 'payoutsThisMonth',
    label: 'Payouts this month',
    icon: 'payouts',
    format: STAT_FORMAT.CURRENCY
  },
  {
    key: 'pendingPayouts',
    label: 'Pending payouts',
    icon: 'clock',
    format: STAT_FORMAT.CURRENCY,
    hint: (kpis) => `${kpis.pendingCount} pending`
  },
  {
    key: 'averagePayout',
    label: 'Average payout',
    icon: 'wallet',
    format: STAT_FORMAT.CURRENCY
  }
];
