import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { ServerComponentView } from '@/features/examples/server-side/components/server-component-view';

export const metadata = { title: EXAMPLE_PAGES.serverComponent.title };

export default function Page() {
  return (
    <ExamplePageShell page='serverComponent'>
      <ServerComponentView />
    </ExamplePageShell>
  );
}
