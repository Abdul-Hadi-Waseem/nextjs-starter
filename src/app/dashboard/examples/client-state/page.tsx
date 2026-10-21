import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { ClientStateView } from '@/features/examples/client-state/components/client-state-view';

export const metadata = { title: EXAMPLE_PAGES.clientState.title };

export default function Page() {
  return (
    <ExamplePageShell page='clientState'>
      <ClientStateView />
    </ExamplePageShell>
  );
}
