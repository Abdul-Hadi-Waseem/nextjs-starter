import type { ReactNode } from 'react';

// Column spans in the 7-column lg grid; md is two equal columns, mobile one.
const WIDE = 'min-w-0 lg:col-span-4';
const NARROW = 'min-w-0 lg:col-span-3';

interface OverviewGridProps {
  kpis: ReactNode;
  trend: ReactNode;
  status: ReactNode;
  growth: ReactNode;
  methods: ReactNode;
  average: ReactNode;
  top: ReactNode;
  recent: ReactNode;
}

// The page and its loading state place their sections with this one layout, so
// skeletons and content sit in exactly the same cells.
export function OverviewGrid({
  kpis,
  trend,
  status,
  growth,
  methods,
  average,
  top,
  recent
}: OverviewGridProps) {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      {kpis}
      {/* Wide and narrow cards alternate row by row, so the page isn't a column of equal tiles */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className={WIDE}>{trend}</div>
        <div className={NARROW}>{status}</div>
        <div className={WIDE}>{growth}</div>
        <div className={NARROW}>{methods}</div>
        <div className={NARROW}>{average}</div>
        <div className={WIDE}>{top}</div>
      </div>
      {recent}
    </div>
  );
}
