'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

import PageContainer from '@/components/layout/page-container';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty';

// Covers the list and the partner page (404s go to [id]/not-found.tsx instead).
export default function PartnersError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <PageContainer>
      <Empty className='flex-1'>
        <EmptyHeader>
          <EmptyTitle>Couldn&apos;t load partners</EmptyTitle>
          <EmptyDescription>Check your connection and try again.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <LoadingButton
            variant='outline'
            onClick={retry}
            loading={isPending}
            loadingLabel='Retrying'
          >
            Try again
          </LoadingButton>
        </EmptyContent>
      </Empty>
    </PageContainer>
  );
}
