import { OverviewPageShell } from '@/features/overview/components/overview-page-shell';
import { OverviewSectionsSkeleton } from '@/features/overview/components/overview-sections';

export default function Loading() {
  return (
    <OverviewPageShell>
      <OverviewSectionsSkeleton />
    </OverviewPageShell>
  );
}
