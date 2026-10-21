'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDate, SHORT_DATE_FORMAT } from '@/lib/format';
import { teamQueryOptions } from '../api/queries';
import { ROLE_BADGE_VARIANT, ROLE_LABEL } from '../constants/settings';
import { getInitials } from '@/lib/format';
import { TeamTableFrame, TeamTableHeader } from './team-table-frame';

export function TeamMembersTable() {
  const { data } = useSuspenseQuery(teamQueryOptions());
  const { members } = data;

  return (
    <TeamTableFrame count={members.length}>
      <Table>
        <TeamTableHeader />
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className='py-2.5'>
                <div className='flex min-w-0 items-center gap-3'>
                  <Avatar className='size-8'>
                    <AvatarFallback className='text-xs'>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className='grid min-w-0'>
                    <span className='truncate font-medium'>{member.name}</span>
                    <span className='text-muted-foreground truncate text-xs'>{member.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={ROLE_BADGE_VARIANT[member.role]}>{ROLE_LABEL[member.role]}</Badge>
              </TableCell>
              <TableCell className='text-muted-foreground hidden tabular-nums sm:table-cell'>
                <time dateTime={member.joinedAt}>
                  {formatDate(member.joinedAt, SHORT_DATE_FORMAT)}
                </time>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TeamTableFrame>
  );
}
