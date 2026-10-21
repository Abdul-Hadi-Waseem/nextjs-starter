import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { OptimisticView } from '@/features/examples/data-fetching/components/optimistic-view';

export const metadata = { title: EXAMPLE_PAGES.optimistic.title };

export default function Page() {
  return (
    <ExamplePageShell page='optimistic'>
      <OptimisticView />
    </ExamplePageShell>
  );
}
