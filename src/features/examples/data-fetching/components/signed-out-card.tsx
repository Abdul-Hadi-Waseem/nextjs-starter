import { Skeleton } from '@/components/ui/skeleton';
import { isApiError } from '@/lib/api';
import { getAccountWithoutCookie, getExchangeRates } from '../../shared/api/service';
import { ExampleCard } from '../../shared/components/example-card';
import { Readout } from '../../shared/components/readout';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { RUNS_ON } from '../../shared/constants/demo';

const COPY = {
  title: 'Signed out',
  description:
    'Both calls again from the server with no cookie; in the app a 401 sends you to sign-in.',
  source: 'src/features/examples/data-fetching/components/signed-out-card.tsx'
} as const;

const CALLS = [
  { label: 'Exchange rates (public)', call: getExchangeRates },
  { label: 'Your account (signed in)', call: getAccountWithoutCookie }
] as const;

async function outcome(call: () => Promise<unknown>) {
  try {
    await call();
    return { ok: true, text: '200 OK' };
  } catch (error) {
    if (isApiError(error)) return { ok: false, text: `${error.status} ${error.message}` };
    throw error;
  }
}

export async function SignedOutCard() {
  const results = await Promise.all(CALLS.map(({ call }) => outcome(call)));

  return (
    <ExampleCard {...COPY} action={<RunsOnBadge where={RUNS_ON.SERVER} />}>
      <ul className='grid gap-1 text-sm'>
        {CALLS.map(({ label }, index) => {
          const { ok, text } = results[index];
          return (
            <li key={label} className='flex min-h-8 items-center justify-between gap-4'>
              <span className='text-muted-foreground'>{label}</span>
              <Readout label='Status' value={text} tone={ok ? 'positive' : 'negative'} />
            </li>
          );
        })}
      </ul>
    </ExampleCard>
  );
}

export function SignedOutCardSkeleton() {
  return (
    <ExampleCard {...COPY} action={<RunsOnBadge where={RUNS_ON.SERVER} />}>
      <div className='grid gap-1'>
        {CALLS.map(({ label }) => (
          <div key={label} className='flex min-h-8 items-center justify-between gap-4 text-sm'>
            <span className='text-muted-foreground'>{label}</span>
            <Skeleton className='h-5 w-28' />
          </div>
        ))}
      </div>
    </ExampleCard>
  );
}
