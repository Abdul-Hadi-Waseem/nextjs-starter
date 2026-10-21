import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { RouteHandlerView } from '@/features/examples/server-side/components/route-handler-view';

export const metadata = { title: EXAMPLE_PAGES.routeHandler.title };

export default function Page() {
  return (
    <ExamplePageShell page='routeHandler'>
      <RouteHandlerView />
    </ExamplePageShell>
  );
}
