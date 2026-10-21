// Page-number pagination math shared by the tables, the mock backend and the
// pagination examples. Pages are 1-based; list responses carry `offset` and `limit`.

/** First record of `page`: page 3 of 10 per page → offset 20. */
export function toOffset(page: number, perPage: number) {
  return (page - 1) * perPage;
}

/** Number of pages for `total` records; at least 1 so "page 1 of 1" holds for empty lists. */
export function pageCount(total: number, perPage: number) {
  return Math.max(1, Math.ceil(total / perPage));
}

/** True when another page follows the one at `offset` (for prev/next and infinite lists). */
export function hasNextPage({ offset, limit }: { offset: number; limit: number }, total: number) {
  return offset + limit < total;
}
