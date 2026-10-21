# CLAUDE.md

This is a Next.js 16 + shadcn/ui admin dashboard starter kit. Package manager: **bun**.

## Key References

- **[AGENTS.md](./AGENTS.md)** — Full project overview, tech stack, structure, conventions, data fetching patterns, deployment
- **[docs/frontend.md](./docs/frontend.md)** — Where things go: folder structure and the shared/ rule, queries, mutations, public vs authenticated fetches, env vars, shadcn, images, bundle analysis
- **[docs/data-fetching.md](./docs/data-fetching.md)** — React Query and `api`: keys, prefetch + hydration, defaults, caching rules (public → server cache with tags, per-user → TanStack Query only), invalidation, optimistic updates, pagination, infinite, polling, cancellation, server components / actions / route handlers
- **[docs/forms.md](./docs/forms.md)** — Form system: TanStack Form + Zod, composable fields, validation, sheet/dialog forms, heavy fields
- **[docs/themes.md](./docs/themes.md)** — Theme system: OKLCH colors, adding themes, font config
- **[docs/deployment.md](./docs/deployment.md)** — Deployment: Vercel, production environment variables, Docker

## Critical Conventions

- **React performance**: follow `.claude/skills/vercel-react-best-practices` (64 rules, by impact) and `.claude/skills/vercel-composition-patterns` when writing or reviewing components; the reviewer checks against them
- **Review (mandatory)** — after any change under `src/`, `next.config.ts`, `package.json` or `src/config`, run the `frontend-reviewer` agent (or `/review`) before saying the work is done; fix every Must-fix item and re-run it until the verdict is **ready**
- **React Query** for all data fetching — `void prefetchQuery()` on server + `useSuspenseQuery` on client (standard TanStack pattern), `useMutation` for forms, `HydrationBoundary` + `dehydrate` for hydration, `<Suspense fallback>` for streaming
- **API layer** per feature — `api/types.ts` → `api/service.ts` → `api/queries.ts` + `api/mutations.ts`; queries use key factories (`entityKeys.all/list/detail`); components import from service, queries and mutations, never from mock APIs directly
- **HTTP** — services call `api.get/post/put/patch/delete` from `@/lib/api`, never `fetch` directly; authenticated by default (httpOnly cookie sent from the browser, forwarded on the server), `{ auth: false }` for public endpoints; errors are `ApiError` (check with `isApiError`)
- **Auth** — the backend owns the session cookie; `src/proxy.ts` only redirects when it's missing; 401s are handled globally in `src/lib/query-client.ts`, so don't add per-component 401 handling; the mock API in `src/app/api` is dev/demo only (404 in production unless `ENABLE_MOCK_API=true`), and production builds require `NEXT_PUBLIC_API_URL`
- **nuqs** for URL search params — a per-feature `createSearchParamsCache` on server (e.g. `partnersSearchParamsCache`), `useQueryStates` with the same parsers on client, use `getSortingStateParser` for sort (same parser as `useDataTable`)
- **Icons** — only import from `@/components/icons`, never from `@tabler/icons-react` directly
- **Forms** — `useAppForm` from `@/lib/form` (TanStack `createFormHook`) + `form.AppField` rendering the field components in `@/components/forms/fields` (`field.TextField`, `field.SelectField`, …); each component is the shadcn TanStack Form doc anatomy; raw `form.Field` for one-off custom fields; form-level Zod `onSubmit` validators
- **Page headers** — use `PageContainer` props (`pageTitle`, `pageDescription`, `pageHeaderAction`), never import `<Heading>` manually
- **Where files go** — feature folders hold only folders (`api/`, `actions/`, `components/`, `constants/`, `hooks/`, `lib/`, `schemas/`, `stores/`); code lives in the nearest common parent: one feature → inside it, 2+ sub-modules of one area → that area's `shared/`, 2+ features → `src/components`, `src/hooks`, `src/lib`, `src/stores` (no `src/shared`); mocks only in `src/app/api/_mock/` (stores in `db/`); full guide and the "I'm adding X → put it in Y" table: [docs/frontend.md "Folder structure"](./docs/frontend.md#folder-structure)
- **Design principles** — SRP (one reason to change per file/component/hook; split UI, data and logic), DRY (reuse the shared helper/component; before writing one, grep for an existing one; a second copy means move it per **Where files go**), KISS (the simplest thing that meets the requirement; no speculative abstractions, wrappers or options nobody uses)
- **Formatting** — single quotes, JSX single quotes, no trailing comma, 2-space indent
- **Access control** — `access: { role: ROLE.X }` on nav items + `await requireAccess({ role: ROLE.X })` on the page; the backend enforces it too
- **Performance** — `bun run bundle:check` must pass (per-route budget in `bundle-budget.json`); heavy client-only libraries via `next/dynamic`; heavy form fields imported directly, not registered in `@/lib/form`
- **Images** — files only in `public/`; `next/image` with `sizes` (raw `<img>` is a lint error); WebP/AVIF/SVG only, under 300 KB (`bun run images:check`); loader chosen by `NEXT_PUBLIC_IMAGE_LOADER`, never hardcoded

