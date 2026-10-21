import Link from 'next/link';

import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { PARTNER_ROUTES } from '../../constants/partner-routes';

// Shared by [id]/page.tsx and [id]/loading.tsx. The partner's name is data, so the
// header lives in PartnerDetail (and its skeleton); the back link never moves.
export function PartnerDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <Link
          href={PARTNER_ROUTES.list}
          className='-ms-1 flex w-fit items-center gap-1 rounded-sm px-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring'
        >
          <Icons.chevronLeft className='size-4' aria-hidden='true' />
          Partners
        </Link>
        {children}
      </div>
    </PageContainer>
  );
}
