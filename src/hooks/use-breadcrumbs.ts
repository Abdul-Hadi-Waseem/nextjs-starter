'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { navGroups } from '@/config/nav-config';
import type { NavItem } from '@/types';

type BreadcrumbItem = {
  title: string;
  link: string;
};

function collectTitles(items: NavItem[], titles: Map<string, string>) {
  for (const item of items) {
    if (item.url.startsWith('/')) titles.set(item.url, item.title);
    if (item.items) collectTitles(item.items, titles);
  }
  return titles;
}

// Labels come from the nav config (matched by URL), so a crumb reads like the sidebar.
const NAV_TITLES = collectTitles(
  navGroups.flatMap((group) => group.items),
  new Map<string, string>()
);

/**
 * `data-fetching` → `Data fetching`: sentence case, like the nav titles. Segments
 * with a digit are record ids (`prt_ab12cd34`) and are shown as they are.
 */
function slugToTitle(slug: string) {
  const decoded = decodeURIComponent(slug);
  if (/\d/.test(decoded)) return decoded;
  const words = decoded.replace(/[-_]+/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function useBreadcrumbs() {
  const pathname = usePathname();

  return useMemo<BreadcrumbItem[]>(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const link = `/${segments.slice(0, index + 1).join('/')}`;
      return { title: NAV_TITLES.get(link) ?? slugToTitle(segment), link };
    });
  }, [pathname]);
}
