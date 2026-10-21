import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { productInfoContent } from '@/config/infoconfig';
import { cn } from '@/lib/utils';
import { PRODUCT_ROUTES } from '../constants/product-routes';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function ProductsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Products'
      pageDescription='TanStack Table with URL state, create and edit form.'
      infoContent={productInfoContent}
      pageHeaderAction={
        <Link href={PRODUCT_ROUTES.new} className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' /> Add New
        </Link>
      }
    >
      {children}
    </PageContainer>
  );
}
