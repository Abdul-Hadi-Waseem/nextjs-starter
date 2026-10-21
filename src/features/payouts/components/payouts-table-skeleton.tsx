import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import {
  PAYOUT_TABLE_COLUMN_COUNT,
  PAYOUT_TABLE_DEFAULT_PAGE_SIZE,
  PAYOUT_TABLE_FILTER_COUNT
} from '../constants/payout-table';

export function PayoutsTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={PAYOUT_TABLE_COLUMN_COUNT}
      rowCount={PAYOUT_TABLE_DEFAULT_PAGE_SIZE}
      filterCount={PAYOUT_TABLE_FILTER_COUNT}
    />
  );
}
