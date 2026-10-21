'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { meQueryOptions } from '@/features/auth/api/queries';
import { ROLE } from '@/features/auth/constants/auth';
import { hasAccess } from '@/features/auth/lib/access';
import { AUTH } from '@/lib/api';
import { SETTINGS_ROUTES } from '../constants/settings';
import { SettingsSection } from './settings-section';

const TEAM_ACCESS = { role: ROLE.ADMIN } as const;

/**
 * Link to the team page, shown to admins only. Hiding it is UX; the page itself calls
 * `requireAccess` and `/api/team` returns 403 for members.
 */
export function TeamLinkCard() {
  const { data } = useSuspenseQuery(meQueryOptions());
  if (AUTH.enabled && !hasAccess(data.user, TEAM_ACCESS)) return null;

  return (
    <SettingsSection
      title='Team'
      description='Visible to admins only. Members see neither this section nor the Team page.'
    >
      <Link
        href={SETTINGS_ROUTES.TEAM}
        className='bg-card ring-foreground/10 hover:bg-muted/50 focus-visible:ring-ring/50 flex items-center gap-4 rounded-xl p-4 ring-1 transition-[background-color,scale] outline-none focus-visible:ring-3 motion-safe:active:scale-[0.98]'
      >
        <span className='bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-lg'>
          <Icons.teams className='size-4' aria-hidden='true' />
        </span>
        <span className='grid min-w-0 flex-1 gap-0.5'>
          <span className='text-sm font-medium'>Team members</span>
          <span className='text-muted-foreground text-sm'>
            See who has access and which role each person has.
          </span>
        </span>
        <Icons.chevronRight className='text-muted-foreground size-4 shrink-0' aria-hidden />
      </Link>
    </SettingsSection>
  );
}
