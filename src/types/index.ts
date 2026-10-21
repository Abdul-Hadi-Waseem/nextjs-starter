import { Icons } from '@/components/icons';

import type { Permission, Role } from '@/features/auth/constants/auth';

/** Who may see a nav item or page. All given conditions must pass. */
export interface PermissionCheck {
  role?: Role | Role[];
  permission?: Permission;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: PermissionCheck;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}
