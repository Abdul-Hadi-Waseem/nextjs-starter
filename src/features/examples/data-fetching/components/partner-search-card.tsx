'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { cn } from '@/lib/utils';
import { ExampleCard } from '../../shared/components/example-card';
import { QueryError } from '../../shared/components/query-error';
import { PartnerSummary } from './partner-summary';
import { SummaryList } from './summary-list';
import { PARTNER_SEARCH_LIMIT } from '../../shared/constants/demo';

const COPY = {
  title: 'Cancel stale requests',
  description:
    'Each keystroke is a new key, and the request for the old one is aborted through signal.',
  source: 'src/features/examples/data-fetching/components/partner-search-card.tsx'
} as const;

export function PartnerSearchCard() {
  const inputId = useId();
  const [search, setSearch] = useState('');
  const term = search.trim();

  const { data, error, isPlaceholderData } = useQuery({
    ...partnersQueryOptions({ search: term, limit: PARTNER_SEARCH_LIMIT }),
    enabled: term.length > 0,
    placeholderData: keepPreviousData
  });

  return (
    <ExampleCard {...COPY}>
      <div className='grid gap-3'>
        <div className='grid gap-1.5'>
          <Label htmlFor={inputId}>Search partners</Label>
          <Input
            id={inputId}
            type='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Partner or contact name'
            autoComplete='off'
          />
        </div>
        {term.length === 0 ? (
          <p className='text-muted-foreground text-sm'>Type a name to search.</p>
        ) : error ? (
          <QueryError error={error} />
        ) : data && data.partners.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No partners match “{term}”.</p>
        ) : (
          <SummaryList
            className={cn(
              'transition-opacity duration-150',
              isPlaceholderData && 'opacity-60 delay-150'
            )}
          >
            {data?.partners.map((partner) => (
              <li key={partner.id}>
                <PartnerSummary partner={partner} />
              </li>
            ))}
          </SummaryList>
        )}
      </div>
    </ExampleCard>
  );
}
