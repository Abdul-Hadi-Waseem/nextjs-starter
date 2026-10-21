import PageContainer from '@/components/layout/page-container';
import FormsShowcasePage from '@/features/examples/forms/components/forms-showcase-page';

export const metadata = {
  title: 'Multi-Step Form'
};

export default async function Page() {
  return (
    <PageContainer
      pageTitle='Multi-Step Form'
      pageDescription='Multi-step wizard with per-step validation.'
    >
      <FormsShowcasePage />
    </PageContainer>
  );
}
