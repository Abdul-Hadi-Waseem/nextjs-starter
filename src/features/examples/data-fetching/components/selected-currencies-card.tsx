'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { exchangeRatesQueryOptions } from '../../shared/api/queries';
import type { ExchangeRates } from '../../shared/api/types';
import { ExampleCard } from '../../shared/components/example-card';

const COPY = {
  title: 'Select',
  description:
    'select keeps only the currency codes, which never change, so this card skips every poll.',
  source: 'src/features/examples/data-fetching/components/selected-currencies-card.tsx'
} as const;

// Defined outside the component so it is a stable function; an inline one reruns every render.
function selectCurrencies(data: ExchangeRates) {
  return `${data.base}: ${data.rates.map((rate) => rate.currency).join(', ')}`;
}

export function SelectedCurrenciesCard() {
  const { data: currencies } = useSuspenseQuery({
    ...exchangeRatesQueryOptions(),
    select: selectCurrencies
  });

  return (
    <ExampleCard {...COPY}>
      <p className='text-sm'>
        <span className='text-muted-foreground'>Quoted against </span>
        {currencies}
      </p>
    </ExampleCard>
  );
}

export function SelectedCurrenciesCardSkeleton() {
  return (
    <ExampleCard {...COPY}>
      <Skeleton className='h-lh w-64' />
    </ExampleCard>
  );
}
