import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { DependentSkeleton } from '@/features/examples/data-fetching/components/dependent-view';

export default function Loading() {
  return (
    <ExamplePageShell page='dependent'>
      <DependentSkeleton />
    </ExamplePageShell>
  );
}
