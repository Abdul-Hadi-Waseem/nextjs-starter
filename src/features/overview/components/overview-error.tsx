'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingButton } from '@/components/ui/loading-button';

// The overview's error.tsx. Retry clears the failed query's error state (otherwise
// useSuspenseQuery rethrows the cached error), re-runs the server components (new
// prefetch), then re-renders the segment.
export function OverviewError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () => {
    resetQueryErrors();
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <Alert variant='destructive'>
      <Icons.alertCircle className='h-4 w-4' aria-hidden='true' />
      <AlertTitle>Couldn&apos;t load the overview</AlertTitle>
      <AlertDescription className='flex flex-col items-start gap-3'>
        <span>{error.message}</span>
        <LoadingButton
          variant='outline'
          size='sm'
          onClick={retry}
          loading={isPending}
          loadingLabel='Retrying'
        >
          Try again
        </LoadingButton>
      </AlertDescription>
    </Alert>
  );
}
