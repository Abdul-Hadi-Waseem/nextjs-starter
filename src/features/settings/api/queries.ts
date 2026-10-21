import { queryOptions } from '@tanstack/react-query';
import { getTeam } from './service';
import type { TeamMember } from './types';

export type { TeamMember };

export const teamKeys = {
  all: ['team'] as const,
  list: () => [...teamKeys.all, 'list'] as const
};

export const teamQueryOptions = () =>
  queryOptions({
    queryKey: teamKeys.list(),
    queryFn: getTeam
  });
