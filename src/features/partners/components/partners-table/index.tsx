'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useDeferredFilters } from '@/hooks/use-deferred-filters';
import { cn } from '@/lib/utils';
import { partnersQueryOptions } from '../../api/queries';
import {
  PARTNER_COLUMN,
  PARTNER_SEARCH_DEBOUNCE_MS,
  PARTNER_TABLE_PAGE_SIZE
} from '../../constants/partner-table';
import { partnersSearchParams, toPartnerFilters } from '../../lib/search-params';
import { columns } from './columns';
import { pageCount } from '@/lib/pagination';

export function PartnersTable() {
  // Same parsers as the server cache, so the prefetched query key matches this one
  const [params] = useQueryStates(partnersSearchParams);

  // Current rows stay on screen (dimmed) while the next page/filter loads.
  const { filters, isStale } = useDeferredFilters(toPartnerFilters(params));

  const { data } = useSuspenseQuery(partnersQueryOptions(filters));

  const { table } = useDataTable({
    data: data.partners,
    columns,
    pageCount: pageCount(data.total_partners, filters.limit ?? PARTNER_TABLE_PAGE_SIZE),
    shallow: true,
    debounceMs: PARTNER_SEARCH_DEBOUNCE_MS,
    initialState: {
      pagination: { pageIndex: 0, pageSize: PARTNER_TABLE_PAGE_SIZE },
      columnPinning: { start: [], end: [PARTNER_COLUMN.ACTIONS] }
    }
  });

  return (
    <DataTable
      table={table}
      aria-label='Partners'
      // Rows have no click handler; the partner name is the link. Highlight the row
      // while that link (or the actions menu) has keyboard focus (focus-visible, not after mouse use), like on hover.
      className={cn(
        '[&_tbody]:transition-opacity [&_tbody_tr:has(:focus-visible)]:bg-muted/50',
        isStale && '[&_tbody]:opacity-60 [&_tbody]:delay-150'
      )}
      aria-busy={isStale}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
