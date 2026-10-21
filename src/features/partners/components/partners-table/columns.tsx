'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Icons } from '@/components/icons';
import { TruncatedText } from '@/components/truncated-text';
import type { DataTableFeatures } from '@/lib/data-table/features';
import { formatCurrency, formatDate, SHORT_DATE_FORMAT } from '@/lib/format';
import type { Partner } from '../../api/types';
import { PARTNER_ROUTES } from '../../constants/partner-routes';
import { PARTNER_COLUMN } from '../../constants/partner-table';
import { formatCountry } from '../../lib/format-country';
import { PartnerStatusBadge } from '../partner-status-badge';
import { PartnerTierBadge } from '../partner-tier-badge';
import { CellAction } from './cell-action';
import { STATUS_FILTER_OPTIONS, TIER_FILTER_OPTIONS } from './options';

// Every column has an explicit `id`: useDataTable only allows sorting by ids it knows,
// and the ids are the URL keys and the backend's sort fields (see PARTNER_COLUMN).
export const columns: ColumnDef<DataTableFeatures, Partner>[] = [
  {
    id: PARTNER_COLUMN.NAME,
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Partner' />,
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className='flex max-w-64 min-w-0 flex-col'>
          {/* The real link to the partner page; the row highlights on hover and focus-within */}
          <Link
            href={PARTNER_ROUTES.detail(partner.id)}
            className='w-fit max-w-full truncate rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring'
          >
            {partner.name}
          </Link>
          <TruncatedText
            text={`${partner.contactName} · ${partner.email}`}
            className='text-xs text-muted-foreground'
          />
        </div>
      );
    },
    meta: {
      label: 'Partner',
      placeholder: 'Search name, contact or email',
      variant: 'text',
      icon: Icons.search
    },
    enableColumnFilter: true
  },
  {
    id: PARTNER_COLUMN.TIER,
    accessorKey: 'tier',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Tier' />,
    cell: ({ row }) => <PartnerTierBadge tier={row.original.tier} />,
    meta: {
      label: 'Tier',
      variant: 'multiSelect',
      options: TIER_FILTER_OPTIONS
    },
    enableColumnFilter: true
  },
  {
    id: PARTNER_COLUMN.STATUS,
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Status' />,
    cell: ({ row }) => <PartnerStatusBadge status={row.original.status} />,
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: STATUS_FILTER_OPTIONS
    },
    enableColumnFilter: true
  },
  {
    id: PARTNER_COLUMN.COUNTRY,
    accessorKey: 'country',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Country' />,
    cell: ({ row }) => (
      <span className='flex items-center gap-2'>
        <span className='w-6 font-mono text-xs text-muted-foreground'>{row.original.country}</span>
        {formatCountry(row.original.country)}
      </span>
    )
  },
  {
    id: PARTNER_COLUMN.REVENUE,
    accessorKey: 'revenue',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label='Lifetime revenue'
        className='-me-2 ms-auto w-fit'
      />
    ),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{formatCurrency(row.original.revenue)}</div>
    )
  },
  {
    id: PARTNER_COLUMN.PAID_OUT,
    accessorKey: 'payoutsTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Paid out' className='-me-2 ms-auto w-fit' />
    ),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{formatCurrency(row.original.payoutsTotal)}</div>
    )
  },
  {
    id: PARTNER_COLUMN.JOINED,
    accessorKey: 'joinedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Joined' />,
    cell: ({ row }) => (
      <time dateTime={row.original.joinedAt} className='tabular-nums'>
        {formatDate(row.original.joinedAt, SHORT_DATE_FORMAT)}
      </time>
    )
  },
  {
    id: PARTNER_COLUMN.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
