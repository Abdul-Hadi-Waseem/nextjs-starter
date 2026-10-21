import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** Card around the team table, shared by the table and its skeleton. */
export function TeamTableFrame({ count, children }: { count?: number; children: React.ReactNode }) {
  return (
    <div className='bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1'>
      <div className='flex h-12 items-center border-b px-4 text-sm'>
        <span className='font-medium'>Members</span>
        {count !== undefined && (
          <span className='text-muted-foreground ml-2 tabular-nums'>{count}</span>
        )}
      </div>
      <div className='px-2'>{children}</div>
    </div>
  );
}

export function TeamTableHeader() {
  return (
    <TableHeader>
      <TableRow className='hover:bg-transparent'>
        <TableHead>Member</TableHead>
        <TableHead className='w-28'>Role</TableHead>
        <TableHead className='hidden w-36 sm:table-cell'>Joined</TableHead>
      </TableRow>
    </TableHeader>
  );
}
