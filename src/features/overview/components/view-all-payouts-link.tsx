import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { PAYOUT_ROUTES } from '@/features/payouts/constants/payout-routes';

/** Recent payouts header action; shared by the section and its skeleton */
export function ViewAllPayoutsLink() {
  return (
    <Link href={PAYOUT_ROUTES.list} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
      View all payouts
    </Link>
  );
}
