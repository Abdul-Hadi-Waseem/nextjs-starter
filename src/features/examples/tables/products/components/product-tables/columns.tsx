'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Product } from '../../api/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/lib/data-table/features';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';
import { formatCurrency } from '@/lib/format';
import { TruncatedText } from '@/components/truncated-text';

export const columns: ColumnDef<DataTableFeatures, Product>[] = [
  {
    accessorKey: 'photo_url',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} label='Image' />,
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square'>
          <Image
            src={row.getValue('photo_url')}
            alt={row.getValue('name')}
            fill
            sizes='80px'
            className='rounded-lg object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Name' />,
    cell: ({ cell }) => <div>{cell.getValue<Product['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search products...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorKey: 'category',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} label='Category' />,
    cell: ({ cell }) => (
      <Badge variant='outline' className='capitalize'>
        {cell.getValue<Product['category']>()}
      </Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'categories',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    accessorKey: 'price',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Price' className='justify-end' />
    ),
    cell: ({ cell }) => (
      <div className='text-right tabular-nums'>
        {formatCurrency(cell.getValue<Product['price']>())}
      </div>
    )
  },
  {
    accessorKey: 'description',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} label='Description' />,
    // One line with an ellipsis; the full text is in the tooltip.
    cell: ({ cell }) => <TruncatedText text={cell.getValue<Product['description']>()} />
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
