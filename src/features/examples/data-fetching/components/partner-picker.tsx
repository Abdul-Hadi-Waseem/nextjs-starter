'use client';

import type { Partner } from '@/features/partners/api/types';
import { cn } from '@/lib/utils';
import { PartnerSummary, PartnerSummarySkeleton } from './partner-summary';
import { SummaryList } from './summary-list';

/** A list of partners to pick one from. `onIntent` fires on hover and focus, before the click. */
export function PartnerPicker({
  partners,
  selectedId,
  onSelect,
  onIntent
}: {
  partners: Partner[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onIntent?: (id: string) => void;
}) {
  return (
    <SummaryList>
      {partners.map((partner) => (
        <li key={partner.id}>
          <button
            type='button'
            aria-pressed={partner.id === selectedId}
            onClick={() => onSelect(partner.id)}
            onPointerEnter={onIntent && (() => onIntent(partner.id))}
            onFocus={onIntent && (() => onIntent(partner.id))}
            className={cn(
              'hover:bg-muted/50 focus-visible:ring-ring/50 -mx-2 flex min-h-14 w-[calc(100%+1rem)] items-center rounded-md px-2 text-start outline-none focus-visible:ring-3 motion-safe:active:scale-[0.98] motion-safe:transition-transform',
              partner.id === selectedId && 'bg-muted'
            )}
          >
            <PartnerSummary partner={partner} />
          </button>
        </li>
      ))}
    </SummaryList>
  );
}

export function PartnerPickerSkeleton({ rows }: { rows: number }) {
  return (
    <SummaryList>
      {Array.from({ length: rows }, (_, index) => (
        <li key={index}>
          <PartnerSummarySkeleton />
        </li>
      ))}
    </SummaryList>
  );
}
