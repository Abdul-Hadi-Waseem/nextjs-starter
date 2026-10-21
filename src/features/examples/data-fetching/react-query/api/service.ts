// Public third-party API: `api` takes the full URL as-is, and `auth: false` sends no cookie.
import { api } from '@/lib/api';
import type { Pokemon } from './types';

const POKEAPI_URL = 'https://pokeapi.co/api/v2';

export async function getPokemon(id: number, signal?: AbortSignal) {
  return api.get<Pokemon>(`${POKEAPI_URL}/pokemon/${id}`, { auth: false, signal });
}
