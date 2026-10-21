---
name: nextjs-starter
description: |
  Guide for building features, pages, tables, forms, themes, and navigation in this Next.js 16 shadcn dashboard template. Use this skill whenever the user wants to add a new page, create a feature module, build a data table, add a form, configure navigation items, add a theme, set up role-based access, call the backend, or work with the dashboard's patterns and conventions. Also triggers when adding routes under /dashboard, wiring a service to an API, working with auth, adding images, or modifying the sidebar. Even if the user doesn't mention "dashboard" explicitly — if they're adding UI, pages, or features to this project, use this skill.
---

# Dashboard Development Guide

This skill encodes the exact patterns and conventions used in this Next.js 16 + shadcn/ui admin dashboard template. Following these patterns ensures consistency across the codebase.

## Quick Reference: What Goes Where

Where a new file goes (page, route handler, server action, query/mutation, component, hook, store, schema, constant, mock data, image, style token) and the `shared/` nearest-common-parent rule: the "I'm adding X → put it in Y" table in [docs/frontend.md "Folder structure"](../../../docs/frontend.md#folder-structure). Check it before creating any file.

Existing shared pieces to reuse:

| Piece             | Location                                                    |
| ----------------- | ----------------------------------------------------------- |
| HTTP client       | `src/lib/api` (`api.get/post/put/patch/delete`)             |
| Query client      | `src/lib/query-client.ts`                                   |
| Auth / roles      | `src/features/auth` (`ROLE`, `hasAccess`, `requireAccess`)  |
| Mock helpers      | `src/app/api/_mock/` (`mockApiDisabled`, `requireSession`)  |
| Nav item          | `src/config/nav-config.ts`                                  |
| Form components   | `src/components/forms/`                                     |
| Table components  | `src/components/data-table/` + `src/lib/data-table/`        |
| Icons registry    | `src/components/icons.tsx`                                  |

---

## Adding a New Feature (End-to-End)

When a user asks to add a feature (e.g. "add an orders page"), copy the shape of `src/features/partners` (table + detail) or `src/features/payouts` (table + sheet form); `src/app/dashboard/examples` holds extra reference pages (every form field, multi-step, React Query against a public API). Do all of these in order:

0. **Colors**: any new color becomes a semantic token in `src/styles/theme.css` (`:root` + `.dark` values and `--color-<name>` in `@theme inline`), then use `bg-<name>` / `text-<name>`. Never hex in components. New shadcn components: `bunx shadcn@latest add`, then add a token-based variant to their `cva()`.
1. **Types**: `src/features/<name>/api/types.ts` (response, filters, mutation payload).
2. **Service**: `src/features/<name>/api/service.ts`. Every call goes through `api` from `@/lib/api`; never `fetch` directly. Authenticated by default; `{ auth: false }` for public endpoints.
3. **Queries**: `api/queries.ts`, with a key factory (`orderKeys.all/list/detail`) plus `queryOptions`.
4. **Mutations**: `api/mutations.ts`, with `mutationOptions` that invalidate `orderKeys.all` on success.
5. **Mock backend** (only if the real endpoint doesn't exist yet): `src/app/api/<name>/route.ts`. Call `mockApiDisabled()` then `requireSession(request)` first, like `src/app/api/partners/route.ts`.
6. **Components**: listing (server prefetch + `HydrationBoundary`), table, form, under `src/features/<name>/components/`. Every other new file (action, hook, store, constant, schema, mock data) goes where the table in docs/frontend.md "Folder structure" says.
7. **Page**: `src/app/dashboard/<name>/page.tsx` + `loading.tsx`, both wrapped in a `<Name>PageShell` component (title, description, header action) so the header doesn't move when data loads. If it's restricted: `await requireAccess({ role: ROLE.ADMIN })` first.
8. **Search params** (if it has a table or filters): parsers in `src/features/<name>/lib/search-params.ts`, `createSearchParamsCache` in `search-params-cache.ts` (see `src/features/partners/lib/`).
9. **Navigation**: `src/config/nav-config.ts`, with the same `access` as the page guard.
10. **Icon**: `src/components/icons.tsx` (if a new one is needed).
11. **Check**: `bun run typecheck && bun run lint && bun run build && bun run bundle:check`.
12. **Review**: run the `frontend-reviewer` agent (`/review`; other agents: the "Before you finish" checklist in AGENTS.md). Fix every Must-fix item, re-run the gates, and repeat until the verdict is **ready**.

---

## 1. Data Fetching with React Query

Full guide: `docs/data-fetching.md` (caching rules, optimistic updates, pagination, infinite, polling, cancellation, server actions, route handlers). Working examples: `src/features/examples/` (pages under `/dashboard/examples/data-fetching/*` and `/dashboard/examples/server/*`).

The project uses **TanStack React Query** for data fetching with server-side prefetching and client-side cache management. This is the default pattern for all new pages.

### Query Options (`api/queries.ts`)

Define reusable query options shared between server prefetch and client hooks:

```ts
// api/service.ts — the only file that talks to the backend
import { api } from '@/lib/api';
import type { EntitiesResponse, EntityFilters } from './types';

export async function getEntities(filters: EntityFilters) {
  return api.get<EntitiesResponse>('/entities', { query: filters });
}
```

```ts
// api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { getEntities } from './service';
import type { EntityFilters } from './types';

export const entityKeys = {
  all: ['entities'] as const,
  list: (filters: EntityFilters) => [...entityKeys.all, 'list', filters] as const
};

export const entitiesQueryOptions = (filters: EntityFilters) =>
  queryOptions({ queryKey: entityKeys.list(filters), queryFn: () => getEntities(filters) });
```

### Server Prefetch + Client Hydration (Listing Component)

```tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { entitiesQueryOptions } from '../api/queries';
import { entitiesSearchParamsCache } from '../lib/search-params-cache';
import { toEntityFilters } from '../lib/search-params';
import { EntityTable, EntityTableSkeleton } from './entity-table';
import { Suspense } from 'react';

export function EntityListing() {
  const filters = toEntityFilters(entitiesSearchParamsCache.all());

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(entitiesQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<EntityTableSkeleton />}>
        <EntityTable />
      </Suspense>
    </HydrationBoundary>
  );
}
```

### Client Table Component (`shallow: true` + `useQuery`)

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useDataTable } from '@/hooks/use-data-table';
import { entitiesQueryOptions } from '../../api/queries';
import { columns } from './columns';

export function EntityTable() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [search] = useQueryState('name');

  const filters = { page, limit: pageSize, ...(search && { search }) };

  const { data, isLoading } = useQuery(entitiesQueryOptions(filters));

  const { table } = useDataTable({
    data: data?.items ?? [],
    columns,
    pageCount: Math.ceil((data?.total_items ?? 0) / pageSize),
    shallow: true, // URL changes stay client-side — React Query handles fetching
    debounceMs: 500,
    initialState: { columnPinning: { start: [], end: ['actions'] } }
  });

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} filterCount={2} />;

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
```

**Errors and auth:** don't handle 401s in components. The query client redirects to sign-in globally and never retries 4xx errors. Use `isApiError(error)` to read `error.status` and `error.message`.

**Key points:**

- `shallow: true` — URL changes stay client-side, React Query fetches on the client
- `shallow: false` — triggers full RSC server navigation (legacy pattern, avoid for new pages)
- First load uses hydrated server-prefetched data (no loading spinner)
- Subsequent pagination/filter changes fetch on the client
- Cached pages/filters load instantly (React Query cache)

### Mutations (Forms)

```tsx
// api/mutations.ts
export const createEntityMutation = mutationOptions({
  mutationFn: (data: EntityPayload) => createEntity(data),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: entityKeys.all })
});

