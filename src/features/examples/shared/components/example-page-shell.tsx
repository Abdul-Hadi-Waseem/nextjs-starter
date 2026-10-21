import PageContainer from '@/components/layout/page-container';
import { EXAMPLE_PAGES, type ExamplePage } from '../constants/example-pages';

// Shared by each example's page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function ExamplePageShell({
  page,
  children
}: {
  page: ExamplePage;
  children: React.ReactNode;
}) {
  const { title, description } = EXAMPLE_PAGES[page];

  return (
    <PageContainer pageTitle={title} pageDescription={description}>
      {children}
    </PageContainer>
  );
}
