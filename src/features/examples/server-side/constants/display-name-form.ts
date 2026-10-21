// State returned by the updateDisplayName server action (kept here: a 'use server'
// file may only export async functions).
export const ACTION_STATUS = {
  IDLE: 'idle',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type ActionStatus = (typeof ACTION_STATUS)[keyof typeof ACTION_STATUS];

export type DisplayNameState = {
  status: ActionStatus;
  message?: string;
  fieldErrors?: { name?: string[] };
  /** What the user typed, so the field keeps it after a failed submit. */
  name?: string;
};

export const DISPLAY_NAME_INITIAL_STATE: DisplayNameState = { status: ACTION_STATUS.IDLE };

export const DISPLAY_NAME_FIELD = 'name';
