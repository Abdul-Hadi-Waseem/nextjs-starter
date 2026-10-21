'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { ExampleCard } from '../../shared/components/example-card';
import { PartnerPicker, PartnerPickerSkeleton } from './partner-picker';
import { PARTNER_PICKER_FILTERS, PARTNER_PICKER_SIZE } from '../../shared/constants/demo';
import { PartnerPayouts } from './partner-payouts';

const COPY = {
  title: 'Dependent: partner, then payouts',
  description:
    'The payouts query is enabled only once a partner is picked, so it never fetches with none.',
  source: 'src/features/examples/data-fetching/components/dependent-queries.tsx'
} as const;

export function DependentQueries() {
  const { data } = useSuspenseQuery(partnersQueryOptions(PARTNER_PICKER_FILTERS));
  const [partnerId, setPartnerId] = useState<string | null>(null);

  return (
    <ExampleCard {...COPY}>
      <div className='grid gap-6 xl:grid-cols-2'>
        <PartnerPicker partners={data.partners} selectedId={partnerId} onSelect={setPartnerId} />
        <PartnerPayouts partnerId={partnerId} />
      </div>
    </ExampleCard>
  );
}

export function DependentQueriesSkeleton() {
  return (
    <ExampleCard {...COPY}>
      <div className='grid gap-6 xl:grid-cols-2'>
        <PartnerPickerSkeleton rows={PARTNER_PICKER_SIZE} />
      </div>
    </ExampleCard>
  );
}
