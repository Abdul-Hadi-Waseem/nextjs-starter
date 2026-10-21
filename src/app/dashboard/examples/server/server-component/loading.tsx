import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { ServerComponentSkeleton } from '@/features/examples/server-side/components/server-component-view';

export default function Loading() {
  return (
    <ExamplePageShell page='serverComponent'>
      <ServerComponentSkeleton />
    </ExamplePageShell>
  );
}
