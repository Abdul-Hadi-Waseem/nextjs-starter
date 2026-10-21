<h1 align="center">nextjs-starter</h1>

<div align="center">A Next.js 16 + shadcn/ui dashboard starter with Claude Code skills built in, so your agent writes code the project's way.</div>

<br />

<div align="center">
  <img src="/public/images/dashboard.webp" alt="Dashboard screenshot" style="max-width: 100%; border-radius: 8px;" />
</div>

## Overview

A dashboard starter for partner portals, internal tools and admin panels. It ships a working partner-payouts dashboard (overview, partners, payouts, settings) on a mock API, so tables, forms and charts work end to end. The repo also ships Claude Code skills and conventions so every developer's agent follows the same patterns.

## Tech Stack

- Framework: [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript
- Styling: [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com)
- Charts: [Recharts](https://recharts.org)
- Data fetching: [TanStack Query](https://tanstack.com/query) (server prefetch + client cache)
- Tables: [TanStack Table](https://tanstack.com/table) with URL state via [nuqs](https://nuqs.47ng.com)
- Forms: [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev)
- Command palette: [kbar](https://kbar.vercel.app)
- Lint / format: [Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter), with [Husky](https://typicode.github.io/husky) pre-commit hooks

## Pages

### App pages

The partner-payouts dashboard. Copy these when you build a feature.

| Page | Route | Notes |
| :--- | :--- | :--- |
| Products | `/dashboard/examples/tables/products` | Table with URL state, create/edit page with an image upload. |
| Users | `/dashboard/examples/tables/users` | Table with a sheet form. Admin only. |
| Forms | `/dashboard/examples/forms/{basic,multi-step,sheet-form,advanced}` | Every field component, multi-step wizard, sheet and dialog forms, advanced patterns. |
| React Query | `/dashboard/examples/data-fetching/react-query` | Server prefetch, `HydrationBoundary` and `useSuspenseQuery` against a public API (PokeAPI). |
| Public vs signed-in | `/dashboard/examples/data-fetching/public-vs-auth` | `auth: false` call prefetched on the server next to a signed-in call in the browser, and what each returns without a cookie. |
| Caching | `/dashboard/examples/data-fetching/caching` | Public data in the Next.js server cache with a tag and `updateTag`; per-user data in TanStack Query only (`staleTime`/`gcTime`); `Cache-Control` headers. |
| Pagination | `/dashboard/examples/data-fetching/pagination` | `keepPreviousData`, page in the URL, next page prefetched. |
| Infinite list | `/dashboard/examples/data-fetching/infinite` | `useSuspenseInfiniteQuery` with Load more. |
| Dependent & parallel | `/dashboard/examples/data-fetching/dependent` | `enabled` for a query that waits on a pick; `useSuspenseQueries`. |
| Prefetch on intent | `/dashboard/examples/data-fetching/prefetch` | `prefetchQuery` on hover and focus. |
| Polling, select & cancel | `/dashboard/examples/data-fetching/polling` | `refetchInterval`, `isFetching` vs `isPending`, `select`, request cancellation via `signal`. |
| Optimistic updates | `/dashboard/examples/data-fetching/optimistic` | Cache update with rollback, rendering pending variables, `useIsMutating`/`useMutationState`, a switch that fails the next request. |
| Server component | `/dashboard/examples/server/server-component` | Async server component calling `api.get` with the forwarded cookie, streamed in `<Suspense>`. |
| Server action | `/dashboard/examples/server/server-action` | `useActionState` form; the action checks the session, validates with zod, calls the backend and calls `refresh()`. |
| Route handler proxy | `/dashboard/examples/server/route-handler` | BFF route that adds a server-only `BACKEND_API_KEY`, with an allowlist and a timeout. |
| Access control | `/dashboard/examples/access` (+ `/access/admin`) | `hasAccess` in a client component, `requireAccess` on an admin-only page, nav `access`. |
| Client state | `/dashboard/examples/client-state` | Zustand store with `persist` + `skipHydration` and one-field selectors. |
| Icons | `/dashboard/examples/icons` | Every icon in `@/components/icons`. |

They are safe to delete. Remove `src/app/dashboard/examples`, the feature folder `src/features/examples`, their mock routes `src/app/api/{examples,products,users}`, their mock stores `src/app/api/_mock/db/{examples,products,users}.ts` and `src/app/api/_mock/failure.ts`, `BACKEND_API_KEY` in `src/env.ts` and `.env.example` (unless you keep a BFF route), and the **Examples** group (with its `@/features/examples` import) in `src/config/nav-config.ts`. Then drop the example image hosts in `src/config/images.ts`, `pokeapi.co` in `src/config/security-headers.ts`, and run `bun run typecheck` to find anything left over.

## Folder Structure

```plaintext
src/
├── app/            # App Router: dashboard routes, dashboard/examples, API routes (mocks in api/_mock/)
├── components/     # Shared UI: ui/, layout/, forms/, data-table/, themes/, kbar/
├── features/       # Feature modules: auth, overview, partners, payouts, settings (+ examples/)
├── lib/            # API client, query client, form setup, data-table/ helpers, utils
├── hooks/          # Custom hooks
├── config/         # Navigation, site name, security headers, image hosts
├── stores/         # Shared Zustand stores
├── styles/         # Global CSS and themes
└── types/          # Shared types
```

What goes where, and the `shared/` rule: [docs/frontend.md "Folder structure"](docs/frontend.md#folder-structure).

## Getting Started

On GitHub, click **Use this template**, or clone the repo:

```bash
git clone https://github.com/Abdul-Hadi-Waseem/nextjs-starter.git
cd nextjs-starter
bun run setup            # installs deps and enables the git hooks
cp .env.example .env.local
bun run dev
```

The app runs at http://localhost:3000. For a production build, set `NEXT_PUBLIC_API_URL` to your backend; the build fails without it, and the built-in mock API is switched off in production.

**Git hooks** (Husky): `pre-commit` formats and lints staged files; `pre-push` runs every gate (format, typecheck, lint, image policy, build, bundle budget) and blocks the push if any fail. `git push --no-verify` skips it, so treat that as an emergency exit only. npm works too; Bun is preferred.

## What's built in

- **API layer** (`src/lib/api`): one client for public and authenticated calls. The httpOnly cookie is sent from the browser and forwarded on the server.
- **Auth**: route protection in `src/proxy.ts`, sign-in page, global 401 handling, role-based nav and page guards.
- **Performance gates on every push** (Husky pre-push): per-route JS budget (`bundle:check`) and image policy (`images:check`).
- **Images**: WebP/AVIF only; built-in optimizer, Cloudflare transforms or no resizing, chosen by an env var.

## Working with Claude Code

- `CLAUDE.md`: the project rules Claude follows.
- `.claude/skills/`: `nextjs-starter` (how to add features here), `figma-to-code`, plus Next.js, React, shadcn and TanStack skills.
- `.claude/agents/frontend-reviewer.md`: reviews a feature before you commit.
- Hooks: every file Claude edits is formatted and linted, and the typecheck runs before Claude finishes.
- **Figma**: the Figma MCP server is preconfigured in `.mcp.json`. Run `/mcp` → **figma** → **Authenticate** once. It needs a Figma Dev or Full seat; free seats get only ~6 calls a month.

## Documentation

- [docs/frontend.md](./docs/frontend.md): where features, auth, images and components go
- [docs/data-fetching.md](./docs/data-fetching.md): queries, mutations, caching and server-side calls
- [docs/forms.md](./docs/forms.md): the form system
- [docs/themes.md](./docs/themes.md): themes and fonts

## Deploy

Deploy to Vercel, or use the included Node.js and Bun Dockerfiles (Next.js standalone output). See [docs/deployment.md](./docs/deployment.md).

## Credits

Created by [Abdul Hadi Waseem](https://github.com/Abdul-Hadi-Waseem) as [nextjs-starter](https://github.com/Abdul-Hadi-Waseem/nextjs-starter). If you start a project from this template, please keep this line and the [LICENSE](./LICENSE).

Built on [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) by [Kiranism](https://github.com/Kiranism), used under the MIT License. Thank you for the excellent foundation.

## License

[MIT](./LICENSE)