## Claude setup in this repo

- Skills: `.claude/skills/nextjs-starter` (how to build features here), `.claude/skills/figma-to-code` (Figma MCP → components with the project's tokens), plus Next.js, React, shadcn, TanStack and design skills. `.agents/skills` links to the same folder for other agents.
- Agent: `.claude/agents/frontend-reviewer.md` — read-only review of data layer, security, bundle, performance, images, accessibility and conventions; reports Must fix / Should fix / Nit and a verdict. Required after every code change (see Review above).
- Command: `/review [path | ref] [full]` (`.claude/commands/review.md`) runs that agent on the current changes and summarizes the verdict.
- Hooks (`.claude/settings.json`): every edited file is formatted and linted; the typecheck runs before Claude finishes; if code changed and that diff wasn't reviewed, Claude is asked once to run the reviewer before finishing (`.claude/hooks/review-on-stop.mjs`).
- MCP: Figma's remote server in `.mcp.json` (authenticate once via `/mcp`; needs a Dev or Full seat).
- **Env** — declare every variable in `src/env.ts` (zod) and add it to `.env.example`; server code reads `env` from `@/env`, browser code reads `PUBLIC_ENV` from `@/lib/public-env` (keeps zod out of the bundle); never `process.env` elsewhere
- **Security headers / CSP** — `src/config/security-headers.ts`; add third-party origins there and image hosts in `src/config/images.ts`
- **Branding** — app name/description only in `src/config/site.ts` (`SITE`)
- **Loading states** — `loading.tsx` reuses the page's shell (same header) and skeletons match real sizes; no layout shift
- **Debugging re-renders** — `bun run dev:scan` (React Scan + React Query devtools, dev only)
- **After `shadcn add`** — `bun run format`; colors in `cva()` must be tokens (`cn` comes from shadcn's `cn` package; `from 'cn'` and `from '@/lib/utils'` are the same function); fix the design via tokens → a `cva` variant → `className`, in that order (docs/frontend.md)
- **Client state** — TanStack Query (server), nuqs (URL), TanStack Form (forms); Zustand only for client-only state shared across components (`src/stores/` shared, `src/features/<name>/stores/` per feature)
- **New colors** — add a semantic token once in `src/styles/theme.css` (`:root`, `.dark`, and `--color-*` in `@theme inline`); never hex/oklch literals in components; per-theme overrides go in `src/styles/themes/<name>.css`
- **New feature recipe** — tokens → shadcn add + variant → feature components → `api/` data layer + mock route → page + `loading.tsx` sharing a `<Name>PageShell` → nav/access → `dev`, `dev:scan`, push (full steps: docs/frontend.md "Adding a feature")

