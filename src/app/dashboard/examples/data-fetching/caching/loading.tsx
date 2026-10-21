import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { CachingSkeleton } from '@/features/examples/data-fetching/components/caching-view';

export default function Loading() {
  return (
    <ExamplePageShell page='caching'>
      <CachingSkeleton />
    </ExamplePageShell>
  );
}
