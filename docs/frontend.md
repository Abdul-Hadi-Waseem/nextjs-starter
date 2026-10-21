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
- **On by default.** Without the session cookie, `/dashboard/*` redirects to sign-in. `NEXT_PUBLIC_AUTH_ENABLED=false` opens everything (demo only). Set `AUTH_COOKIE_NAME` to the cookie your backend sets.
- **Sign-in page** (`src/app/auth/sign-in`): with the mock API on, it shows a demo hint and a "Fill demo admin" button. Swapping to your backend needs no UI change: `login` in `src/features/auth/api/service.ts` posts to `/auth/login` on `NEXT_PUBLIC_API_URL`, and the backend sets the cookie.

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
- Server code reads `env` from `@/env`. Browser code reads `PUBLIC_ENV` from `@/lib/public-env`: the same values (inlined at build, already validated), without shipping zod to every page. Never read `process.env` elsewhere.
- Only `NEXT_PUBLIC_` variables (the `client` block) reach the browser, and anyone can read them. Secrets go in the `server` block; reading one in client code throws.
- Adding a variable: add it to `src/env.ts` (schema + `runtimeEnv`) and to `env.example.txt`; if browser code needs it, also to `src/lib/public-env.ts`.

## UI components (shadcn/ui)

This repo uses shadcn/ui on Base UI primitives (`style: base-nova` in `components.json`), with icons from Tabler.

```bash
bunx shadcn@latest add <component>          # installs into src/components/ui/
bunx shadcn@latest add <component> --view   # read the original source without installing
bunx shadcn@latest add <component> --diff   # compare your edited copy with the original
```

**About `cn`:** class merging uses shadcn's [`cn`](https://github.com/shadcn-ui/cn) package (a faster drop-in for `clsx` + `tailwind-merge`). New shadcn components import it as `from 'cn'`; older code imports `from '@/lib/utils'`, which re-exports the same function. Both are fine.

**After every `shadcn add`:**

1. Run `bun run format` (the registry uses double quotes and no semicolons).
2. Check that the colors in its `cva()` block are theme tokens (`bg-primary`, `text-muted-foreground`, …), not hex values.
3. Commit before re-adding an existing component with `--overwrite`; it replaces your edits. Use `--diff` first.

**Making a component match the design system, in this order:**

1. **Tokens first.** Colors, radius, fonts and shadows come from CSS variables in `src/styles/theme.css` and `src/styles/themes/*.css`. Change them there and every component follows.
2. **Edit the component file.** It's your code, not a package. For a new look, add a variant to its `cva()` block (e.g. `success: 'bg-success/10 text-success'`) and use `<Badge variant='success'>`. A new color needs a token first: add `--success` to the theme files and map it in the `@theme inline` block of `globals.css`.
3. **One-off tweaks** go in `className` at the call site; `cn()` (tailwind-merge) lets it override the base classes. The same override in three places should become a variant.
4. **Composite patterns** (e.g. a confirm button = Button + AlertDialog) are wrappers in `src/components/`, not edits inside `ui/`.

Anatomy of a shadcn file (see `src/components/ui/badge.tsx`): Base UI provides behavior and accessibility; `cva()` holds every class and variant; the component merges `variant` classes with your `className`; `render` swaps the element (e.g. `render={<Link href='/x' />}`); `data-slot` lets parents style it.

## Where components go

- **`src/features/<name>/components/`**: anything that belongs to one feature: its listing, form, table columns, page shell, skeletons.
- **`src/components/`**: anything used by two or more features or by none: `ui/` (shadcn primitives), `layout/`, `data-table/`, `forms/fields/`, `icons.tsx`, small shared pieces like `truncated-text.tsx`.
- Start inside the feature. Move a component to `src/components/` only when a second feature needs it.

## Client state (Zustand)

Most state already has a home: server data in TanStack Query, URL state (filters, pagination, tabs) in nuqs, form state in TanStack Form. Use Zustand only for **client-only state shared by components that aren't parent and child**.

- Store used by one feature: `src/features/<name>/stores/`. Shared store: `src/stores/`.
- Example: `src/stores/ui-preferences.ts` (table density, toggled from the table toolbar, remembered per browser). It persists to localStorage with `skipHydration`, and `PreferencesHydrator` loads it after mount, so server and client render the same HTML first.
- A preference that must be right in the server HTML (e.g. the sidebar) belongs in a cookie instead.

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

## Name and branding

The app name and description live in `src/config/site.ts` (`SITE`). Titles, metadata, the sidebar and the sign-in page read from it, so renaming the template is a one-line change.

## Debugging re-renders

`bun run dev:scan` starts dev in debug mode: [React Scan](https://github.com/aidenybai/react-scan) outlines each component as it re-renders (and counts renders), and the React Query devtools appear. Plain `bun run dev` loads neither, and neither ever ships to production.

## Loading states without layout shift

- A page's `loading.tsx` renders the same page shell as the page (see `ProductsPageShell` in `src/features/products/components/products-page-shell.tsx`), so the title and actions don't move when data arrives.
- Skeletons use the real sizes of what they stand in for (fixed chart height in `src/features/overview/constants/chart.ts`, real chart headers, `h-lh` text placeholders).
- Check with Chrome DevTools > Performance (Layout Shift) or Lighthouse; aim for CLS 0.

## Security headers

`next.config.ts` sends these on every response (built in `src/config/security-headers.ts`): Content-Security-Policy, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and HSTS in production.

- The CSP allows the API origin (`NEXT_PUBLIC_API_URL`), the image hosts in `src/config/images.ts` and the Cloudflare image origin. Add a new third-party origin there, not inline.
- It's a static CSP, so scripts allow `'unsafe-inline'` (Next.js injects inline hydration scripts). For a stricter policy, move to a nonce-based CSP in `src/proxy.ts`; see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.
- Behind Cloudflare you can also turn on HSTS in its SSL/TLS settings; keep the CSP here, because it depends on what the app loads.

## Package manager

This repo uses **Bun** (`bun.lock` is committed): `bun install`, `bun run dev`, `bun run <script>`.
