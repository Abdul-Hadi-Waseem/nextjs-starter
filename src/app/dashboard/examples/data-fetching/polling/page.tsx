import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { PollingView } from '@/features/examples/data-fetching/components/polling-view';

export const metadata = { title: EXAMPLE_PAGES.polling.title };

export default function Page() {
  return (
    <ExamplePageShell page='polling'>
      <PollingView />
    </ExamplePageShell>
  );
}
