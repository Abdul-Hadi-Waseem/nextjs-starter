import type { IconName } from '@/components/stat-card';
import type { PartnerStats } from '../api/types';

// The partner detail stat cards. Shared by the cards and their skeleton so labels,
// icons and line count match. Formats live in partner-stats.tsx (a client module).
export const PARTNER_STAT_CARDS: readonly {
  key: keyof PartnerStats;
  label: string;
  icon: IconName;
  note: string;
}[] = [
  { key: 'paidTotal', label: 'Paid out', icon: 'circleCheck', note: 'All time' },
  { key: 'pendingTotal', label: 'Pending', icon: 'clock', note: 'Not paid yet' },
  { key: 'payoutCount', label: 'Payouts', icon: 'payouts', note: 'All statuses' }
];
