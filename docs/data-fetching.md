# Data fetching

The one guide for reading and writing backend data: TanStack Query in the browser, `api` everywhere, and the server-side options (server components, server actions, route handlers). Every section links to a working example under **Examples** in the sidebar (`/dashboard/examples/...`); the files are the reference.

- [Layers](#layers)
- [Calling the backend: `api`](#calling-the-backend-api)
- [Query keys](#query-keys)
- [`queryOptions` and `mutationOptions`](#queryoptions-and-mutationoptions)
- [Server prefetch + `HydrationBoundary`](#server-prefetch--hydrationboundary)
- [Defaults (`src/lib/query-client.ts`)](#defaults-srclibquery-clientts)
- [Caching](#caching)
- [Invalidation](#invalidation)
- [Optimistic updates](#optimistic-updates)
- [Pagination](#pagination)
- [Infinite queries](#infinite-queries)
- [Dependent and parallel queries](#dependent-and-parallel-queries)
- [Prefetch on intent](#prefetch-on-intent)
- [Polling](#polling)
- [`select`](#select)
- [Cancellation](#cancellation)
- [Mutation state](#mutation-state)
- [Errors](#errors)
- [Server-side calls](#server-side-calls)

## Layers

Each feature has `api/types.ts` → `api/service.ts` → `api/queries.ts` + `api/mutations.ts`. Only `service.ts` talks to the backend; components import queries, mutations and (for one-off calls) service functions, never `fetch` or mock data.

```plaintext
src/features/payouts/api/
├── types.ts       # request/response types
├── service.ts     # api.get/post/... calls, nothing else
├── queries.ts     # key factory + queryOptions
└── mutations.ts   # mutationOptions + invalidation
```

## Calling the backend: `api`

**Rule:** every service calls `api` from `@/lib/api`. It builds the URL from `NEXT_PUBLIC_API_URL`, sends and parses JSON, and throws `ApiError` (`status`, `body`) on a non-2xx answer.

```ts
api.get<PartnersResponse>('/partners', { query: filters, signal }); // signed in (default)
api.post<PayoutMutationResponse>('/payouts', { body: payload });
api.get<Plan[]>('/plans', { auth: false });                        // public: no cookie
```

| Where it runs | `auth: true` (default) | `auth: false` |
| :--- | :--- | :--- |
| Browser | `credentials: 'include'`: the browser attaches the cookie | `credentials: 'omit'` |
| Server (prefetch, server components, actions, route handlers) | Forwards the incoming request's cookies from `cookies()` | Nothing forwarded |

Example: Public and signed-in calls (`/dashboard/examples/data-fetching/public-vs-auth`) (`src/features/examples/data-fetching/components/public-vs-auth-view.tsx`). It also shows what each call returns without a cookie.

## Query keys

**Rule:** one key factory per feature, from general to specific, so one `invalidateQueries` call can hit a whole group.

```ts
export const partnerKeys = {
  all: ['partners'] as const,
  list: (filters: PartnerFilters) => [...partnerKeys.all, 'list', filters] as const,
  detail: (id: string) => [...partnerKeys.all, 'detail', id] as const
};
```

A query derived from another feature's data goes under that feature's key: the infinite payouts list (`src/features/examples/shared/api/queries.ts`) uses `[...payoutKeys.all, 'infinite', …]`, so payout writes refresh it. Factory example: `src/features/partners/api/queries.ts`.

## `queryOptions` and `mutationOptions`

**Rule:** define each query once with `queryOptions` and reuse it on the server (prefetch), in components (`useSuspenseQuery`/`useQuery`), and in `prefetchQuery`/`setQueryData`. Writes are `mutationOptions` in `mutations.ts`; components add only UI effects (toasts, navigation) per call.

```ts
export const partnersQueryOptions = (filters: PartnerFilters) =>
  queryOptions({
    queryKey: partnerKeys.list(filters),
    queryFn: ({ signal }) => getPartners(filters, signal)
  });

export const createPayoutMutation = mutationOptions({
  mutationFn: (data: PayoutPayload) => createPayout(data),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: payoutKeys.all })
});

// Component: shared options, UI effects per call
const create = useMutation(createPayoutMutation);
create.mutate(values, { onSuccess: () => toast.success('Payout created') });
```

Spreading and overriding `onSuccess` (`useMutation({ ...createPayoutMutation, onSuccess })`) replaces the shared one, invalidation included; pass UI callbacks to `mutate` instead.

## Server prefetch + `HydrationBoundary`

**Rule:** a page's server component starts the fetch without awaiting it, and the client reads it with `useSuspenseQuery`. The pending query streams to the browser; nothing is fetched twice.

```tsx
// Server component
const queryClient = getQueryClient();
void queryClient.prefetchQuery(partnersQueryOptions(filters));

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<PartnersTableSkeleton />}>
      <PartnersTable />
    </Suspense>
  </HydrationBoundary>
);

// Client component
const { data } = useSuspenseQuery(partnersQueryOptions(filters));
```

- `void`, not `await`: the page shell renders immediately and the data streams in.
- On the server, `getQueryClient()` returns one client per request (React `cache`), so a layout and its page share it and the same query is fetched once. Requests never share a client.
- Await only when the result decides the response (a missing record → `notFound()`), like `src/app/dashboard/partners/[id]/page.tsx`.
  The one other exception is `/auth/me` in `src/app/dashboard/layout.tsx`: awaited (no retries) so the sidebar's user block and role-filtered nav are in the first HTML.
- `useQuery` instead of `useSuspenseQuery` when the component should render its own loading state (the polling (`/dashboard/examples/data-fetching/polling`) card does, to show `isPending`).

Examples: React Query (`/dashboard/examples/data-fetching/react-query`), and every list in `src/features/partners` and `src/features/payouts`.

## Defaults (`src/lib/query-client.ts`)

| Setting | Value | Why |
| :--- | :--- | :--- |
| `staleTime` | 60 s | Data counts as fresh for a minute: remounts and navigation don't refetch. |
| `gcTime` | TanStack default (5 min in the browser) | Unused data is dropped 5 min after its last component unmounts. |
| `retry` | Up to 2 retries, never on 4xx | A 4xx won't fix itself; network errors and 5xx might. Mutations don't retry (TanStack default). |
| `refetchOnWindowFocus` | TanStack default (`true`) | Stale queries refetch when the tab gets focus again. |
| `dehydrate.shouldDehydrateQuery` | Default + pending queries | Lets `void prefetchQuery` stream a query that hasn't finished yet. |
| `QueryCache`/`MutationCache` `onError` | 401 → `queryClient.clear()` + redirect to `/auth/sign-in?next=…` | Session handling lives in one place, not in components. |

Override per query only with a reason (`ACCOUNT_QUERY_CACHE` in `src/features/examples/shared/constants/cache.ts`).

## Caching

There are two caches, for two kinds of data:

| Data | Where it is cached | How |
| :--- | :--- | :--- |
| Public, the same for everyone (rates, plans, catalog) | Next.js server data cache, shared by all users | `api.get(path, { auth: false, next: { revalidate, tags } })` in a server component; refresh with `updateTag` (server action) or `revalidateTag(tag, 'max')` (webhook, route handler) |
| Per user (account, their payouts, anything behind the cookie) | **Never on the server.** TanStack Query in that user's browser only | `staleTime` (how long it counts as fresh) and `gcTime` (how long unused data stays in memory) |

Rules:

- **Per-user data is never server-cached**: one shared cache entry would hand one user's data to the next. Only cache on the server what you'd serve to a signed-out visitor, and send no cookie with it (`auth: false`).
- **`staleTime` vs `gcTime`**: `staleTime` decides when a mounted query refetches; `gcTime` decides when an unused one is deleted. Raise `staleTime` for data that changes rarely; leave `gcTime` alone unless memory matters.
- **`updateTag` vs `revalidateTag`**: in a server action where the user must see the change now, `updateTag(tag)`: the entry expires and the action's response re-renders the page. Elsewhere `revalidateTag(tag, 'max')`: the next visitor gets the old data while it refreshes in the background, and the action response does not re-render. The one-argument `revalidateTag(tag)` is deprecated.
- **Headers**: public routes answer `Cache-Control: public, s-maxage=…, stale-while-revalidate=…` so a CDN can keep them; authenticated routes answer `Cache-Control: private, no-store`. Values: `CACHE_CONTROL` in `src/features/examples/shared/constants/cache.ts`. A CDN doesn't see `revalidateTag`; it keeps its copy until `s-maxage` runs out unless you purge it.
- This repo does not enable `cacheComponents` (`'use cache'`, `cacheLife`, `cacheTag`). The approach above is the documented one without it: `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`.

Example: Caching (`/dashboard/examples/data-fetching/caching`) (`src/features/examples/data-fetching/components/caching-view.tsx`, server action in `src/features/examples/data-fetching/actions/refresh-exchange-rates.ts`).

## Invalidation

**Rule:** after a write, invalidate the narrowest key that covers everything it changed, including other features' data.

```ts
// One feature
queryClient.invalidateQueries({ queryKey: partnerKeys.all });

// A payout changes partner totals and the overview too (src/features/payouts/api/mutations.ts)
function invalidatePayoutData() {
  queryClient.invalidateQueries({ queryKey: payoutKeys.all });
  queryClient.invalidateQueries({ queryKey: partnerKeys.all });
  queryClient.invalidateQueries({ queryKey: overviewKeys.all });
}
```

- `setQueryData` when the response already contains the new record and nothing else changed (`loginMutation` in `src/features/auth/api/mutations.ts`).
- `queryClient.clear()` when the session ends (`logoutMutation`).
- With several writes in flight on the same data, refetch only when the last one settles (`invalidateChecklistWhenIdle` in `src/features/examples/data-fetching/api/mutations.ts`).

## Optimistic updates

Two patterns. Both show the change before the server answers.

**1. Update the cache** when the change shows in several places or must survive a remount:

```ts
export const toggleItemMutation = mutationOptions({
  mutationKey: checklistMutationKeys.toggle(),
  mutationFn: setChecklistItemDone,
  onMutate: async ({ id, done }) => {
    await queryClient.cancelQueries({ queryKey });         // a refetch in flight would overwrite it
    const previous = queryClient.getQueryData(queryKey);   // snapshot
    queryClient.setQueryData(queryKey, (old) => /* apply */);
    return { previous };
  },
  onError: (_e, _v, context) => queryClient.setQueryData(queryKey, context?.previous), // roll back
  onSettled: () => queryClient.invalidateQueries({ queryKey })                     // sync
});
```

**2. Render the pending input** when one place shows the change: write nothing before the answer, render `variables` while the mutation is pending (a failure just removes it), then put the saved record in the cache (`setQueryData` in `onSuccess`) or refetch.

```tsx
const { mutate, variables, isPending } = useMutation(addItemMutation);
{isPending && <li className='opacity-60'>{variables.title}</li>}
// From another component: useMutationState (see Mutation state)
```

Toasts match the action: "Task completed" / "Couldn't update the task. Change undone." Example: Optimistic updates (`/dashboard/examples/data-fetching/optimistic`), with a switch that fails the next request.

## Pagination

**Rule:** page number in the URL (nuqs, same parser on server and client), `placeholderData: keepPreviousData` so the current page stays on screen while the next loads, and prefetch the next page.

```tsx
const { data, isPlaceholderData } = useQuery({
  ...partnersQueryOptions({ page, limit }),
  placeholderData: keepPreviousData
});
const totalPages = data ? pageCount(data.total_partners, limit) : 1;

useEffect(() => {
  if (page < totalPages) void queryClient.prefetchQuery(partnersQueryOptions({ page: page + 1, limit }));
}, [page, totalPages, queryClient]);
```

Page math lives in `src/lib/pagination.ts` (`toOffset`, `pageCount`, `hasNextPage`). The tables do the same through `useDataTable` and `useDeferredFilters`. Example: Pagination (`/dashboard/examples/data-fetching/pagination`).

## Infinite queries

**Rule:** `infiniteQueryOptions` with `initialPageParam` and a `getNextPageParam` that returns `undefined` at the end; prefetch the first page with `prefetchInfiniteQuery`.

```ts
infiniteQueryOptions({
  queryKey: [...payoutKeys.all, 'infinite', limit],
  queryFn: ({ pageParam, signal }) => getPayouts({ page: pageParam, limit }, signal),
  initialPageParam: 1,
  getNextPageParam: (last, _all, lastPageParam) =>
    hasNextPage(last, last.total_payouts) ? lastPageParam + 1 : undefined
});
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(...)
// rows: data.pages.flatMap((page) => page.payouts)
```

Example: Infinite list (`/dashboard/examples/data-fetching/infinite`) (`src/features/examples/shared/api/queries.ts`).

## Dependent and parallel queries

- **Dependent**: a query that needs a value it doesn't have yet gets `enabled: value !== null`. While disabled it is `isPending` with `fetchStatus: 'idle'`: show a prompt, not a skeleton.
- **Parallel**: independent queries in one component use `useSuspenseQueries` (or `useQueries`), so they start together instead of one suspending before the next begins. Prefetch each on the server.

```ts
useQuery({ ...payoutsQueryOptions({ partnerId: partnerId ?? undefined }), enabled: partnerId !== null });

const [partners, payouts] = useSuspenseQueries({
  queries: [partnersQueryOptions({ limit: 1 }), payoutsQueryOptions({ limit: 1 })]
});
```

Example: Dependent and parallel (`/dashboard/examples/data-fetching/dependent`).

## Prefetch on intent

**Rule:** call `queryClient.prefetchQuery(sameQueryOptions)` on `onPointerEnter` and `onFocus` of the link or button that will show the data. It's skipped when the data is still fresh, so repeat hovers cost nothing.

```tsx
<button onPointerEnter={() => prefetch(id)} onFocus={() => prefetch(id)} onClick={() => select(id)}>
```

It helps views that read the data on the client. A page that awaits its data on the server (partner detail) fetches it there anyway. Example: Prefetch on intent (`/dashboard/examples/data-fetching/prefetch`).

## Polling

**Rule:** `refetchInterval` for data that changes on its own. It pauses while the tab is hidden (`refetchIntervalInBackground` is `false` by default); focus refetches stale data (`refetchOnWindowFocus`).

```ts
useQuery({ ...exchangeRatesQueryOptions(), refetchInterval: POLL_INTERVAL_MS });
```

`isPending` is true only before the first data; `isFetching` is true during any request, background refetches included. Spinners for background refreshes read `isFetching`, skeletons read `isPending`. Example: Polling, select and cancel (`/dashboard/examples/data-fetching/polling`).

## `select`

**Rule:** derive what a component needs with `select`. The component re-renders only when the selected value changes, not on every refetch. Keep the function stable (module level or `useCallback`).

```ts
function selectCurrencies(data: ExchangeRates) {
  return data.rates.map((rate) => rate.currency).join(', ');
}
useSuspenseQuery({ ...exchangeRatesQueryOptions(), select: selectCurrencies });
```

Example: the Select card on the polling (`/dashboard/examples/data-fetching/polling`) page.

## Cancellation

**Rule:** query functions pass TanStack's `signal` to the service, and the service passes it to `api` (`RequestOptions.signal`). When a query's key changes or its last component unmounts mid-request, the request is aborted.

```ts
export async function getPartners(filters: PartnerFilters, signal?: AbortSignal) {
  return api.get<PartnersResponse>('/partners', { query: filters, signal });
}
queryFn: ({ signal }) => getPartners(filters, signal);
```

`partnersQueryOptions` and `payoutsQueryOptions` do this already. Example: the search card on the polling (`/dashboard/examples/data-fetching/polling`) page (type quickly and watch DevTools > Network).

## Mutation state

**Rule:** give mutations a `mutationKey` and read their state anywhere: `useIsMutating({ mutationKey })` for a global "Saving…" indicator, `useMutationState({ filters, select })` to render pending variables from another component.

```ts
const pending = useIsMutating({ mutationKey: checklistMutationKeys.all });
const pendingTitles = useMutationState({
  filters: { mutationKey: checklistMutationKeys.add(), status: 'pending' },
  select: (mutation) => (mutation.state.variables as AddChecklistItem).title
});
```

`mutate`'s per-call callbacks only fire for the latest call of that hook. For several calls in flight, use one `useMutation` per row or `mutateAsync(...).then(...)`. Example: Optimistic updates (`/dashboard/examples/data-fetching/optimistic`) (`saving-indicator.tsx`, `checklist-card.tsx`).

## Errors

- **401** is handled once, in `src/lib/query-client.ts`: the cache is cleared and the user goes to sign-in. Don't handle it in components.
- **Everything else** is an `ApiError`. Check with `isApiError(error)` and read `error.status`, `error.message` (the backend's `message` when it sent one) or `error.body`.
- **Mutations** show a toast in `onError` that says what failed: "Couldn't delete the payout. Try again."
- **Server components and actions** don't get the global handler: catch 401 there (`getAccountOrSignIn` redirects, `getSessionUser` returns `null`, both in `src/features/examples/shared/api/server.ts`).
- Thrown errors reach the nearest `error.tsx` (e.g. `src/app/dashboard/partners/error.tsx`).

## Server-side calls

| Use | When |
| :--- | :--- |
| **Prefetch + `useSuspenseQuery`** (default) | The browser keeps the data: it refetches, paginates, mutates or polls it. |
| **Async server component**, `await api.get(...)` | Read once per request, nothing in the browser refetches or caches it. No client JS for the data. Wrap it in `<Suspense>` so the shell streams first. Example (`/dashboard/examples/server/server-component`) |
| **Server action** + `useActionState` | A form that should work as a POST, return field errors and re-render the page. Example (`/dashboard/examples/server/server-action`) |
| **Route handler (BFF)** | The browser must not see a secret, the backend URL, or the backend's raw response. Example (`/dashboard/examples/server/route-handler`) |

**How the cookie gets to the backend.** On the server, `api` (`src/lib/api/http.ts`) reads `cookies()` from the incoming request and sends them as the `Cookie` header when `auth` is on. The httpOnly token never passes through browser JavaScript. Outside a request (build time) there are no cookies to forward.

**Where secrets live.** In the `server` block of `src/env.ts` (e.g. `BACKEND_API_KEY`), read with `env` in server code only. Never `NEXT_PUBLIC_`: those are inlined into the browser bundle. A route handler that adds a secret builds its outgoing headers from scratch (only the session cookie and the secret, never the incoming headers wholesale), calls only allowlisted backend paths, never follows redirects (`redirect: 'manual'`, a 3xx becomes a 502, since fetch would resend the secret to the new host), and sets `signal: AbortSignal.timeout(…)` (`src/app/api/examples/proxy/[resource]/route.ts`). It uses `fetch` directly because `api` forwards every cookie.

**Server actions are public POST endpoints.**

1. Check the session inside the action; rendering the form only on a signed-in page is not a boundary.
2. Validate `FormData` with zod and return field errors (`z.flattenError(error).fieldErrors`).
3. Call the backend through `api` (cookie forwarded).
4. Re-render: `refresh()` when the page reads uncached data, `updateTag(tag)` when it reads tagged cached data, `revalidatePath(path)` for another route's cached output.
5. CSRF: Next.js compares the host in the `Origin` header with `Host` (or `X-Forwarded-Host`) and rejects a mismatch. A request with no `Origin` header is let through with a warning, so the session check still matters. Behind a proxy or CDN on another domain, list it in `serverActions.allowedOrigins`.

See `src/features/examples/server-side/actions/update-display-name.ts` and `node_modules/next/dist/docs/01-app/02-guides/server-actions.md`.
