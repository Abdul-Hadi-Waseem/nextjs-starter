import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { productInfoContent } from '@/config/infoconfig';
import { cn } from '@/lib/utils';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function ProductsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Products'
      pageDescription='Manage products (React Query + nuqs table pattern.)'
      infoContent={productInfoContent}
      pageHeaderAction={
        <Link href='/dashboard/product/new' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' /> Add New
        </Link>
      }
    >
      {children}
    </PageContainer>
  );
}
