import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { RouteHandlerSkeleton } from '@/features/examples/server-side/components/route-handler-view';

export default function Loading() {
  return (
    <ExamplePageShell page='routeHandler'>
      <RouteHandlerSkeleton />
    </ExamplePageShell>
  );
}
