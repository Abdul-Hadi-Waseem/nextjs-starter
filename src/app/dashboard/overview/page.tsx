import { OverviewHydration } from '@/features/overview/components/overview-hydration';
import { OverviewPageShell } from '@/features/overview/components/overview-page-shell';
import { OverviewSections } from '@/features/overview/components/overview-sections';

export const metadata = {
  title: 'Overview'
};

export default function Page() {
  return (
    <OverviewPageShell>
      <OverviewHydration>
        <OverviewSections />
      </OverviewHydration>
    </OverviewPageShell>
  );
}
