# Frontend Guide

Where things go in this repo, and why. Read this before adding a feature.

## Feature layout

Every feature lives in `src/features/<feature>/`:

```plaintext
src/features/products/
├── api/
│   ├── types.ts       # Request/response types
│   ├── service.ts     # The ONLY place that talks to the backend
│   ├── queries.ts     # Query key factory + queryOptions (reads)
│   └── mutations.ts   # mutationOptions (writes) + cache invalidation
├── components/        # Feature UI (listing, form, table, view page)
├── schemas/           # Zod schemas for forms
└── constants/         # Feature-only constants and enums
```

Routes in `src/app/` stay thin: a `page.tsx` reads params and renders a feature component.

## Data fetching

### Reads (queries)

1. Write the fetch function in `api/service.ts`.
2. Add a key and `queryOptions` in `api/queries.ts`:

```ts
export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const
};

export const productsQueryOptions = (filters: ProductFilters) =>
  queryOptions({ queryKey: productKeys.list(filters), queryFn: () => getProducts(filters) });
```

3. Prefetch on the server, hydrate on the client (see `features/products/components/product-listing.tsx`):

```tsx
const queryClient = getQueryClient();
void queryClient.prefetchQuery(productsQueryOptions(filters));

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <ProductTable />
  </HydrationBoundary>
);
```

4. In the client component, read it with `useSuspenseQuery(productsQueryOptions(filters))` or `useQuery(...)`.

Components import from `queries.ts` and `service.ts`, never from mock data or `fetch` directly.

### Writes (mutations)

Put them in `api/mutations.ts` and invalidate the feature's keys on success:

```ts
export const createProductMutation = mutationOptions({
  mutationFn: (data: ProductMutationPayload) => createProduct(data),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: productKeys.all })
});
```

Use them in components with `useMutation(createProductMutation)`.

### Calling the backend: `api` (`src/lib/api`)

Every service uses `api`. Never call `fetch` directly. It builds the URL from `NEXT_PUBLIC_API_URL`, sends and parses JSON, and throws `ApiError` (with `status` and `body`) on a non-2xx response.

```ts
import { api } from '@/lib/api';

// Authenticated (the default): sends the auth cookie
api.get<ProductsResponse>('/products', { query: filters });
api.post<ProductMutationResponse>('/products', { body: payload });
api.put(`/products/${id}`, { body: payload });
api.delete(`/products/${id}`);

// Public endpoint: no cookie sent
api.get<Plan[]>('/plans', { auth: false });
```

The same call works from a server component (prefetch) and from the browser (queries, mutations):

| Where it runs | `auth: true` (default) | `auth: false` |
| :--- | :--- | :--- |
| Browser | `credentials: 'include'`: the browser attaches the cookie | `credentials: 'omit'` |
| Server (prefetch, route handlers, server actions) | Forwards the incoming request's cookies from `cookies()` | Nothing forwarded |

For static public data that rarely changes, you can also fetch it in a server component and let Next.js cache it (`api.get(path, { auth: false, next: { revalidate: 3600 } })`).

### Authentication

The backend issues the auth token as an **httpOnly cookie**. The frontend never reads or stores the token.

