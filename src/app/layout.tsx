import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/components/themes/font.config';
import { DEFAULT_THEME, THEMES } from '@/components/themes/theme.config';
import ThemeProvider from '@/components/themes/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../styles/globals.css';
import { env } from '@/env';
import { SITE } from '@/config/site';

// React Scan, Next.js App Router setup option 1 from its docs (script tag before any other script):
// https://github.com/aidenybai/react-scan/blob/main/docs/installation/next-js-app-router.md
// Only in `bun run dev:scan`; production builds render nothing here.
const REACT_SCAN_SRC = 'https://unpkg.com/react-scan@0.5.7/dist/auto.global.js';
const SHOW_REACT_SCAN = env.NODE_ENV === 'development' && env.NEXT_PUBLIC_REACT_SCAN;

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  ...(env.NEXT_PUBLIC_APP_URL ? { metadataBase: new URL(env.NEXT_PUBLIC_APP_URL) } : {}),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  // Images live only in public/ (enforced by `bun run images:check`).
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
    type: 'website',
    images: [{ ...SITE.ogImage, alt: SITE.name }]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage.url]
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isValidTheme = THEMES.some((t) => t.value === activeThemeValue);
  const themeToApply = isValidTheme ? activeThemeValue! : DEFAULT_THEME;

  return (
    <html lang='en' suppressHydrationWarning data-theme={themeToApply}>
      <head>
        {/* Synchronous on purpose: React Scan must load before React (dev only). */}
        {/* eslint-disable-next-line nextjs/no-sync-scripts */}
        {SHOW_REACT_SCAN && <script src={REACT_SCAN_SRC} />}
        {/* rest of your scripts go under */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Set meta theme color
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-x-hidden overscroll-none font-sans antialiased',
          fontVariables
        )}
      >
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={themeToApply}>
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
