import { createSearchParamsCache } from 'nuqs/server';

import { partnersSearchParams } from './search-params';

/** Server-side reader for the partners table URL state (parse in page.tsx, read anywhere below). */
export const partnersSearchParamsCache = createSearchParamsCache(partnersSearchParams);
