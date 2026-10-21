import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { ServerActionView } from '@/features/examples/server-side/components/server-action-view';

export const metadata = { title: EXAMPLE_PAGES.serverAction.title };

export default function Page() {
  return (
    <ExamplePageShell page='serverAction'>
      <ServerActionView />
    </ExamplePageShell>
  );
}
