'use client';

import * as React from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import { Icons } from '@/components/icons';
import { useDataTable } from '@/hooks/use-data-table';
import { useDeferredFilters } from '@/hooks/use-deferred-filters';
import { cn } from '@/lib/utils';
import { partnerByIdOptions } from '@/features/partners/api/queries';
import { payoutsQueryOptions } from '../../api/queries';
import {
  PAYOUT_COLUMN,
  PAYOUT_TABLE_DEFAULT_PAGE_SIZE,
  PAYOUT_SEARCH_DEBOUNCE_MS
} from '../../constants/payout-table';
import { payoutTableParsers, toPayoutFilters } from '../../lib/search-params';
import { PayoutSheetProvider, usePayoutSheet } from '../payout-sheet';
import { columns } from './columns';
import { pageCount } from '@/lib/pagination';

export function PayoutTable() {
  return (
    <PayoutSheetProvider>
      <PayoutTableContent />
    </PayoutSheetProvider>
  );
}

function PayoutTableContent() {
  const [params, setParams] = useQueryStates(payoutTableParsers);

  // Current rows stay on screen (dimmed) while the next page/filter loads.
  const { filters, isStale: isUpdating } = useDeferredFilters(toPayoutFilters(params));

  const { data } = useSuspenseQuery(payoutsQueryOptions(filters));
  const { table } = useDataTable({
    data: data.payouts,
    columns,
    pageCount: pageCount(data.total_payouts, filters.limit ?? PAYOUT_TABLE_DEFAULT_PAGE_SIZE),
    shallow: true,
    debounceMs: PAYOUT_SEARCH_DEBOUNCE_MS,
    initialState: {
      columnPinning: { start: [], end: [PAYOUT_COLUMN.ACTIONS] }
    }
  });

  const hasFilters = Boolean(params.search || params.status || params.partner);

  function clearFilters() {
    table.resetColumnFilters(true);
    void setParams({ search: null, status: null, partner: null, page: null });
  }

  const toolbar = (
    <>
      {params.partner && (
        <PartnerFilterChip
          partnerId={params.partner}
          fallbackName={data.payouts[0]?.partnerName}
          onRemove={() => void setParams({ partner: null, page: null })}
        />
      )}
      <DataTableToolbar table={table} />
    </>
  );

  return (
    <div
      aria-busy={isUpdating || undefined}
      className={cn(
        'flex flex-1 flex-col transition-opacity duration-150',
        isUpdating && 'opacity-60 delay-150'
      )}
    >
      {data.total_payouts === 0 ? (
        <div className='flex flex-1 flex-col space-y-4'>
          {toolbar}
          <PayoutsEmptyState filtered={hasFilters} onClearFilters={clearFilters} />
        </div>
      ) : (
        <DataTable table={table} aria-label='Payouts'>
          {toolbar}
        </DataTable>
      )}
    </div>
  );
}

function PartnerFilterChip({
  partnerId,
  fallbackName,
  onRemove
}: {
  partnerId: string;
  fallbackName: string | undefined;
  onRemove: () => void;
}) {
  // Rows already carry the partner's name; only ask the API when there are none.
  const { data } = useQuery({ ...partnerByIdOptions(partnerId), enabled: !fallbackName });
  const name = fallbackName ?? data?.partner.name ?? 'Selected partner';

  return (
    <div className='flex p-1 pb-0'>
      <span className='inline-flex h-7 items-center gap-1 rounded-full border bg-muted/50 ps-3 pe-1 text-sm'>
        <span>
          Partner: <span className='font-medium'>{name}</span>
        </span>
        <Button
          variant='ghost'
          size='icon-xs'
          className='rounded-full motion-safe:active:scale-[0.98]'
          onClick={onRemove}
          aria-label={`Remove partner filter: ${name}`}
        >
          <Icons.close aria-hidden />
        </Button>
      </span>
    </div>
  );
}

function PayoutsEmptyState({
  filtered,
  onClearFilters
}: {
  filtered: boolean;
  onClearFilters: () => void;
}) {
  const { openNew } = usePayoutSheet();

  return (
    <Empty className='flex-1 rounded-lg border'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Icons.payouts aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{filtered ? 'No payouts match these filters' : 'No payouts yet'}</EmptyTitle>
        <EmptyDescription>
          {filtered
            ? 'Try a different search or status, or clear the filters to see every payout.'
            : 'Schedule your first payout to a partner. It shows up here until it’s paid.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center'>
        {filtered && (
          <Button variant='outline' onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
        <Button className='motion-safe:active:scale-[0.98]' onClick={openNew}>
          <Icons.add aria-hidden /> New payout
        </Button>
      </EmptyContent>
    </Empty>
  );
}
