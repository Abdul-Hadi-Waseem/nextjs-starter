import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { CachingView } from '@/features/examples/data-fetching/components/caching-view';

export const metadata = { title: EXAMPLE_PAGES.caching.title };

export default function Page() {
  return (
    <ExamplePageShell page='caching'>
      <CachingView />
    </ExamplePageShell>
  );
}
