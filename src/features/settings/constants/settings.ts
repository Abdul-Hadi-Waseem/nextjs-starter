import type { Icons } from '@/components/icons';
import { ROLE, type Role } from '@/features/auth/constants/auth';
import { TABLE_DENSITY, type TableDensity } from '@/stores/ui-preferences';

export const SETTINGS_ROUTES = {
  SETTINGS: '/dashboard/settings',
  TEAM: '/dashboard/settings/team'
} as const;

/** next-themes mode values (the `theme` it stores). */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

type IconName = keyof typeof Icons;

export type PreferenceOption<T extends string> = {
  value: T;
  label: string;
  icon: IconName;
};

export const THEME_MODE_OPTIONS: PreferenceOption<ThemeMode>[] = [
  { value: THEME_MODE.LIGHT, label: 'Light', icon: 'sun' },
  { value: THEME_MODE.DARK, label: 'Dark', icon: 'moon' },
  { value: THEME_MODE.SYSTEM, label: 'System', icon: 'laptop' }
];

export const TABLE_DENSITY_OPTIONS: PreferenceOption<TableDensity>[] = [
  { value: TABLE_DENSITY.COMFORTABLE, label: 'Comfortable', icon: 'rowsComfortable' },
  { value: TABLE_DENSITY.COMPACT, label: 'Compact', icon: 'rowsCompact' }
];

export const ROLE_LABEL: Record<Role, string> = {
  [ROLE.ADMIN]: 'Admin',
  [ROLE.MEMBER]: 'Member'
};

export const ROLE_BADGE_VARIANT = {
  [ROLE.ADMIN]: 'secondary',
  [ROLE.MEMBER]: 'outline'
} as const satisfies Record<Role, 'secondary' | 'outline'>;

/** The mock team has six people; the skeleton matches so the table doesn't grow on load. */
export const TEAM_SKELETON_ROWS = 6;

export const INVITE_DISABLED_HINT = 'Connect your backend to invite members';
