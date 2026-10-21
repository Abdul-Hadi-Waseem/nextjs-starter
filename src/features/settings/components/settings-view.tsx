import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { meQueryOptions } from '@/features/auth/api/queries';
import { getQueryClient } from '@/lib/query-client';
import { PreferencesPanel } from './preferences-panel';
import { ProfileForm } from './profile-form';
import { ProfileFormSkeleton } from './profile-form-skeleton';
import { SettingsSections } from './settings-sections';
import { TeamLinkCard } from './team-link-card';

/** Server part of /dashboard/settings: prefetches `/auth/me` and hydrates the client form. */
export function SettingsView() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(meQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsSections
        profile={
          <Suspense fallback={<ProfileFormSkeleton />}>
            <ProfileForm />
          </Suspense>
        }
        preferences={<PreferencesPanel />}
        team={
          // Last on the page, so members (who don't get it) see nothing move.
          <Suspense fallback={null}>
            <TeamLinkCard />
          </Suspense>
        }
      />
    </HydrationBoundary>
  );
}
