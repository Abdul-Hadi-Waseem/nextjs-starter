import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { PollingSkeleton } from '@/features/examples/data-fetching/components/polling-view';

export default function Loading() {
  return (
    <ExamplePageShell page='polling'>
      <PollingSkeleton />
    </ExamplePageShell>
  );
}
