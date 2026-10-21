import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { PublicVsAuthView } from '@/features/examples/data-fetching/components/public-vs-auth-view';

export const metadata = { title: EXAMPLE_PAGES.publicVsAuth.title };

export default function Page() {
  return (
    <ExamplePageShell page='publicVsAuth'>
      <PublicVsAuthView />
    </ExamplePageShell>
  );
}
