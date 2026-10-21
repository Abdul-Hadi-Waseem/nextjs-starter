import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { PrefetchView } from '@/features/examples/data-fetching/components/prefetch-view';

export const metadata = { title: EXAMPLE_PAGES.prefetch.title };

export default function Page() {
  return (
    <ExamplePageShell page='prefetch'>
      <PrefetchView />
    </ExamplePageShell>
  );
}
