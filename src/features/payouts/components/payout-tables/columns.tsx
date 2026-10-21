'use client';

import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { PARTNER_ROUTES } from '@/features/partners/constants/partner-routes';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Icons } from '@/components/icons';
import type { DataTableFeatures } from '@/lib/data-table/features';
import { formatCurrency, formatDate, SHORT_DATE_FORMAT } from '@/lib/format';
import type { Payout } from '../../api/types';
import { PAYOUT_METHOD_LABEL } from '../../constants/payout-options';
import { PAYOUT_COLUMN } from '../../constants/payout-table';
import { PayoutStatusBadge } from '../payout-status-badge';
import { CellAction } from './cell-action';
import { STATUS_FILTER_OPTIONS } from './options';

// Dates render in UTC: `scheduledFor` is a calendar day, and a fixed zone keeps the
// server-rendered table identical to the hydrated one.

export const columns: ColumnDef<DataTableFeatures, Payout>[] = [
  {
    // Id doubles as the `?search=` URL key; the API searches partner, payout id and note.
    id: PAYOUT_COLUMN.SEARCH,
    accessorKey: 'id',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} label='Payout' />,
    cell: ({ row }) => <span className='text-xs text-muted-foreground'>{row.original.id}</span>,
    meta: {
      label: 'Payout',
      placeholder: 'Search partner, payout or note…',
      variant: 'text',
      icon: Icons.search
    },
    enableColumnFilter: true
  },
  {
    id: PAYOUT_COLUMN.PARTNER,
    accessorKey: 'partnerName',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Partner' />,
    cell: ({ row }) => (
      <Link
        href={PARTNER_ROUTES.detail(row.original.partnerId)}
        className='rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50'
      >
        {row.original.partnerName}
      </Link>
    ),
    meta: { label: 'Partner' }
  },
  {
    id: PAYOUT_COLUMN.AMOUNT,
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Amount' className='ms-auto -me-2 w-fit' />
    ),
    cell: ({ row }) => (
      <div className='text-right font-medium tabular-nums'>
        {formatCurrency(row.original.amount, row.original.currency)}
      </div>
    ),
    meta: { label: 'Amount' }
  },
  {
    id: PAYOUT_COLUMN.STATUS,
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Status' />,
    cell: ({ row }) => <PayoutStatusBadge status={row.original.status} />,
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: STATUS_FILTER_OPTIONS
    }
  },
  {
    id: PAYOUT_COLUMN.METHOD,
    accessorKey: 'method',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Method' />,
    cell: ({ row }) => PAYOUT_METHOD_LABEL[row.original.method],
    meta: { label: 'Method' }
  },
  {
    id: PAYOUT_COLUMN.SCHEDULED_FOR,
    accessorKey: 'scheduledFor',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Scheduled for' />,
    cell: ({ row }) => (
      <span className='tabular-nums'>
        {formatDate(row.original.scheduledFor, SHORT_DATE_FORMAT)}
      </span>
    ),
    meta: { label: 'Scheduled for' }
  },
  {
    id: PAYOUT_COLUMN.PAID_AT,
    accessorKey: 'paidAt',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Paid on' />,
    cell: ({ row }) =>
      row.original.paidAt ? (
        <span className='tabular-nums'>{formatDate(row.original.paidAt, SHORT_DATE_FORMAT)}</span>
      ) : (
        <span className='text-muted-foreground'>
          <span aria-hidden>—</span>
          <span className='sr-only'>Not paid</span>
        </span>
      ),
    meta: { label: 'Paid on' }
  },
  {
    id: PAYOUT_COLUMN.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => <CellAction payout={row.original} />
  }
];
