import { Skeleton } from '@/components/ui/skeleton';
import { getAccountOrSignIn } from '../../shared/api/server';
import { ExampleCard } from '../../shared/components/example-card';
import { Readout } from '../../shared/components/readout';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { RUNS_ON } from '../../shared/constants/demo';
import { EXAMPLE_ROUTES } from '../../shared/constants/example-pages';
import { DisplayNameForm } from './display-name-form';

const COPY = {
  title: 'Change your display name',
  description:
    'The form posts to a server action that checks the session, validates with zod and refreshes the page.',
  source: 'src/features/examples/server-side/components/display-name-card.tsx'
} as const;

export async function DisplayNameCard() {
  const account = await getAccountOrSignIn(EXAMPLE_ROUTES.SERVER_ACTION);

  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={<Readout label='Saved name' value={account.name} />}
    >
      <DisplayNameForm currentName={account.name} />
    </ExampleCard>
  );
}

export function DisplayNameCardSkeleton() {
  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={<Skeleton className='h-5 w-36' />}
    >
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Skeleton className='h-lh w-24' />
          <Skeleton className='h-8 w-full' />
        </div>
        <Skeleton className='h-8 w-24' />
      </div>
    </ExampleCard>
  );
}