// component: spread the shared options, add UI side effects
const createMutation = useMutation({
  ...createEntityMutation,
  onSuccess: () => {
    toast.success('Created successfully');
    router.push('/dashboard/entities');
  },
  onError: () => toast.error('Failed to create')
});

// In useAppForm onSubmit:
onSubmit: async ({ value }) => {
  await createMutation.mutateAsync(payload);
};
```

---

## 2. Page Structure

Pages are **server components** by default. They use `PageContainer` and accept search params as a Promise (Next.js 16 pattern).

```tsx
import PageContainer from '@/components/layout/page-container';
import { EntityListing } from '@/features/entities/components/entity-listing';
import { entitiesSearchParamsCache } from '@/features/entities/lib/search-params-cache';
import type { SearchParams } from 'nuqs/server';

export const metadata = { title: 'Dashboard: Entities' };

type PageProps = { searchParams: Promise<SearchParams> };

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  entitiesSearchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Entities'
      pageDescription='Manage entities (React Query + nuqs table pattern.)'
    >
      <EntityListing />
    </PageContainer>
  );
}
```

---

## 3. Data Tables

Tables use TanStack Table v9 (DiceUI data table) with `useDataTable` hook and `nuqs` for URL state. Type columns with `DataTableFeatures` from `@/lib/data-table/features`.

### Column Definitions

```tsx
export const columns: ColumnDef<DataTableFeatures, YourType>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Name' />,
    meta: { label: 'Name', placeholder: 'Search...', variant: 'text', icon: Icons.text },
    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorKey: 'category',
    enableColumnFilter: true,
    meta: { label: 'Category', variant: 'multiSelect', options: CATEGORY_OPTIONS }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
