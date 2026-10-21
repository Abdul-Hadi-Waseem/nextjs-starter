'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { meQueryOptions } from '@/features/auth/api/queries';
import { hasAccess } from '@/features/auth/lib/access';
import { AUTH } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ExampleCard } from '../../shared/components/example-card';
import { Readout } from '../../shared/components/readout';
import { EXAMPLE_GRID } from '../../shared/constants/layout';
import { EXAMPLE_ROUTES } from '../../shared/constants/example-pages';
import { ACCESS_CHECKS, ADMIN_ACCESS } from '../constants/access-checks';

const CHECKS_COPY = {
  title: 'What you can do',
  description:
    'hasAccess checks the signed-in user; emails starting with "admin" sign in as admin.',
  source: 'src/features/examples/access/components/access-demo.tsx'
} as const;

const ADMIN_COPY = {
  title: 'Admin-only page',
  description: "Members don't see the link, and the page itself calls requireAccess.",
  source: 'src/features/examples/access/components/access-demo.tsx'
} as const;

function CheckResult({ allowed }: { allowed: boolean }) {
  const Icon = allowed ? Icons.circleCheck : Icons.lock;
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1.5 text-sm',
        allowed ? 'text-success' : 'text-muted-foreground'
      )}
    >
      <Icon className='size-4' aria-hidden />
      {allowed ? 'Allowed' : 'Not allowed'}
    </span>
  );
}

export function AccessDemo() {
  const { data } = useSuspenseQuery(meQueryOptions());
  // With auth off (demo mode) nothing is restricted, same as the sidebar.
  const allows = (check: (typeof ACCESS_CHECKS)[number]['check']) =>
    !AUTH.enabled || hasAccess(data.user, check);
  const isAdmin = allows(ADMIN_ACCESS);

  return (
    <div className={EXAMPLE_GRID}>
      <ExampleCard
        {...CHECKS_COPY}
        controls={<Readout label={`Signed in as ${data.user.role}`} value={data.user.email} />}
      >
        <ul className='divide-y'>
          {ACCESS_CHECKS.map(({ label, rule, check }) => (
            <li key={label} className='flex min-h-14 items-center justify-between gap-4'>
              <span className='grid gap-0.5'>
                <span className='text-sm font-medium'>{label}</span>
                <span className='text-muted-foreground font-mono text-xs'>{rule}</span>
              </span>
              <CheckResult allowed={allows(check)} />
            </li>
          ))}
        </ul>
      </ExampleCard>
      <ExampleCard {...ADMIN_COPY}>
        {isAdmin ? (
          <Link
            href={EXAMPLE_ROUTES.ACCESS_ADMIN}
            className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
          >
            <Icons.shield aria-hidden />
            Open the admin page
          </Link>
        ) : (
          <p className='text-muted-foreground text-sm text-pretty'>
            No link for members: opening{' '}
            <span className='text-foreground font-mono text-xs [overflow-wrap:anywhere]'>
              {EXAMPLE_ROUTES.ACCESS_ADMIN}
            </span>{' '}
            shows a 404.
          </p>
        )}
      </ExampleCard>
    </div>
  );
}

export function AccessDemoSkeleton() {
  return (
    <div className={EXAMPLE_GRID}>
      <ExampleCard {...CHECKS_COPY} controls={<Skeleton className='h-5 w-48' />}>
        <ul className='divide-y'>
          {ACCESS_CHECKS.map(({ label }) => (
            <li key={label} className='flex min-h-14 items-center justify-between gap-4'>
              <span className='grid gap-0.5'>
                <Skeleton className='h-lh w-28' />
                <Skeleton className='h-4 w-40' />
              </span>
              <Skeleton className='h-lh w-20' />
            </li>
          ))}
        </ul>
      </ExampleCard>
      <ExampleCard {...ADMIN_COPY}>
        <Skeleton className='h-8 w-48' />
      </ExampleCard>
    </div>
  );
}
