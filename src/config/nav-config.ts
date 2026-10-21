import { NavGroup } from '@/types';
import { ROLE } from '@/features/auth/constants/auth';
import { ADMIN_ACCESS } from '@/features/examples/access/constants/access-checks';
import { EXAMPLE_ROUTES } from '@/features/examples/shared/constants/example-pages';

/**
 * Navigation for the sidebar and the Cmd+K palette.
 *
 * Add `access` to limit who sees an item (checked against the signed-in user
 * from `/auth/me`):
 *   access: { role: ROLE.ADMIN }
 *   access: { role: [ROLE.ADMIN, ROLE.MEMBER], permission: PERMISSION.TEAM_WRITE }
 *
 * Hiding a link is for UX only. Guard the page with `requireAccess` and let the
 * backend enforce the permission.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        title: 'Overview',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['o', 'o'],
        items: []
      },
      {
        title: 'Partners',
        url: '/dashboard/partners',
        icon: 'partners',
        shortcut: ['p', 'p'],
        isActive: false,
        items: []
      },
      {
        title: 'Payouts',
        url: '/dashboard/payouts',
        icon: 'payouts',
        shortcut: ['y', 'y'],
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: 'settings',
        shortcut: ['s', 's'],
        isActive: false,
        items: []
      },
      {
        title: 'Team',
        url: '/dashboard/settings/team',
        icon: 'teams',
        access: { role: ROLE.ADMIN },
        shortcut: ['t', 't'],
        isActive: false,
        items: []
      }
    ]
  },
  {
    // Reference pages (src/app/dashboard/examples). Delete this group with them.
    label: 'Examples',
    items: [
      {
        title: 'Tables',
        url: '#',
        icon: 'table',
        isActive: false,
        items: [
          { title: 'Products', url: '/dashboard/examples/tables/products', icon: 'product' },
          {
            title: 'Users',
            url: '/dashboard/examples/tables/users',
            icon: 'teams',
            access: { role: ROLE.ADMIN }
          }
        ]
      },
      {
        title: 'Forms',
        url: '#',
        icon: 'forms',
        isActive: false,
        items: [
          { title: 'Basic', url: '/dashboard/examples/forms/basic', icon: 'forms' },
          { title: 'Multi-step', url: '/dashboard/examples/forms/multi-step', icon: 'forms' },
          { title: 'Sheet & dialog', url: '/dashboard/examples/forms/sheet-form', icon: 'forms' },
          { title: 'Advanced', url: '/dashboard/examples/forms/advanced', icon: 'forms' }
        ]
      },
      {
        title: 'Data fetching',
        url: '#',
        icon: 'database',
        isActive: false,
        items: [
          { title: 'React Query', url: EXAMPLE_ROUTES.REACT_QUERY, icon: 'code' },
          { title: 'Public vs signed-in', url: EXAMPLE_ROUTES.PUBLIC_VS_AUTH, icon: 'code' },
          { title: 'Caching', url: EXAMPLE_ROUTES.CACHING, icon: 'code' },
          { title: 'Pagination', url: EXAMPLE_ROUTES.PAGINATION, icon: 'code' },
          { title: 'Infinite list', url: EXAMPLE_ROUTES.INFINITE, icon: 'code' },
          { title: 'Dependent & parallel', url: EXAMPLE_ROUTES.DEPENDENT, icon: 'code' },
          { title: 'Prefetch on intent', url: EXAMPLE_ROUTES.PREFETCH, icon: 'code' },
          { title: 'Polling, select & cancel', url: EXAMPLE_ROUTES.POLLING, icon: 'code' },
          { title: 'Optimistic updates', url: EXAMPLE_ROUTES.OPTIMISTIC, icon: 'code' }
        ]
      },
      {
        title: 'Server-side',
        url: '#',
        icon: 'server',
        isActive: false,
        items: [
          { title: 'Server component', url: EXAMPLE_ROUTES.SERVER_COMPONENT, icon: 'server' },
          { title: 'Server action', url: EXAMPLE_ROUTES.SERVER_ACTION, icon: 'server' },
          { title: 'Route handler proxy', url: EXAMPLE_ROUTES.ROUTE_HANDLER, icon: 'server' }
        ]
      },
      {
        title: 'Access control',
        url: '#',
        icon: 'shield',
        isActive: false,
        items: [
          { title: 'Roles and permissions', url: EXAMPLE_ROUTES.ACCESS, icon: 'shield' },
          {
            title: 'Admin only',
            url: EXAMPLE_ROUTES.ACCESS_ADMIN,
            icon: 'lock',
            // Same check as requireAccess on the page.
            access: ADMIN_ACCESS
          }
        ]
      },
      {
        title: 'Client state',
        url: EXAMPLE_ROUTES.CLIENT_STATE,
        icon: 'browser',
        isActive: false,
        items: []
      },
      {
        title: 'Icons',
        url: '/dashboard/examples/icons',
        icon: 'palette',
        isActive: false,
        items: []
      }
    ]
  }
];
