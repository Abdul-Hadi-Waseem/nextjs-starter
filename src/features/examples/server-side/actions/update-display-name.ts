'use server';

import { refresh } from 'next/cache';
import * as z from 'zod';
import { updateProfile } from '@/features/settings/api/service';
import { profileSchema } from '@/features/settings/schemas/profile';
import { getSessionUser } from '../../shared/api/server';
import {
  ACTION_STATUS,
  DISPLAY_NAME_FIELD,
  type DisplayNameState
} from '../constants/display-name-form';

export async function updateDisplayName(
  _previous: DisplayNameState,
  formData: FormData
): Promise<DisplayNameState> {
  const name = String(formData.get(DISPLAY_NAME_FIELD) ?? '');

  // 1. Auth: actions are public POST endpoints, reachable without the UI.
  if (!(await getSessionUser())) {
    return { status: ACTION_STATUS.ERROR, message: 'Your session has ended. Sign in again.', name };
  }

  // 2. Validate: FormData is untrusted input.
  const parsed = profileSchema.safeParse({ name });
  if (!parsed.success) {
    return {
      status: ACTION_STATUS.ERROR,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      name
    };
  }

  // 3. Call the backend through `api`; the session cookie is forwarded from this request.
  try {
    await updateProfile(parsed.data);
  } catch {
    return { status: ACTION_STATUS.ERROR, message: "Couldn't save the name. Try again.", name };
  }

  // 4. The page reads the name uncached, so re-render it (refresh, per the Next 16 docs);
  //    updateTag would be the call if the data were in the server cache under a tag.
  refresh();
  return { status: ACTION_STATUS.SUCCESS, message: 'Name updated', name: parsed.data.name };
}
