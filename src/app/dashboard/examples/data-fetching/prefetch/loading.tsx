import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { PrefetchPartnersSkeleton } from '@/features/examples/data-fetching/components/prefetch-partners';

export default function Loading() {
  return (
    <ExamplePageShell page='prefetch'>
      <PrefetchPartnersSkeleton />
    </ExamplePageShell>
  );
}
