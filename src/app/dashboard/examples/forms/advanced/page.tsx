import PageContainer from '@/components/layout/page-container';
import AdvancedFormPatterns from '@/features/examples/forms/components/advanced-form-patterns';

export const metadata = {
  title: 'Advanced Form Patterns'
};

export default async function Page() {
  return (
    <PageContainer
      pageTitle='Advanced Form Patterns'
      pageDescription='Linked fields, async validation, dynamic rows, nested objects and form-level errors.'
    >
      <AdvancedFormPatterns />
    </PageContainer>
  );
}
