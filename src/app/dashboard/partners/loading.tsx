import { PartnersPageShell } from '@/features/partners/components/partners-page-shell';
import { PartnersTableSkeleton } from '@/features/partners/components/partners-table-skeleton';

export default function Loading() {
  return (
    <PartnersPageShell>
      <PartnersTableSkeleton />
    </PartnersPageShell>
  );
}
