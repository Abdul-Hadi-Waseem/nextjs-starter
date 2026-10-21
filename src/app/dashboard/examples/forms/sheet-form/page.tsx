import PageContainer from '@/components/layout/page-container';
import SheetFormDemo from '@/features/examples/forms/components/sheet-form-demo';

export const metadata = {
  title: 'Sheet Form'
};

export default async function Page() {
  return (
    <PageContainer
      pageTitle='Sheet & Dialog Forms'
      pageDescription='Forms in sheets and dialogs with external submit buttons.'
    >
      <SheetFormDemo />
    </PageContainer>
  );
}
