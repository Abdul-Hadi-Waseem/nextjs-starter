// Signed-in example endpoint: mark one task done or not done.
import type { NextRequest } from 'next/server';
import * as z from 'zod';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { parseBody } from '@/app/api/_mock/validation';
import { delay, MOCK_DELAY } from '@/app/api/_mock/db/utils';
import { HTTP_STATUS } from '@/lib/api/config';
import { setChecklistItemDone } from '@/app/api/_mock/db/examples';
import { failureRequested, simulatedFailure } from '@/app/api/_mock/failure';
import { privateJson } from '@/app/api/_mock/cache-control';

const updateSchema = z.object({ done: z.boolean() });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { data: body, error } = await parseBody(request, updateSchema);
  if (error) return error;

  // Slow on purpose, so the optimistic update is visible before the answer arrives.
  await delay(MOCK_DELAY.MUTATION);
  if (failureRequested(request)) return simulatedFailure();

  const item = setChecklistItemDone((await params).id, body.done);
  if (!item) {
    return privateJson(
      { success: false, message: 'Task not found' },
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }
  return privateJson({ item });
}
