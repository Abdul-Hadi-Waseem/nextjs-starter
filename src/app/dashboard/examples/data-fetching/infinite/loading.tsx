import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { InfiniteSkeleton } from '@/features/examples/data-fetching/components/infinite-view';

export default function Loading() {
  return (
    <ExamplePageShell page='infinite'>
      <InfiniteSkeleton />
    </ExamplePageShell>
  );
}