- **`src/proxy.ts`** (Next.js 16's middleware) redirects `/dashboard/*` to `/auth/sign-in?next=…` when the cookie is missing, and sends signed-in users away from the sign-in page. It only checks that the cookie exists; the backend verifies it on every request.
- **401 responses**: the query client (`src/lib/query-client.ts`) clears the cache and redirects to sign-in. 4xx errors are never retried.
- **`src/features/auth`**: `login`, `logout`, `getMe` in `api/service.ts`; `meQueryOptions` in `api/queries.ts`; `loginMutation` and `logoutMutation` (which clears the whole cache) in `api/mutations.ts`.
- **Turn it on** with `NEXT_PUBLIC_AUTH_ENABLED=true`. Set `AUTH_COOKIE_NAME` to the cookie your backend sets.

**Mock backend.** Out of the box, `NEXT_PUBLIC_API_URL` points at this app's own route handlers in `src/app/api/` (products, users, `auth/login|logout|me`). With auth enabled they return 401 without the cookie, just like a real backend. Point `NEXT_PUBLIC_API_URL` at your backend and delete `src/app/api/` when you connect a real one.

Two production safeguards:

- **The mock API is off in production.** Every mock handler answers 404 unless `ENABLE_MOCK_API=true`. Only set that for a demo deployment; the mock login accepts any password.
- **`NEXT_PUBLIC_API_URL` is required.** `src/env.ts` validates it on dev start and build, so a deployment can't silently call `localhost`.

**Backend checklist** for cookie auth to work and stay safe:

1. Cookie flags: `HttpOnly; Secure; SameSite=Lax; Path=/`, short expiry, refresh-token rotation.
2. Frontend and backend on the same parent domain (`app.example.com` + `api.example.com`), with the cookie set for that domain.
3. CORS: `Access-Control-Allow-Credentials: true` and the exact frontend origin, never `*`.
4. CSRF: reject POST/PUT/PATCH/DELETE requests whose `Origin` isn't the frontend.

## Environment variables

- **Every variable is declared in `src/env.ts`** with a zod schema (`@t3-oss/env-nextjs`). `bun run dev` and `bun run build` stop with "Invalid environment variables" when one is missing or wrong. Start with `cp env.example.txt .env.local`.
- Read variables through `env` from `@/env`, never `process.env`.
- Only `NEXT_PUBLIC_` variables (the `client` block) reach the browser, and anyone can read them. Secrets go in the `server` block; reading one in client code throws.
- Adding a variable: add it to `src/env.ts` (schema + `runtimeEnv`) and to `env.example.txt`.

## UI components (shadcn/ui)

This repo uses shadcn/ui on Base UI primitives (`style: base-nova` in `components.json`), with icons from Tabler.

```bash
bunx shadcn@latest add <component>   # e.g. bunx shadcn@latest add tooltip
```

Components land in `src/components/ui/`. Import icons only from `@/components/icons`, never from `@tabler/icons-react` directly.

## Images

**Location.** Images live only in `public/` (usually `public/images/`). An image file anywhere else in the app fails `bun run images:check`.

**Formats.** WebP or AVIF for photos and screenshots, SVG for icons and logos. PNG/JPG/GIF are blocked except in `public/og/` (social preview images, which some platforms still require), and every image must be under 300 KB. The pre-push hook enforces this with `bun run images:check`. Convert before committing, e.g. `bunx sharp-cli -i in.png -o out.webp` or any image tool.

**Referencing.** Use the public path (`/images/hero.webp`) with `next/image` and give `width`/`height` (or `fill` + `sizes`).

**Always `next/image`, with `sizes`.** A raw `<img>` is a lint error. `sizes` tells the browser which width to download (for example `sizes='80px'` for a thumbnail). Images never go into the JavaScript bundle; they only cost page weight on pages that show them.

**Who resizes images** is set by `NEXT_PUBLIC_IMAGE_LOADER`:

| Value | What happens | Use when |
| :--- | :--- | :--- |
| *(empty)* | Next.js built-in optimizer: sharp resizes on your server, serves AVIF/WebP, caches for 31 days | One server, or Vercel |
| `cloudflare` | URLs become `/cdn-cgi/image/width=…,format=auto/…`; Cloudflare resizes at the edge (production only) | You're behind Cloudflare with Image Transformations on |
| `none` | No resizing; images are served as committed | Several pods with no CDN transforms |

With the built-in optimizer, **every pod runs sharp itself and keeps its own cache**, so a deployment with many pods resizes each image many times. That shows up as CPU and memory spikes. On multi-pod deployments use `cloudflare`, or `none` (safe here because the image policy keeps assets small).

## Bundle size

Every route has a budget for its **gzipped first-load JS** in `bundle-budget.json`. The pre-push hook blocks the push when a route goes over.

```bash
bun run build && bun run bundle:check   # per-route table vs budget
bun run analyze                         # interactive analyzer: find what grew
bun run analyze:report                  # static report in .next/diagnostics/analyze
```

Rules that keep pages light:

- Heavy client-only libraries load with `next/dynamic`: charts (`src/features/overview/components/lazy-graphs.tsx`) and the Cmd+K palette (`src/components/kbar/lazy.tsx`).
- Heavy form fields (Combobox, DatePicker, DateRange, Otp, FileUpload) are imported where they're used, not registered globally (see docs/forms.md).
- Keep `'use client'` on the smallest component that needs it.
- Don't raise a budget just to get a push through. Find what grew first, and only raise it on purpose.

## Access control (roles)

- Roles live in `ROLE` (`src/features/auth/constants.ts`); the signed-in user (`/auth/me`) has a `role` and `permissions`.
- **Nav items**: `access: { role: ROLE.ADMIN }` or `{ permission: 'users:write' }` in `src/config/nav-config.ts`. Items the user can't access are hidden from the sidebar and Cmd+K.
- **Pages**: `await requireAccess({ role: ROLE.ADMIN })` at the top of the server page. Signed-out users go to sign-in; users without access get a 404.
- Hiding links is UX only. **The backend must enforce the same rule** on its endpoints.
- With `NEXT_PUBLIC_AUTH_ENABLED=false` (demo), everything is visible.
- Mock backend: emails starting with `admin` sign in as admin, any other email as member.

## Security headers

`next.config.ts` sends these on every response (built in `src/config/security-headers.ts`): Content-Security-Policy, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and HSTS in production.

- The CSP allows the API origin (`NEXT_PUBLIC_API_URL`), the image hosts in `src/config/images.ts` and the Cloudflare image origin. Add a new third-party origin there, not inline.
- It's a static CSP, so scripts allow `'unsafe-inline'` (Next.js injects inline hydration scripts). For a stricter policy, move to a nonce-based CSP in `src/proxy.ts`; see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.
- Behind Cloudflare you can also turn on HSTS in its SSL/TLS settings; keep the CSP here, because it depends on what the app loads.

## Package manager

This repo uses **Bun** (`bun.lock` is committed): `bun install`, `bun run dev`, `bun run <script>`.
