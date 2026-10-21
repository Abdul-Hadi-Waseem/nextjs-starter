import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import {
  PARTNER_TABLE_COLUMN_COUNT,
  PARTNER_TABLE_FILTER_COUNT,
  PARTNER_TABLE_PAGE_SIZE
} from '../constants/partner-table';

// Rows are two lines tall (name + contact), so body placeholders are h-9 instead of
// the default h-6 to match the real row height.
export function PartnersTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={PARTNER_TABLE_COLUMN_COUNT}
      rowCount={PARTNER_TABLE_PAGE_SIZE}
      filterCount={PARTNER_TABLE_FILTER_COUNT}
      className='[&_tbody_[data-slot=skeleton]]:h-9'
    />
  );
}
