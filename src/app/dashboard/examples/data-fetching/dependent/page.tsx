import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { DependentView } from '@/features/examples/data-fetching/components/dependent-view';

export const metadata = { title: EXAMPLE_PAGES.dependent.title };

export default function Page() {
  return (
    <ExamplePageShell page='dependent'>
      <DependentView />
    </ExamplePageShell>
  );
}
