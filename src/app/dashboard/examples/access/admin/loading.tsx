import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { AdminOnlyCardSkeleton } from '@/features/examples/access/components/admin-only-card';

export default function Loading() {
  return (
    <ExamplePageShell page='accessAdmin'>
      <AdminOnlyCardSkeleton />
    </ExamplePageShell>
  );
}
