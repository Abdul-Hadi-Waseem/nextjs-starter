import { Skeleton } from '@/components/ui/skeleton';
import type { ExchangeRates } from '../../shared/api/types';

const RATE_DIGITS = { minimumFractionDigits: 4, maximumFractionDigits: 4 } as const;
const SKELETON_ROWS = 4;

export function ExchangeRatesList({ data }: { data: ExchangeRates }) {
  return (
    <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
      {data.rates.map(({ currency, rate }) => (
        <div key={currency} className='contents'>
          <dt className='text-muted-foreground'>
            1 {data.base} in {currency}
          </dt>
          <dd className='text-end tabular-nums'>{rate.toLocaleString('en-US', RATE_DIGITS)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ExchangeRatesListSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
      {Array.from({ length: SKELETON_ROWS * 2 }, (_, i) => (
        <Skeleton key={i} className={i % 2 ? 'ms-auto h-lh w-16' : 'h-lh w-28'} />
      ))}
    </div>
  );
}
