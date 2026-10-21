import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { AccessView } from '@/features/examples/access/components/access-view';

export const metadata = { title: EXAMPLE_PAGES.access.title };

export default function Page() {
  return (
    <ExamplePageShell page='access'>
      <AccessView />
    </ExamplePageShell>
  );
}