```

### Column Pinning

```tsx
initialState: {
  columnPinning: { start: [], end: ['actions'] }
}
```

**Filter variants**: `text`, `number`, `range`, `date`, `dateRange`, `select`, `multiSelect`, `boolean`

---

## 4. Forms

See `docs/forms.md` for the full guide. Forms use **TanStack Form + Zod** via `useAppForm` from `@/lib/form` (TanStack `createFormHook`). The shadcn TanStack Form doc anatomy lives once per widget in `src/components/forms/fields/`; pages render fields as one-liners:

```tsx
import { useAppForm } from '@/lib/form';
import { FieldGroup } from '@/components/ui/field';

const form = useAppForm({
  defaultValues: { email: '', role: '' },
  validators: { onSubmit: schema }, // Zod schema — errors paint per field on submit
  onSubmit: async ({ value }) => {
    await createMutation.mutateAsync(value); // React Query mutation
  }
});

<form
  onSubmit={(e) => {
    e.preventDefault();
    form.handleSubmit();
  }}
>
  <FieldGroup>
    <form.AppField
      name='email' // typed against defaultValues — typos are compile errors
      children={(field) => <field.TextField label='Email' required type='email' />}
    />
    <form.AppField
      name='role'
      children={(field) => <field.SelectField label='Role' options={ROLE_OPTIONS} />}
    />
    <form.AppForm>
      <form.SubmitButton>Save</form.SubmitButton>
    </form.AppForm>
  </FieldGroup>
