// ============================================================
// Product Service — the only file that talks to the backend.
// Queries (queries.ts), mutations (mutations.ts) and components import from here.
//
// Calls go through `api` (src/lib/api), which sends the auth cookie by default.
// Out of the box they hit the mock route handlers in src/app/api/products;
// set NEXT_PUBLIC_API_URL to point them at your real backend.
// ============================================================

import { api } from '@/lib/api';
import type {
  ProductFilters,
  ProductsResponse,
  ProductByIdResponse,
  ProductMutationPayload,
  ProductMutationResponse
} from './types';

// `signal` comes from React Query, so a request whose query is no longer needed is cancelled.
export async function getProducts(
  filters: ProductFilters,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  return api.get<ProductsResponse>('/products', { query: filters, signal });
}

export async function getProductById(
  id: number,
  signal?: AbortSignal
): Promise<ProductByIdResponse> {
  return api.get<ProductByIdResponse>(`/products/${id}`, { signal });
}

export async function createProduct(data: ProductMutationPayload) {
  return api.post<ProductMutationResponse>('/products', { body: data });
}

export async function updateProduct(id: number, data: ProductMutationPayload) {
  return api.put<ProductMutationResponse>(`/products/${id}`, { body: data });
}

export async function deleteProduct(id: number) {
  return api.delete<ProductMutationResponse>(`/products/${id}`);
}
