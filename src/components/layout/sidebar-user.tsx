'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { logoutMutation } from '@/features/auth/api/mutations';
import { meQueryOptions } from '@/features/auth/api/queries';
import { AUTH } from '@/lib/api';
import { getInitials } from '@/lib/format';

// Signed-in user from /auth/me, with sign out. Same height while loading so the
// footer doesn't jump.
export function SidebarUser() {
  const { data, isPending } = useQuery(meQueryOptions());
  const logout = useMutation(logoutMutation);

  if (isPending) {
    return (
      <div className='flex h-12 items-center gap-2 p-2'>
        <Skeleton className='size-8 rounded-lg' />
        <div className='flex-1 space-y-1.5 group-data-[collapsible=icon]:hidden'>
          <Skeleton className='h-3.5 w-24' />
          <Skeleton className='h-3 w-32' />
        </div>
      </div>
    );
  }

  const user = data?.user;
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground'
              />
            }
          >
            <Avatar className='size-8 rounded-lg'>
              <AvatarFallback className='rounded-lg text-xs'>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{user.name}</span>
              <span className='text-muted-foreground truncate text-xs'>{user.email}</span>
            </span>
            <Icons.chevronsDown className='ml-auto size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--anchor-width) min-w-56 rounded-lg'
            side='top'
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='font-normal'>
              <span className='text-muted-foreground text-xs'>Signed in as {user.role}</span>
            </DropdownMenuLabel>
            {AUTH.enabled && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    logout.mutate(undefined, {
                      // Whatever the server says, go to sign-in (the shared onSettled clears the cache).
                      onSettled: () => window.location.assign(AUTH.signInPath)
                    })
                  }
                  disabled={logout.isPending}
                >
                  <Icons.logout />
                  {logout.isPending ? 'Signing out…' : 'Sign out'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
