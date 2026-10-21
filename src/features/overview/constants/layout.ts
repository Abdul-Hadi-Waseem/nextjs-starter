// Fixed row heights shared by each list and its skeleton (CLS 0 when data arrives).
export const RECENT_PAYOUT_ROW_HEIGHT = 'h-14';
export const STATUS_ROW_HEIGHT = 'h-10';

/** Rows in the recent payouts list (the API returns the latest 6) */
export const RECENT_PAYOUTS_COUNT = 6;

/** List row columns: label | middle | amount (recent payouts and status rows) */
export const LIST_ROW_GRID = 'grid grid-cols-[minmax(0,1fr)_auto_7rem] items-center gap-3';

/** Card body of the breakdown sections (status, method): summary or chart above rows */
export const BREAKDOWN_CONTENT = 'flex flex-col gap-4 text-sm';
