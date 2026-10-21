'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

interface NavCollapsibleProps {
  item: NavItem & { items: NavItem[] };
  pathname: string;
  onNavigate: () => void;
}

// A nav item with sub items. Controlled: it opens when one of its routes becomes
// active (including on client navigation), and the user can still toggle it.
export function NavCollapsible({ item, pathname, onNavigate }: NavCollapsibleProps) {
  const isActive = item.items.some((subItem) => pathname.startsWith(subItem.url));
  const [open, setOpen] = useState(isActive);
  const [wasActive, setWasActive] = useState(isActive);

  // Adjust state during render when the route changes (no effect, no extra paint).
  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (isActive) setOpen(true);
  }

  const Icon = item.icon ? Icons[item.icon] : Icons.logo;

  return (
    <Collapsible open={open} onOpenChange={setOpen} render={<SidebarMenuItem />}>
      <CollapsibleTrigger
        render={<SidebarMenuButton tooltip={item.title} className='group/collapsible' />}
      >
        <Icon />
        <span>{item.title}</span>
        <Icons.chevronRight className='ml-auto motion-safe:transition-transform motion-safe:duration-200 group-data-panel-open/collapsible:rotate-90' />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                render={<Link href={subItem.url} aria-label={subItem.title} onClick={onNavigate} />}
                isActive={pathname === subItem.url}
              >
                <span>{subItem.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
