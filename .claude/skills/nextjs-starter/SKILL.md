---
name: nextjs-starter
description: |
  Guide for building features, pages, tables, forms, themes, and navigation in this Next.js 16 shadcn dashboard template. Use this skill whenever the user wants to add a new page, create a feature module, build a data table, add a form, configure navigation items, add a theme, set up role-based access, call the backend, or work with the dashboard's patterns and conventions. Also triggers when adding routes under /dashboard, wiring a service to an API, working with auth, adding images, or modifying the sidebar. Even if the user doesn't mention "dashboard" explicitly — if they're adding UI, pages, or features to this project, use this skill.
---

# Dashboard Development Guide

This skill encodes the exact patterns and conventions used in this Next.js 16 + shadcn/ui admin dashboard template. Following these patterns ensures consistency across the codebase.

## Quick Reference: What Goes Where

| Task              | Location                                                    |
| ----------------- | ----------------------------------------------------------- |
| New page          | `src/app/dashboard/<name>/page.tsx`                         |
| API types         | `src/features/<name>/api/types.ts`                          |
| Backend calls     | `src/features/<name>/api/service.ts` (uses `api`)           |
| Query options     | `src/features/<name>/api/queries.ts`                        |
| Mutation options  | `src/features/<name>/api/mutations.ts`                      |
| Feature UI        | `src/features/<name>/components/`                           |
| Zod schemas       | `src/features/<name>/schemas/`                              |
| HTTP client       | `src/lib/api` (`api.get/post/put/patch/delete`)             |
| Mock backend      | `src/app/api/<name>/route.ts` + `src/constants/mock-api-*`  |
| Auth / roles      | `src/features/auth` (`ROLE`, `hasAccess`, `requireAccess`)  |
| Nav item          | `src/config/nav-config.ts`                                  |
| Search params     | `src/lib/searchparams.ts`                                   |
| Query client      | `src/lib/query-client.ts`                                   |
| Theme CSS         | `src/styles/themes/<name>.css`                              |
| Form components   | `src/components/forms/`                                     |
| Table components  | `src/components/data-table/`                                |
| Icons registry    | `src/components/icons.tsx`                                  |
| Images            | `public/images/*.webp` (rendered with `next/image`)         |

---

## Adding a New Feature (End-to-End)

When a user asks to add a feature (e.g. "add an orders page"), do all of these in order:

1. **Types**: `src/features/<name>/api/types.ts` (response, filters, mutation payload).
2. **Service**: `src/features/<name>/api/service.ts`. Every call goes through `api` from `@/lib/api`; never `fetch` directly. Authenticated by default; `{ auth: false }` for public endpoints.
3. **Queries**: `api/queries.ts`, with a key factory (`orderKeys.all/list/detail`) plus `queryOptions`.
4. **Mutations**: `api/mutations.ts`, with `mutationOptions` that invalidate `orderKeys.all` on success.
5. **Mock backend** (only if the real endpoint doesn't exist yet): `src/app/api/<name>/route.ts`. Call `requireSession(request)` first, like `src/app/api/products/route.ts`.
6. **Components**: listing (server prefetch + `HydrationBoundary`), table, form, under `src/features/<name>/components/`.
7. **Page**: `src/app/dashboard/<name>/page.tsx`. If it's restricted: `await requireAccess({ role: ROLE.ADMIN })` first.
8. **Search params**: `src/lib/searchparams.ts` (if it has a table or filters).
9. **Navigation**: `src/config/nav-config.ts`, with the same `access` as the page guard.
10. **Icon**: `src/components/icons.tsx` (if a new one is needed).
11. **Check**: `bun run typecheck && bun run lint && bun run build && bun run bundle:check`.

---

## 1. Data Fetching with React Query

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
import { searchParamsCache } from '@/lib/searchparams';
import { entitiesQueryOptions } from '../api/queries';
import { EntityTable, EntityTableSkeleton } from './entity-table';
import { Suspense } from 'react';

export default function EntityListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = { page, limit: pageLimit, ...(search && { search }) };

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
import EntityListingPage from '@/features/entities/components/entity-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';

export const metadata = { title: 'Dashboard: Entities' };

type PageProps = { searchParams: Promise<SearchParams> };

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Entities'
      pageDescription='Manage entities (React Query + nuqs table pattern.)'
    >
      <EntityListingPage />
    </PageContainer>
  );
}
```

---

## 3. Data Tables

Tables use TanStack Table v9 (DiceUI data table) with `useDataTable` hook and `nuqs` for URL state. Type columns with `DataTableFeatures` from `@/lib/data-table-features`.

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
- Sheet/Dialog forms: submit button in the footer via the HTML `form` attribute (`<Button type='submit' form='my-form-id'>`).
- Multi-step: `useFormStepper(stepSchemas, { fullSchema })` from `@/hooks/use-stepper`; route every submit through `handleNextStepOrSubmit(form)`.
- Match the widget to the path's value type — the compiler checks the `name` path but NOT the widget/value pairing (a `SwitchField` on a string path compiles and misbehaves).
- Never call `useState` inside a render prop — extract stateful controls into components.

---

## 5. Navigation and Access Control

- **Nav**: `src/config/nav-config.ts`. Add `access: { role: ROLE.ADMIN }` or `{ permission: 'users:write' }`. `useFilteredNavGroups` (`src/hooks/use-nav.ts`) hides items the signed-in user (`/auth/me`) can't access. The Cmd+K palette uses the same filter.
- **Page guard**: `await requireAccess({ role: ROLE.ADMIN })` at the top of the server page. Signed-out users go to sign-in; users without access get a 404.
- Hiding UI is only UX. The backend must enforce the same rule.
- **Search params**: `src/lib/searchparams.ts`. Add new params with `parseAsString`/`parseAsInteger`.
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

- One feature → `src/features/<name>/components/`; two or more → `src/components/`. Start in the feature.
- State: TanStack Query (server data), nuqs (URL), TanStack Form (forms). Zustand only for client-only state shared across components: `src/stores/` (shared) or `src/features/<name>/stores/`. Persisted stores use `skipHydration` + `PreferencesHydrator` (see `src/stores/ui-preferences.ts`).

---

## Code Conventions

- **`cn()` for class merging** — never concatenate className strings
- **Server components by default** — only add `'use client'` when needed
- **React Query for data fetching** — `useQuery` + `shallow: true` for tables, `useMutation` (spreading shared `mutationOptions`) for forms
- **`api` for HTTP** — never `fetch` directly in features
- **Env** — declare in `src/env.ts` (zod) + `env.example.txt`; server code reads `env` from `@/env`, browser code reads `PUBLIC_ENV` from `@/lib/public-env`; never `process.env` elsewhere
- **New third-party origin** (API, images, scripts) — add it in `src/config/security-headers.ts` / `src/config/images.ts`, or the CSP will block it
- **nuqs for URL state** — `searchParamsCache` on server, `useQueryState` on client
- **Formatting**: single quotes, JSX single quotes, no trailing comma, 2-space tabs
