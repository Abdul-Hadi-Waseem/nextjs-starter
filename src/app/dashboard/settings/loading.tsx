import { PreferencesPanel } from '@/features/settings/components/preferences-panel';
import { ProfileFormSkeleton } from '@/features/settings/components/profile-form-skeleton';
import { SettingsPageShell } from '@/features/settings/components/settings-page-shell';
import { SettingsSections } from '@/features/settings/components/settings-sections';

export default function Loading() {
  return (
    <SettingsPageShell>
      {/* Preferences need no server data, so the real controls render straight away. */}
      <SettingsSections profile={<ProfileFormSkeleton />} preferences={<PreferencesPanel />} />
    </SettingsPageShell>
  );
}
