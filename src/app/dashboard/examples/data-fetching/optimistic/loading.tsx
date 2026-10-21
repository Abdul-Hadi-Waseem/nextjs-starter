import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { OptimisticSkeleton } from '@/features/examples/data-fetching/components/optimistic-view';

export default function Loading() {
  return (
    <ExamplePageShell page='optimistic'>
      <OptimisticSkeleton />
    </ExamplePageShell>
  );
}
