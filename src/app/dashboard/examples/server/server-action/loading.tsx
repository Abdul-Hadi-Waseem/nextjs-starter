import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { ServerActionSkeleton } from '@/features/examples/server-side/components/server-action-view';

export default function Loading() {
  return (
    <ExamplePageShell page='serverAction'>
      <ServerActionSkeleton />
    </ExamplePageShell>
  );
}
