import { queryOptions } from '@tanstack/react-query';
import { DEFAULT_POKEMON_ID } from '../constants/pokemon';
import { getPokemon } from './service';

export const pokemonKeys = {
  all: ['pokemon'] as const,
  detail: (id: number) => [...pokemonKeys.all, id] as const
};

export const pokemonOptions = (id: number = DEFAULT_POKEMON_ID) =>
  queryOptions({
    queryKey: pokemonKeys.detail(id),
    queryFn: ({ signal }) => getPokemon(id, signal)
  });
