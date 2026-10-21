import { CommandPalette } from '@/components/kbar/lazy';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SITE } from '@/config/site';
import { meQueryOptions } from '@/features/auth/api/queries';
import { AUTH } from '@/lib/api';
import { getQueryClient } from '@/lib/query-client';

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  // Awaited so the sidebar's user block (and the role-filtered nav) is in the first
  // HTML instead of a skeleton. The layout persists across client navigations, so
  // this runs on hard loads and router.refresh() only. No retries here: a failure is
  // left to the client query (401 → sign-in) instead of holding the page back.
  const queryClient = getQueryClient();
  if (AUTH.enabled) await queryClient.prefetchQuery({ ...meQueryOptions(), retry: false });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommandPalette />
      {/* md+: the shell is exactly one viewport tall and the inset panel scrolls
          on its own, so the rounded panel and its sticky header stay framed.
          Mobile: the page scrolls as usual and the sidebar is a sheet. */}
      <SidebarProvider defaultOpen={defaultOpen} className='md:h-svh md:overflow-hidden'>
        <a
          href='#main-content'
          className='bg-background ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium shadow focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:ring-2'
        >
          Skip to content
        </a>
        <AppSidebar />
        <SidebarInset
          id='main-content'
          tabIndex={-1}
          className='scroll-mt-16 outline-none md:overflow-y-auto md:overscroll-contain'
        >
          <Header />
          <InfobarProvider defaultOpen={false}>
            {children}
            {/* Sits under the h-14 header; height = panel (100svh - m-2 x2 - border) - header. */}
            <InfoSidebar
              side='right'
              className='md:top-14 md:h-[calc(100svh-4.5rem-2px)] md:rounded-none md:border-t-0'
            />
          </InfobarProvider>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
