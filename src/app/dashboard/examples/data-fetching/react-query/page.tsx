import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { pokemonOptions } from '@/features/examples/data-fetching/react-query/api/queries';
import { DEFAULT_POKEMON_ID } from '@/features/examples/data-fetching/react-query/constants/pokemon';
import { PokemonInfo } from '@/features/examples/data-fetching/react-query/components/pokemon-info';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { PokemonSkeleton } from '@/features/examples/data-fetching/react-query/components/pokemon-skeleton';
import { reactQueryInfoContent } from '@/features/examples/data-fetching/react-query/constants/info-content';

export const metadata = {
  title: 'React Query'
};

export default async function ReactQueryPage() {
  const queryClient = getQueryClient();

  // Prefetch on the server — data is ready before client JS loads
  void queryClient.prefetchQuery(pokemonOptions(DEFAULT_POKEMON_ID));

  return (
    <PageContainer
      pageTitle='React Query'
      pageDescription='Server prefetch, client hydration and useSuspenseQuery.'
      infoContent={reactQueryInfoContent}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<PokemonSkeleton />}>
          <PokemonInfo />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}
