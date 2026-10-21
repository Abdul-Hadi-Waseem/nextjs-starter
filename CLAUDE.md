# CLAUDE.md

This is a Next.js 16 + shadcn/ui admin dashboard starter kit. Package manager: **bun**.

## Key References

- **[AGENTS.md](./AGENTS.md)** — Full project overview, tech stack, structure, conventions, data fetching patterns, deployment
- **[docs/frontend.md](./docs/frontend.md)** — Where things go: feature layout, queries, mutations, public vs authenticated fetches, env vars, shadcn, images, bundle analysis
- **[docs/forms.md](./docs/forms.md)** — Form system: TanStack Form + Zod, composable fields, validation, multi-step, sheet/dialog forms
- **[docs/themes.md](./docs/themes.md)** — Theme system: OKLCH colors, adding themes, font config
- **[docs/deployment.md](./docs/deployment.md)** — Deployment: Vercel, production environment variables, Docker

## Critical Conventions

- **React Query** for all data fetching — `void prefetchQuery()` on server + `useSuspenseQuery` on client (standard TanStack pattern), `useMutation` for forms, `HydrationBoundary` + `dehydrate` for hydration, `<Suspense fallback>` for streaming
- **API layer** per feature — `api/types.ts` → `api/service.ts` → `api/queries.ts` + `api/mutations.ts`; queries use key factories (`entityKeys.all/list/detail`); components import from service, queries and mutations, never from mock APIs directly
- **HTTP** — services call `api.get/post/put/patch/delete` from `@/lib/api`, never `fetch` directly; authenticated by default (httpOnly cookie sent from the browser, forwarded on the server), `{ auth: false }` for public endpoints; errors are `ApiError` (check with `isApiError`)
- **Auth** — the backend owns the session cookie; `src/proxy.ts` only redirects when it's missing; 401s are handled globally in `src/lib/query-client.ts`, so don't add per-component 401 handling; the mock API in `src/app/api` is dev/demo only (404 in production unless `ENABLE_MOCK_API=true`), and production builds require `NEXT_PUBLIC_API_URL`
- **nuqs** for URL search params — `searchParamsCache` on server, `useQueryStates` on client, use `getSortingStateParser` for sort (same parser as `useDataTable`)
- **Icons** — only import from `@/components/icons`, never from `@tabler/icons-react` directly
- **Forms** — `useAppForm` from `@/lib/form` (TanStack `createFormHook`) + `form.AppField` rendering the field components in `@/components/forms/fields` (`field.TextField`, `field.SelectField`, …); each component is the shadcn TanStack Form doc anatomy; raw `form.Field` for one-off custom fields; form-level Zod `onSubmit` validators
- **Page headers** — use `PageContainer` props (`pageTitle`, `pageDescription`, `pageHeaderAction`), never import `<Heading>` manually
- **Formatting** — single quotes, JSX single quotes, no trailing comma, 2-space indent
- **Access control** — `access: { role: ROLE.X }` on nav items + `await requireAccess({ role: ROLE.X })` on the page; the backend enforces it too
- **Performance** — `bun run bundle:check` must pass (per-route budget in `bundle-budget.json`); heavy client-only libraries via `next/dynamic`; heavy form fields imported directly, not registered in `@/lib/form`
- **Images** — files only in `public/`; `next/image` with `sizes` (raw `<img>` is a lint error); WebP/AVIF/SVG only, under 300 KB (`bun run images:check`); loader chosen by `NEXT_PUBLIC_IMAGE_LOADER`, never hardcoded

## Claude setup in this repo

- Skills: `.claude/skills/nextjs-starter` (how to build features here), `.claude/skills/figma-to-code` (Figma MCP → components with the project's tokens), plus Next.js, React, shadcn, TanStack and design skills. `.agents/skills` links to the same folder for other agents.
- Agent: `.claude/agents/frontend-reviewer.md` — run it after a feature, before committing.
- Hooks (`.claude/settings.json`): every edited file is formatted and linted; the typecheck runs before Claude finishes.
- MCP: Figma's remote server in `.mcp.json` (authenticate once via `/mcp`; needs a Dev or Full seat).
- **Env** — declare every variable in `src/env.ts` (zod) and read it via `env` from `@/env`, never `process.env`; add new ones to `env.example.txt` too
- **Security headers / CSP** — `src/config/security-headers.ts`; add third-party origins there and image hosts in `src/config/images.ts`