</form>
```

**Available components** (all take `label`, `description?`, `required?`): `TextField` (any input type; number converts at the edge, async-validator spinner built in), `TextareaField` (`showCount`), `SelectField`, `CheckboxField`, `SwitchField`, `RadioGroupField`, `SliderField`, `ColorField`, `CheckboxGroupField`, `TagsField`, `ToggleGroupField`.

**Heavy fields are not registered** (so every form doesn't load cmdk, react-day-picker or react-dropzone): import `ComboboxField`, `DatePickerField`, `DateRangeField`, `OtpField` or `FileUploadField` from `@/components/forms/fields/<name>-field` and render them in the render prop: `<form.AppField name='date' children={() => <DatePickerField label='Date' />} />`.

**Rules:**

- Array-valued components (`CheckboxGroupField`, `TagsField`, `ToggleGroupField`) need `mode='array'` on the `form.AppField`.
- Field-level validators/listeners (async checks, `onChangeListenTo` linked fields) go on the `form.AppField` element; function validators return `{ message: '…' }` objects.
- One-off custom fields (object-row arrays, bespoke UI) drop down to raw `form.Field` render props composing `Field`/`FieldLabel`/`FieldError` from `@/components/ui/field` — `data-invalid` on Field, `aria-invalid` on the control, `{isInvalid && <FieldError errors={field.state.meta.errors} />}`.
- Large forms split into typed sections with `withForm` from `@/lib/form` (section receives `form` as a prop; field names stay compile-checked).
- Sheet/Dialog forms: submit button in the footer via the HTML `form` attribute (`<Button type='submit' form='my-form-id'>`). Example: `src/features/payouts/components/payout-form.tsx` (sheet form, heavy fields, server field errors).
- Match the widget to the path's value type — the compiler checks the `name` path but NOT the widget/value pairing (a `SwitchField` on a string path compiles and misbehaves).
- Never call `useState` inside a render prop — extract stateful controls into components.

---

## 5. Navigation and Access Control

- **Nav**: `src/config/nav-config.ts`. Add `access: { role: ROLE.ADMIN }` or `{ permission: 'team:write' }`. `useFilteredNavGroups` (`src/hooks/use-nav.ts`) hides items the signed-in user (`/auth/me`) can't access. The Cmd+K palette uses the same filter.
- **Page guard**: `await requireAccess({ role: ROLE.ADMIN })` at the top of the server page. Signed-out users go to sign-in; users without access get a 404.
- Hiding UI is only UX. The backend must enforce the same rule.
- **Search params**: per feature in `src/features/<name>/lib/search-params.ts`. Add new params with `parseAsString`/`parseAsInteger`.
- **Icons**: `src/components/icons.tsx` is the single source of truth. Never import `@tabler/icons-react` directly.
- **Themes**: `src/styles/themes/<name>.css` with OKLCH colors, registered in `theme.config.ts`.

---

## 6. Performance Rules (enforced by the pre-push hook)

- **Bundle budget**: `bun run bundle:check` fails when a route's gzipped first-load JS goes over `bundle-budget.json`. Never just raise a limit; find what grew first (`bun run analyze`).
- **Heavy client-only libraries** (charts, editors, command palettes) load with `next/dynamic`. See `src/features/overview/components/lazy-graphs.tsx` and `src/components/kbar/lazy.tsx`.
- **Images**: files only in `public/` (usually `public/images/`); WebP/AVIF/SVG only (`bun run images:check`, max 300 KB; PNG/JPG only in `public/og/`). Always `next/image` (raw `<img>` is a lint error), with `sizes` set.
- **Image loader** via `NEXT_PUBLIC_IMAGE_LOADER`: empty = Next optimizer, `cloudflare` = edge transforms, `none` = no resizing. Don't hardcode a loader in components.

---

## 7. Adding a shadcn Component

1. `bunx shadcn@latest add <name>` (lands in `src/components/ui/`). Use `--view` to read it first, `--diff` before overwriting an edited one.
2. `bun run format`, then check the `cva()` colors are theme tokens. (`from 'cn'` in new components is fine: `@/lib/utils` re-exports the same `cn` package.)
3. To match the design: tokens in `src/styles/theme.css` / `themes/*.css` first, then a new `cva` variant in the component file, then `className` for one-offs. Composite patterns are wrappers in `src/components/`.

## 8. Where Things Go (components and state)

- Placement follows the nearest-common-parent rule in docs/frontend.md "Folder structure": one feature → inside it; 2+ sub-modules of one area → that area's `shared/`; 2+ features → `src/components`, `src/hooks`, `src/lib`. Start in the feature.
- State: TanStack Query (server data), nuqs (URL), TanStack Form (forms). Zustand only for client-only state shared across components: `src/stores/` (shared) or `src/features/<name>/stores/`. Persisted stores use `skipHydration` + `PreferencesHydrator` (see `src/stores/ui-preferences.ts`).

---

## Code Conventions

- **`cn()` for class merging** — never concatenate className strings
- **Server components by default** — only add `'use client'` when needed
- **React Query for data fetching** — `useQuery` + `shallow: true` for tables, `useMutation` (spreading shared `mutationOptions`) for forms
- **`api` for HTTP** — never `fetch` directly in features
- **Env** — declare in `src/env.ts` (zod) + `.env.example`; server code reads `env` from `@/env`, browser code reads `PUBLIC_ENV` from `@/lib/public-env`; never `process.env` elsewhere
- **New third-party origin** (API, images, scripts) — add it in `src/config/security-headers.ts` / `src/config/images.ts`, or the CSP will block it
- **nuqs for URL state** — a per-feature `createSearchParamsCache` on server, `useQueryStates` with the same parsers on client
- **Formatting**: single quotes, JSX single quotes, no trailing comma, 2-space tabs
