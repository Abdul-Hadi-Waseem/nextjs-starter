import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { PAYOUT_METHOD_LABEL, PAYOUT_STATUS } from '@/features/payouts/constants/payout-options';
import type { Payout } from '@/features/payouts/api/types';
import { formatCurrency, formatDate, SHORT_DATE_FORMAT } from '@/lib/format';
import { PARTNER_ROUTES } from '../../constants/partner-routes';
import { PARTNER_RECENT_PAYOUTS_LIMIT } from '../../constants/partner-table';
import { PayoutStatusBadge } from '@/features/payouts/components/payout-status-badge';

function payoutDateLabel(payout: Payout) {
  if (payout.status === PAYOUT_STATUS.PAID && payout.paidAt) {
    return `Paid ${formatDate(payout.paidAt, SHORT_DATE_FORMAT)}`;
  }
  return `Scheduled for ${formatDate(payout.scheduledFor, SHORT_DATE_FORMAT)}`;
}

export function RecentPayouts({ partnerId, payouts }: { partnerId: string; payouts: Payout[] }) {
  const latest = payouts.slice(0, PARTNER_RECENT_PAYOUTS_LIMIT);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent payouts</CardTitle>
        {latest.length > 0 && (
          <CardAction>
            <Link
              href={PARTNER_ROUTES.payouts(partnerId)}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              View all
            </Link>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {latest.length === 0 ? (
          <Empty className='py-8'>
            <EmptyHeader>
              <EmptyTitle>No payouts yet</EmptyTitle>
              <EmptyDescription>
                Use New payout above to schedule this partner&apos;s first one.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className='divide-y'>
            {latest.map((payout) => (
              <li
                key={payout.id}
                className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'
              >
                <div className='min-w-0'>
                  <p className='font-medium tabular-nums'>
                    {formatCurrency(payout.amount, payout.currency)}
                  </p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {PAYOUT_METHOD_LABEL[payout.method]} · {payoutDateLabel(payout)}
                  </p>
                </div>
                <PayoutStatusBadge status={payout.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
