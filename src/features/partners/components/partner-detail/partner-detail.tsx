'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { formatDate, SHORT_DATE_FORMAT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { partnerByIdOptions } from '../../api/queries';
import { PARTNER_ROUTES } from '../../constants/partner-routes';
import { formatCountry } from '../../lib/format-country';
import { PartnerStatusBadge } from '../partner-status-badge';
import { PartnerTierBadge } from '../partner-tier-badge';
import { CopyEmailButton } from './copy-email-button';
import { PartnerStats } from './partner-stats';
import { RecentPayouts } from './recent-payouts';

export function PartnerDetail({ id }: { id: string }) {
  const { data } = useSuspenseQuery(partnerByIdOptions(id));
  const { partner, stats, recentPayouts } = data;

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
            <h2 className='min-w-0 truncate text-3xl font-bold tracking-tight'>{partner.name}</h2>
            <div className='flex items-center gap-2'>
              <PartnerStatusBadge status={partner.status} />
              <PartnerTierBadge tier={partner.tier} />
            </div>
          </div>
          <dl className='flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground [&>div]:min-h-6'>
            <div className='flex items-center gap-1.5'>
              <dt>
                <Icons.user className='size-4' aria-hidden='true' />
                <span className='sr-only'>Contact</span>
              </dt>
              <dd className='text-foreground'>{partner.contactName}</dd>
            </div>
            <div className='flex min-w-0 items-center gap-1.5'>
              <dt>
                <Icons.mail className='size-4' aria-hidden='true' />
                <span className='sr-only'>Email</span>
              </dt>
              <dd className='flex min-w-0 items-center gap-0.5'>
                <a
                  href={`mailto:${partner.email}`}
                  className='truncate rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring'
                >
                  {partner.email}
                </a>
                <CopyEmailButton email={partner.email} />
              </dd>
            </div>
            <div className='flex items-center gap-1.5'>
              <dt>
                <Icons.world className='size-4' aria-hidden='true' />
                <span className='sr-only'>Country</span>
              </dt>
              <dd>
                {formatCountry(partner.country)} ({partner.country})
              </dd>
            </div>
            <div className='flex items-center gap-1.5'>
              <dt>
                <Icons.calendar className='size-4' aria-hidden='true' />
                <span className='sr-only'>Joined</span>
              </dt>
              <dd>
                Joined{' '}
                <time dateTime={partner.joinedAt}>
                  {formatDate(partner.joinedAt, SHORT_DATE_FORMAT)}
                </time>
              </dd>
            </div>
          </dl>
        </div>
        <Link
          href={PARTNER_ROUTES.newPayout(partner.id)}
          className={cn(buttonVariants(), 'shrink-0 motion-safe:active:scale-[0.98]')}
        >
          <Icons.add aria-hidden='true' /> New payout
        </Link>
      </div>

      <PartnerStats stats={stats} />

      <RecentPayouts partnerId={partner.id} payouts={recentPayouts} />
    </div>
  );
}
