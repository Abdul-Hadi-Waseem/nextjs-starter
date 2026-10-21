import PageContainer from '@/components/layout/page-container';
import DemoForm from '@/components/forms/demo-form';

export const metadata = {
  title: 'Basic Form'
};

export default async function Page() {
  return (
    <PageContainer pageTitle='Basic Form' pageDescription='Every field component in one form.'>
      <DemoForm />
    </PageContainer>
  );
}
