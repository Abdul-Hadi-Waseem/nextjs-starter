import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty';
import { PartnerDetailShell } from '@/features/partners/components/partner-detail/partner-detail-shell';
import { PARTNER_ROUTES } from '@/features/partners/constants/partner-routes';

export default function PartnerNotFound() {
  return (
    <PartnerDetailShell>
      <Empty className='flex-1'>
        <EmptyHeader>
          <EmptyTitle>Partner not found</EmptyTitle>
          <EmptyDescription>
            This partner doesn&apos;t exist or was removed. Find them in the partners list.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href={PARTNER_ROUTES.list} className={buttonVariants({ variant: 'outline' })}>
            Back to partners
          </Link>
        </EmptyContent>
      </Empty>
    </PartnerDetailShell>
  );
}
