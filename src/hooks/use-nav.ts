'use client';

import { useQuery } from '@tanstack/react-query';
import { meQueryOptions } from '@/features/auth/api/queries';
import { hasAccess } from '@/features/auth/lib/access';
import type { AuthUser } from '@/features/auth/api/types';
import { AUTH } from '@/lib/api';
import type { NavItem, NavGroup } from '@/types';

function useCurrentUser() {
  const { data } = useQuery({ ...meQueryOptions(), enabled: AUTH.enabled });
  return data?.user;
}

function filterItems(items: NavItem[], user: AuthUser | undefined): NavItem[] {
  return items
    .filter((item) => hasAccess(user, item.access))
    .map((item) => (item.items ? { ...item, items: filterItems(item.items, user) } : item));
}

export function useFilteredNavItems(items: NavItem[]) {
  const user = useCurrentUser();
  return AUTH.enabled ? filterItems(items, user) : items;
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  const user = useCurrentUser();
  if (!AUTH.enabled) return groups;
  return groups
    .map((group) => ({ ...group, items: filterItems(group.items, user) }))
    .filter((group) => group.items.length > 0);
}
