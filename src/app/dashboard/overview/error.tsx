'use client';

import { OverviewError } from '@/features/overview/components/overview-error';
import { OverviewPageShell } from '@/features/overview/components/overview-page-shell';

export default function OverviewErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <OverviewPageShell>
      <OverviewError error={error} reset={reset} />
    </OverviewPageShell>
  );
}
