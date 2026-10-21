import type { Metadata } from 'next';
import { SettingsPageShell } from '@/features/settings/components/settings-page-shell';
import { SettingsView } from '@/features/settings/components/settings-view';

export const metadata: Metadata = {
  title: 'Settings'
};

export default function SettingsPage() {
  return (
    <SettingsPageShell>
      <SettingsView />
    </SettingsPageShell>
  );
}
