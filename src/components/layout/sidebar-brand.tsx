import Link from 'next/link';
import { Icons } from '@/components/icons';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SITE } from '@/config/site';
import { AUTH } from '@/lib/api';

// App mark + name. Collapses to the mark when the sidebar is in icon mode.
export function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          tooltip={SITE.name}
          render={<Link href={AUTH.homePath} aria-label={SITE.name} onClick={onNavigate} />}
        >
          <span className='bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-lg shadow-xs'>
            <Icons.logo className='size-4' />
          </span>
          <span className='truncate font-semibold tracking-tight'>{SITE.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
