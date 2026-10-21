# Frontend Guide

Where things go in this repo, and why. Read this before adding a feature.

## Folder structure

This section is the one full guide to where files go. CLAUDE.md, AGENTS.md and the `nextjs-starter` skill only link here.

```plaintext
src/
├── app/                      # Routes only: thin page.tsx / loading.tsx / error.tsx / layout.tsx
│   ├── dashboard/<name>/     # One folder per page (examples/ holds the reference pages)
│   └── api/                  # Route handlers (the mock backend until a real one exists)
│       ├── <name>/route.ts   # One handler per resource
│       └── _mock/            # Everything mock: guard, auth, validation, cache-control helpers
│           └── db/           # Fake data stores (partners.ts, payouts.ts, …, utils.ts)
├── features/<name>/          # Everything one feature owns (folders only, see below)
├── components/               # UI used by 2+ features: ui/ (shadcn), layout/, data-table/, forms/, icons.tsx, …
├── hooks/                    # Hooks used by 2+ features
├── lib/                      # Helpers used by 2+ features; related files grouped (lib/api/, lib/data-table/)
├── stores/                   # Zustand stores used by 2+ features
├── config/                   # Nav, site name, security headers, image hosts
├── styles/                   # theme.css (tokens), themes/<name>.css, globals.css
└── types/                    # Types shared by 2+ features (NavItem, PermissionCheck)
```

### A feature folder

`src/features/<name>/` holds **only folders**, never loose files. Use the ones you need from this list:

```plaintext
src/features/payouts/
├── api/          # types.ts, service.ts (the ONLY file that talks to the backend), queries.ts, mutations.ts
├── actions/      # Server actions ('use server')
├── components/   # Feature UI: listing, table, form, page shell, skeletons
├── constants/    # as const objects, options, routes, info-content.ts
├── hooks/        # Hooks only this feature uses
├── lib/          # Helpers: URL parsers, form helpers, mappers
├── schemas/      # Zod schemas
└── stores/       # Zustand stores only this feature uses
```

Routes in `src/app/` stay thin: a `page.tsx` reads params and renders a feature component. Copy `features/partners` (table + detail page) or `features/payouts` (table + sheet form) when you start a feature.

### The `shared/` rule: the nearest common parent

Code lives in the closest folder that contains every place that uses it.

- Used by one feature (or one sub-module): inside it.
- Used by 2+ sub-modules of one area: that area's `shared/` folder, with the same sub-folders as a feature (`src/features/examples/shared/{api,components,constants,lib}`).
- Used by 2+ features: the app-level folders `src/components`, `src/hooks`, `src/lib`, `src/stores`, `src/types`. There is no `src/shared`; those folders are the app's shared level.
- Start at the lowest level and move code up only when a second user appears.
- Exception: a domain component tied to one feature's constants stays in that feature, and others import it (overview and partners import `PayoutStatusBadge` from `features/payouts`).

### Naming

- Files are kebab-case. Hooks are `use-<name>.ts`, and `.tsx` only when they render JSX.
- Related helpers in `src/lib` share a sub-folder (`src/lib/data-table/{features,filters,parsers,types,utils}.ts`), not a filename prefix.

### Mocks

All mock code is under `src/app/api/_mock/`, and the fake data stores are in `src/app/api/_mock/db/`. Route handlers import them; features and components never do (they go through `api/service.ts`). The feature owns each data shape in its `api/types.ts`, and the store imports it from there. To switch to a real backend, delete `src/app/api/_mock` and the mock route handlers, drop the `MOCK_API_ENABLED` demo hint in `src/app/auth/sign-in/page.tsx`, then set `NEXT_PUBLIC_API_URL`.

### Examples

The reference pages under `src/app/dashboard/examples` (sidebar → Examples) show patterns the app doesn't use yet. Their code is one area, `src/features/examples/`, with one sub-module per topic (`access/`, `client-state/`, `data-fetching/`, `data-fetching/react-query/`, `server-side/`, `tables/products/`, `tables/users/`, `forms/`, `icons/`). Code that several topics use is in `src/features/examples/shared/`. The whole area is safe to delete (see README).

### I'm adding X → put it in Y

| I'm adding | Put it in |
| --- | --- |
| Page | `src/app/dashboard/<name>/page.tsx` + `loading.tsx`, both rendering the feature's `<Name>PageShell` |
| Route handler | `src/app/api/<name>/route.ts` (mock: `mockApiDisabled()` + `requireSession(request)` first) |
| Server action | `src/features/<name>/actions/<verb-noun>.ts` |
| Query / mutation | `src/features/<name>/api/queries.ts` / `api/mutations.ts`; the call itself in `api/service.ts` |
| Component used by 1 feature | `src/features/<name>/components/` |
| Component used by 2+ sub-modules of one area | `<area>/shared/components/` (e.g. `src/features/examples/shared/components/`) |
| Component used by 2+ features | `src/components/` (shadcn primitives in `src/components/ui/`) |
| Hook | `src/features/<name>/hooks/use-<name>.ts`; used by 2+ features: `src/hooks/` |
| Store (Zustand) | `src/features/<name>/stores/`; used by 2+ features: `src/stores/` |
| Schema (zod) | `src/features/<name>/schemas/` |
| Constant | `src/features/<name>/constants/<topic>.ts` as an `as const` object; others import it from the owning feature; app-wide settings in `src/config/` |
| Helper | `src/features/<name>/lib/`; used by 2+ features: `src/lib/` (grouped in a sub-folder when related) |
| Shared type | `src/features/<name>/api/types.ts`; used by 2+ features: `src/types/` |
| Mock data | `src/app/api/_mock/db/<name>.ts` |
| Image | `public/images/` (WebP/AVIF/SVG under 300 KB, rendered with `next/image`) |
| Style token (color) | `src/styles/theme.css` (`:root`, `.dark`, `@theme inline`); per-theme overrides in `src/styles/themes/<name>.css` |

