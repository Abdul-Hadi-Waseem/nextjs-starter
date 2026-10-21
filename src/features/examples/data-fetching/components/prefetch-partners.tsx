'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { partnerByIdOptions, partnersQueryOptions } from '@/features/partners/api/queries';
import { ExampleCard } from '../../shared/components/example-card';
import { PartnerPicker, PartnerPickerSkeleton } from './partner-picker';
import { PARTNER_PICKER_FILTERS, PARTNER_PICKER_SIZE } from '../../shared/constants/demo';
import { PrefetchPartnerDetail } from './prefetch-partner-detail';

const COPY = {
  title: 'Detail on demand',
  description:
    'Hovering or focusing a partner prefetches its detail, so the click usually needs no request.',
  source: 'src/features/examples/data-fetching/components/prefetch-partners.tsx'
} as const;

export function PrefetchPartners() {
  const { data } = useSuspenseQuery(partnersQueryOptions(PARTNER_PICKER_FILTERS));
  const queryClient = useQueryClient();
  const [partnerId, setPartnerId] = useState<string | null>(null);

  // Same queryOptions as the detail query, so the prefetched entry is the one it reads.
  function prefetch(id: string) {
    void queryClient.prefetchQuery(partnerByIdOptions(id));
  }

  return (
    <ExampleCard {...COPY}>
      <div className='grid gap-6 xl:grid-cols-2'>
        <PartnerPicker
          partners={data.partners}
          selectedId={partnerId}
          onSelect={setPartnerId}
          onIntent={prefetch}
        />
        <PrefetchPartnerDetail partnerId={partnerId} />
      </div>
    </ExampleCard>
  );
}

export function PrefetchPartnersSkeleton() {
  return (
    <ExampleCard {...COPY}>
      <div className='grid gap-6 xl:grid-cols-2'>
        <PartnerPickerSkeleton rows={PARTNER_PICKER_SIZE} />
      </div>
    </ExampleCard>
  );
}
