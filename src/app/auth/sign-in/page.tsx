import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign in'
};

export default function SignInPage() {
  return (
    <main className='flex min-h-svh items-center justify-center p-4'>
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  );
}
