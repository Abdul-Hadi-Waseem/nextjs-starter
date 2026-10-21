import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { InfiniteView } from '@/features/examples/data-fetching/components/infinite-view';

export const metadata = { title: EXAMPLE_PAGES.infinite.title };

export default function Page() {
  return (
    <ExamplePageShell page='infinite'>
      <InfiniteView />
    </ExamplePageShell>
  );
}
