'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { StatCard, StatCardSkeleton } from '@/components/stat-card';
import { overviewQueryOptions } from '../api/queries';
import { KPI_CARDS, KPI_COMPARISON_LABEL, KPI_NO_PREVIOUS_TEXT } from '../constants/overview';

const KPI_GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4';

/** Percent change from `previous` to `current`; undefined when there's nothing to compare */
function percentChange(current: number, previous: number) {
  if (previous === 0) return undefined;
  return ((current - previous) / previous) * 100;
}

export function KpiCards() {
  const { data } = useSuspenseQuery(overviewQueryOptions());
  const { kpis } = data;

  return (
    <div className={KPI_GRID}>
      {KPI_CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          icon={card.icon}
          value={kpis[card.key]}
          format={card.format}
          delta={percentChange(kpis[card.key], kpis.previous[card.key])}
          deltaLabel={KPI_COMPARISON_LABEL}
          noDeltaText={KPI_NO_PREVIOUS_TEXT}
          hint={card.hint?.(kpis)}
        />
      ))}
    </div>
  );
}

export function KpiCardsSkeleton() {
  return (
    <div className={KPI_GRID}>
      {KPI_CARDS.map((card) => (
        <StatCardSkeleton
          key={card.key}
          label={card.label}
          icon={card.icon}
          hasHint={Boolean(card.hint)}
        />
      ))}
    </div>
  );
}
