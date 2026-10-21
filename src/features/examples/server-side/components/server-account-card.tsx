import { Skeleton } from '@/components/ui/skeleton';
import { getAccountOrSignIn } from '../../shared/api/server';
import { AccountDetails, AccountDetailsSkeleton } from '../../shared/components/account-details';
import { ExampleCard } from '../../shared/components/example-card';
import { FetchedAt } from '../../shared/components/fetched-at';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { RUNS_ON } from '../../shared/constants/demo';
import { EXAMPLE_ROUTES } from '../../shared/constants/example-pages';

const COPY = {
  title: 'Your account, rendered on the server',
  description:
    'An async server component awaits api.get with the forwarded cookie and streams in behind Suspense.',
  source: 'src/features/examples/server-side/components/server-account-card.tsx'
} as const;

// No React Query here: choose this over prefetch + useSuspenseQuery when the data is
// read once per request and nothing in the browser refetches or caches it.
export async function ServerAccountCard() {
  const account = await getAccountOrSignIn(EXAMPLE_ROUTES.SERVER_COMPONENT);

  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={<FetchedAt iso={account.fetchedAt} label='Rendered' />}
    >
      <AccountDetails account={account} />
    </ExampleCard>
  );
}

export function ServerAccountCardSkeleton() {
  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={<Skeleton className='h-5 w-36' />}
    >
      <AccountDetailsSkeleton />
    </ExampleCard>
  );
}
