import type { PermissionCheck } from '@/types';
import type { AuthUser } from '../api/types';

/** True when `user` passes every condition in `check`. No check = public. */
export function hasAccess(user: AuthUser | undefined, check?: PermissionCheck) {
  if (!check) return true;
  if (!user) return false;

  if (check.role) {
    const roles = Array.isArray(check.role) ? check.role : [check.role];
    if (!roles.includes(user.role)) return false;
  }

  if (check.permission && !user.permissions.includes(check.permission)) return false;

  return true;
}
