import { Breadcrumbs } from '@/components/breadcrumbs';
import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';
import { ThemeSelector } from '@/components/themes/theme-selector';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HeaderSearch } from './header-search';

// Top bar of the inset panel. Sticks to the top of the panel's own scroll area
// (md+) or the page (mobile). The InfoSidebar offset in the dashboard layout
// assumes this h-14.
export function Header() {
  return (
    <header className='bg-background/80 supports-backdrop-filter:bg-background/70 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-3 backdrop-blur-md md:px-4'>
      <SidebarTrigger className='-ml-0.5' />
      <Separator orientation='vertical' className='mx-1 h-4 data-vertical:self-center' />
      <div className='min-w-0 flex-1 truncate'>
        <Breadcrumbs />
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        <HeaderSearch />
        <ThemeModeToggle />
        <div className='hidden sm:block'>
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
