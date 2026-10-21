import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TEAM_SKELETON_ROWS } from '../constants/settings';
import { TeamTableFrame, TeamTableHeader } from './team-table-frame';

export function TeamMembersSkeleton() {
  return (
    <TeamTableFrame>
      <Table aria-hidden>
        <TeamTableHeader />
        <TableBody>
          {Array.from({ length: TEAM_SKELETON_ROWS }, (_, i) => (
            <TableRow key={i} className='hover:bg-transparent'>
              <TableCell className='py-2.5'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='size-8 rounded-full' />
                  {/* Line boxes match the name (text-sm) and email (text-xs) lines. */}
                  <div className='grid'>
                    <span className='flex h-lh items-center text-sm'>
                      <Skeleton className='h-3 w-32' />
                    </span>
                    <span className='flex h-lh items-center text-xs'>
                      <Skeleton className='h-2.5 w-44' />
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 w-16 rounded-full' />
              </TableCell>
              <TableCell className='hidden sm:table-cell'>
                <span className='flex h-lh items-center text-sm'>
                  <Skeleton className='h-3 w-24' />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TeamTableFrame>
  );
}
