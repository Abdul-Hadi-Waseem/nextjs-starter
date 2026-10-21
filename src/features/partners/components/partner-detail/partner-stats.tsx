'use client';

import { STAT_FORMAT, type StatFormat } from '@/components/count-up';
import { StatCard } from '@/components/stat-card';
import type { PartnerStats as PartnerStatsData } from '../../api/types';
import { PARTNER_STAT_CARDS } from '../../constants/partner-stats';

const STAT_FORMAT_BY_KEY: Record<keyof PartnerStatsData, StatFormat> = {
  paidTotal: STAT_FORMAT.CURRENCY,
  pendingTotal: STAT_FORMAT.CURRENCY,
  payoutCount: STAT_FORMAT.NUMBER
};

export function PartnerStats({ stats }: { stats: PartnerStatsData }) {
  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      {PARTNER_STAT_CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          icon={card.icon}
          value={stats[card.key]}
          format={STAT_FORMAT_BY_KEY[card.key]}
          noDeltaText={card.note}
        />
      ))}
    </div>
  );
}