## Data fetching and caching

Queries, mutations, the `api` client, caching rules (server cache for public data only, TanStack Query for per-user data, `Cache-Control` headers), optimistic updates, pagination and server-side calls: **[docs/data-fetching.md](./data-fetching.md)**.

## Authentication


The backend issues the auth token as an **httpOnly cookie**. The frontend never reads or stores the token.

- **`src/proxy.ts`** (Next.js 16's middleware) redirects `/dashboard/*` to `/auth/sign-in?next=…` when the cookie is missing, and sends signed-in users away from the sign-in page. It only checks that the cookie exists; the backend verifies it on every request.
- **401 responses**: the query client (`src/lib/query-client.ts`) clears the cache and redirects to sign-in. 4xx errors are never retried.
- **`src/features/auth`**: `login`, `logout`, `getMe` in `api/service.ts`; `meQueryOptions` in `api/queries.ts`; `loginMutation` and `logoutMutation` (which clears the whole cache) in `api/mutations.ts`.
- **On by default.** Without the session cookie, `/dashboard/*` redirects to sign-in. `NEXT_PUBLIC_AUTH_ENABLED=false` opens everything (demo only). Set `AUTH_COOKIE_NAME` to the cookie your backend sets.
- **Sign-in page** (`src/app/auth/sign-in`): with the mock API on, it shows a demo hint and a "Fill demo admin" button. Swapping to your backend needs no UI change: `login` in `src/features/auth/api/service.ts` posts to `/auth/login` on `NEXT_PUBLIC_API_URL`, and the backend sets the cookie.

**Mock backend.** Out of the box, `NEXT_PUBLIC_API_URL` points at this app's own route handlers in `src/app/api/` (`overview`, `partners`, `payouts`, `team`, `auth/login|logout|me`). With auth enabled they return 401 without the cookie, just like a real backend. Point `NEXT_PUBLIC_API_URL` at your backend and delete `src/app/api/` when you connect a real one.

Two production safeguards:

- **The mock API is off in production.** Every mock handler answers 404 unless `ENABLE_MOCK_API=true`. Only set that for a demo deployment; the mock login accepts any password.
- **`NEXT_PUBLIC_API_URL` is required.** `src/env.ts` validates it on dev start and build, so a deployment can't silently call `localhost`.

**Backend checklist** for cookie auth to work and stay safe:

1. Cookie flags: `HttpOnly; Secure; SameSite=Lax; Path=/`, short expiry, refresh-token rotation.
2. Frontend and backend on the same parent domain (`app.example.com` + `api.example.com`), with the cookie set for that domain.
3. CORS: `Access-Control-Allow-Credentials: true` and the exact frontend origin, never `*`.
4. CSRF: reject POST/PUT/PATCH/DELETE requests whose `Origin` isn't the frontend.

## Environment variables

- **Every variable is declared in `src/env.ts`** with a zod schema (`@t3-oss/env-nextjs`). `bun run dev` and `bun run build` stop with "Invalid environment variables" when one is missing or wrong. Start with `cp .env.example .env.local`.
- Server code reads `env` from `@/env`. Browser code reads `PUBLIC_ENV` from `@/lib/public-env`: the same values (inlined at build, already validated), without shipping zod to every page. Never read `process.env` elsewhere.
- Only `NEXT_PUBLIC_` variables (the `client` block) reach the browser, and anyone can read them. Secrets go in the `server` block; reading one in client code throws.
- Adding a variable: add its schema to `src/env.ts` (`NEXT_PUBLIC_*` also need a line in `experimental__runtimeEnv`; server vars don't) and add it to `.env.example`; if browser code needs it, also to `src/lib/public-env.ts`.

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

## Adding a feature (with new colors, shadcn and hand-made components)

1. **New colors → a semantic token, once.** Add it to `src/styles/theme.css` (shared by all themes), never as hex in a component:
   ```css
   :root { --success: oklch(0.62 0.16 150); --success-foreground: oklch(0.98 0 0); }
   .dark { --success: oklch(0.72 0.16 150); --success-foreground: oklch(0.2 0 0); }
   @theme inline {
     --color-success: var(--success);
     --color-success-foreground: var(--success-foreground);
   }
   ```
   Then `bg-success`, `text-success`, `bg-success/10` work everywhere. A theme that needs its own value overrides `--success` in `src/styles/themes/<name>.css`.
2. **shadcn component** → `bunx shadcn@latest add <name>` (lands in `src/components/ui/`), `bun run format`, and give it a variant that uses the token (e.g. `success: 'bg-success/10 text-success'` in its `cva()`).
3. **Hand-made components** → placed by the [`shared/` rule](#the-shared-rule-the-nearest-common-parent): the feature first, `src/components/` once a second feature uses them. Build them from `ui/` primitives and tokens.
4. **Data** → `api/types.ts`, `api/service.ts` (`api` from `@/lib/api`), `api/queries.ts`, `api/mutations.ts`; mock endpoint `src/app/api/<name>/route.ts` (call `mockApiDisabled()` and `requireSession()` first) until the real one exists.
5. **Page** → `src/app/dashboard/<name>/page.tsx` and `loading.tsx`, both wrapped in the feature's `<Name>PageShell` (same header, no layout shift); nav entry in `src/config/nav-config.ts` with `access` if restricted (+ `requireAccess` on the page).
6. **Check** → `bun run dev` (light + dark, switch themes), `bun run dev:scan` (no stray re-renders), then push: the pre-push hook runs every gate.

## Client state (Zustand)

Most state already has a home: server data in TanStack Query, URL state (filters, pagination, tabs) in nuqs, form state in TanStack Form. Use Zustand only for **client-only state shared by components that aren't parent and child**.

- Store used by one feature: `src/features/<name>/stores/`. Shared store: `src/stores/`.
- Example: `src/stores/ui-preferences.ts` (table density, toggled from the table toolbar, remembered per browser). It persists to localStorage with `skipHydration`, and `PreferencesHydrator` loads it after mount, so server and client render the same HTML first.
- Reference page: `/dashboard/examples/client-state` (one-field selectors, `persist` + `skipHydration`, a per-store hydrator).
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

- Roles live in `ROLE` (`src/features/auth/constants/auth.ts`); the signed-in user (`/auth/me`) has a `role` and `permissions`.
- **Nav items**: `access: { role: ROLE.ADMIN }` or `{ permission: 'team:write' }` in `src/config/nav-config.ts`. Items the user can't access are hidden from the sidebar and Cmd+K.
- **Pages**: `await requireAccess({ role: ROLE.ADMIN })` at the top of the server page. Signed-out users go to sign-in; users without access get a 404.
- Hiding links is UX only. **The backend must enforce the same rule** on its endpoints.
- With `NEXT_PUBLIC_AUTH_ENABLED=false` (demo), everything is visible.
- Mock backend: emails starting with `admin` sign in as admin, any other email as member.
- Reference page: `/dashboard/examples/access` (`hasAccess` in a client component, `requireAccess` on `/dashboard/examples/access/admin`).

## Name and branding

The app name and description live in `src/config/site.ts` (`SITE`). Titles, metadata, the sidebar and the sign-in page read from it, so renaming the template is a one-line change.

## Debugging re-renders

`bun run dev:scan` starts dev in debug mode: [React Scan](https://github.com/aidenybai/react-scan) outlines each component as it re-renders (and counts renders), and the React Query devtools appear. Plain `bun run dev` loads neither, and neither ever ships to production.

## Loading states without layout shift

- A page's `loading.tsx` renders the same page shell as the page (see `PartnersPageShell` in `src/features/partners/components/partners-page-shell.tsx`), so the title and actions don't move when data arrives.
- Skeletons use the real sizes of what they stand in for (fixed chart height in `src/features/overview/constants/chart.ts`, real chart headers, `h-lh` text placeholders).
- Check with Chrome DevTools > Performance (Layout Shift) or Lighthouse; aim for CLS 0.
- `<Skeleton>` stays invisible for its first 150ms, then fades in (`animate-skeleton` in `src/styles/globals.css`), so fast loads show nothing instead of a flash. Build placeholders from `<Skeleton>`, not raw `bg-muted` divs. Busy dimming works the same way: add the delay only in the busy state (`isStale && 'opacity-60 delay-150'`), so a fast answer never blinks.
- Use parallel routes only when sections have independent data sources; sections that read one query belong in one page with one `loading.tsx` (see `src/app/dashboard/overview`).

## Security headers

`next.config.ts` sends these on every response (built in `src/config/security-headers.ts`): Content-Security-Policy, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and HSTS in production.

- The CSP allows the API origin (`NEXT_PUBLIC_API_URL`), the image hosts in `src/config/images.ts` and the Cloudflare image origin. Add a new third-party origin there, not inline.
- It's a static CSP, so scripts allow `'unsafe-inline'` (Next.js injects inline hydration scripts). For a stricter policy, move to a nonce-based CSP in `src/proxy.ts`; see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.
- Behind Cloudflare you can also turn on HSTS in its SSL/TLS settings; keep the CSP here, because it depends on what the app loads.

## Package manager

This repo uses **Bun** (`bun.lock` is committed): `bun install`, `bun run dev`, `bun run <script>`.
