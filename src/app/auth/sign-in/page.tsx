import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Icons } from '@/components/icons';
import { SITE } from '@/config/site';
import { MOCK_API_ENABLED } from '@/app/api/_mock/guard';
import { SignInForm } from '@/features/auth/components/sign-in-form';
import { Spotlight } from '@/features/auth/components/spotlight';

export const metadata: Metadata = {
  title: 'Sign in'
};

function BrandMark() {
  return (
    <div className='flex items-center gap-2'>
      <span className='bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg'>
        <Icons.logo className='size-4' />
      </span>
      <span className='font-semibold'>{SITE.name}</span>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className='grid min-h-svh lg:grid-cols-2'>
      {/* Decorative panel: drawn with CSS (no image), follows the active theme. */}
      <section className='bg-muted relative hidden overflow-hidden lg:block' aria-hidden='true'>
        <Spotlight />
        <div className='auth-backdrop absolute inset-0' />
        <div className='relative flex h-full flex-col justify-between p-10'>
          <BrandMark />
          <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
            {SITE.description}
          </p>
        </div>
      </section>

      <section className='flex items-center justify-center p-6 sm:p-10'>
        <div className='w-full max-w-sm'>
          <div className='mb-10 lg:hidden'>
            <BrandMark />
          </div>
          <Suspense>
            <SignInForm showDemoHint={MOCK_API_ENABLED} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
