import { SettingsSection } from './settings-section';

/** The settings layout, shared by the page and its loading state so nothing moves. */
export function SettingsSections({
  profile,
  preferences,
  team
}: {
  profile: React.ReactNode;
  preferences: React.ReactNode;
  team?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col'>
      <SettingsSection
        title='Profile'
        description='Your name as the team sees it. Saved to your account.'
      >
        {profile}
      </SettingsSection>
      <SettingsSection
        title='Preferences'
        description='How the dashboard looks and how dense tables are. Saved in this browser only and applied as soon as you choose.'
      >
        {preferences}
      </SettingsSection>
      {team}
    </div>
  );
}
