<h1 align="center">nextjs-starter</h1>

<div align="center">A Next.js 16 + shadcn/ui dashboard starter with Claude Code skills built in, so your agent writes code the project's way.</div>

<br />

<div align="center">
  <img src="/public/images/dashboard.webp" alt="Dashboard screenshot" style="max-width: 100%; border-radius: 8px;" />
</div>

## Overview

A dashboard starter for partner portals, internal tools and admin panels. Tables, forms and charts work end to end, and the repo ships with Claude Code skills and conventions so every developer's agent follows the same patterns.

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

| Page | Notes |
| :--- | :--- |
| Dashboard Overview | Cards and charts. Parallel routes give each section its own loading and error state. |
| Products (table) | TanStack Table + React Query with nuqs URL state for search, filter and pagination. |
| Create / edit product | TanStack Form + Zod with `useMutation`; the cache is invalidated on success. |
| Users (table) | Same setup as Products. |
| Forms examples | Basic, advanced, multi-step and sheet forms. |
| React Query demo | Server prefetch, `HydrationBoundary` and `useSuspenseQuery` with a client cache. |

## Folder Structure

```plaintext
src/
├── app/            # App Router: dashboard routes and API routes
├── components/     # Shared UI: ui/, layout/, forms/, data-table/, themes/, kbar/
├── features/       # Feature modules: overview, products, users, forms, ...
├── lib/            # query client, search params, form setup, utils
├── hooks/          # Custom hooks
├── config/         # Navigation and infobar config
├── constants/      # Mock data
├── styles/         # Global CSS and themes
└── types/          # Shared types
```

## Getting Started

On GitHub, click **Use this template**, or clone the repo:

```bash
git clone https://github.com/Abdul-Hadi-Waseem/nextjs-starter.git
cd nextjs-starter
bun install
cp env.example.txt .env.local
bun run dev
```

The app runs at http://localhost:3000. npm works too; Bun is preferred.

## What's built in

- **API layer** (`src/lib/api`): one client for public and authenticated calls. The httpOnly cookie is sent from the browser and forwarded on the server.
- **Auth**: route protection in `src/proxy.ts`, sign-in page, global 401 handling, role-based nav and page guards.
- **Performance gates in CI**: per-route JS budget (`bundle:check`), image policy (`images:check`), bundle analysis report on every push.
- **Images**: WebP/AVIF only; built-in optimizer, Cloudflare transforms or no resizing, chosen by an env var.

## Working with Claude Code

- `CLAUDE.md`: the project rules Claude follows.
- `.claude/skills/`: `nextjs-starter` (how to add features here), `figma-to-code`, plus Next.js, React, shadcn and TanStack skills.
- `.claude/agents/frontend-reviewer.md`: reviews a feature before you commit.
- Hooks: every file Claude edits is formatted and linted, and the typecheck runs before Claude finishes.
- **Figma**: the Figma MCP server is preconfigured in `.mcp.json`. Run `/mcp` → **figma** → **Authenticate** once. It needs a Figma Dev or Full seat; free seats get only ~6 calls a month.

## Documentation

- [docs/frontend.md](./docs/frontend.md): where queries, mutations, auth, images and components go
- [docs/forms.md](./docs/forms.md): the form system
- [docs/themes.md](./docs/themes.md): themes and fonts

## Deploy

Deploy to Vercel, or use the included Node.js and Bun Dockerfiles (Next.js standalone output). See [docs/deployment.md](./docs/deployment.md).

## Credits

Built on [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) by [Kiranism](https://github.com/Kiranism), used under the MIT License. Thank you for the excellent foundation.

## License

[MIT](./LICENSE)
