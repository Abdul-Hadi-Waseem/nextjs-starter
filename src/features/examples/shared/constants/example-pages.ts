// Routes and headers of the reference pages under /dashboard/examples. The nav
// (src/config/nav-config.ts), the pages and their loading states read from here.

const EXAMPLES = '/dashboard/examples';
const DATA_FETCHING = `${EXAMPLES}/data-fetching`;
const SERVER = `${EXAMPLES}/server`;

export const EXAMPLE_ROUTES = {
  REACT_QUERY: `${DATA_FETCHING}/react-query`,
  PUBLIC_VS_AUTH: `${DATA_FETCHING}/public-vs-auth`,
  CACHING: `${DATA_FETCHING}/caching`,
  PAGINATION: `${DATA_FETCHING}/pagination`,
  INFINITE: `${DATA_FETCHING}/infinite`,
  DEPENDENT: `${DATA_FETCHING}/dependent`,
  PREFETCH: `${DATA_FETCHING}/prefetch`,
  POLLING: `${DATA_FETCHING}/polling`,
  OPTIMISTIC: `${DATA_FETCHING}/optimistic`,
  SERVER_COMPONENT: `${SERVER}/server-component`,
  SERVER_ACTION: `${SERVER}/server-action`,
  ROUTE_HANDLER: `${SERVER}/route-handler`,
  ACCESS: `${EXAMPLES}/access`,
  ACCESS_ADMIN: `${EXAMPLES}/access/admin`,
  CLIENT_STATE: `${EXAMPLES}/client-state`
} as const;

export const EXAMPLE_PAGES = {
  publicVsAuth: {
    title: 'Public and signed-in calls',
    description: 'A public call prefetched on the server next to a signed-in call from the browser.'
  },
  caching: {
    title: 'Caching',
    description: 'Shared data in the server cache; your own data only in the browser.'
  },
  pagination: {
    title: 'Pagination',
    description: 'keepPreviousData between pages, with the next page prefetched.'
  },
  infinite: {
    title: 'Infinite list',
    description: 'useSuspenseInfiniteQuery with a Load more button.'
  },
  dependent: {
    title: 'Dependent and parallel queries',
    description: 'A query that waits for a pick, and two queries fetched at once.'
  },
  prefetch: {
    title: 'Prefetch on intent',
    description: 'Prefetch a detail on hover or focus, before the click.'
  },
  polling: {
    title: 'Polling, select and cancel',
    description: 'refetchInterval, select to re-render less, and cancelled stale requests.'
  },
  optimistic: {
    title: 'Optimistic updates',
    description: 'Show a change before the server answers, and roll it back if it fails.'
  },
  serverComponent: {
    title: 'Server component fetch',
    description: 'An async server component calling api.get with the forwarded cookie.'
  },
  serverAction: {
    title: 'Server action',
    description: 'A form posting to a server action with useActionState.'
  },
  routeHandler: {
    title: 'Route handler proxy',
    description: 'A route handler that adds a server-only secret before calling the backend.'
  },
  access: {
    title: 'Access control',
    description: 'hasAccess in a client component, requireAccess on a server page.'
  },
  accessAdmin: {
    title: 'Admin only',
    description: 'A server page guarded with requireAccess({ role: ROLE.ADMIN }).'
  },
  clientState: {
    title: 'Client state',
    description: 'A small Zustand store, persisted per browser, read with selectors.'
  }
} as const;

export type ExamplePage = keyof typeof EXAMPLE_PAGES;
