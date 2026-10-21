// Signed-in example endpoint for the optimistic-update page: list and add tasks.
import type { NextRequest } from 'next/server';
import * as z from 'zod';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { parseBody } from '@/app/api/_mock/validation';
import { delay, MOCK_DELAY } from '@/app/api/_mock/db/utils';
import { TASK_TITLE_MAX_LENGTH } from '@/features/examples/shared/constants/demo';
import { HTTP_STATUS } from '@/lib/api/config';
import { addChecklistItem, getChecklist } from '@/app/api/_mock/db/examples';
import { failureRequested, simulatedFailure } from '@/app/api/_mock/failure';
import { privateJson } from '@/app/api/_mock/cache-control';

const newItemSchema = z.object({ title: z.string().trim().min(1).max(TASK_TITLE_MAX_LENGTH) });

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  return privateJson({ items: getChecklist() });
}

export async function POST(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { data: body, error } = await parseBody(request, newItemSchema);
  if (error) return error;

  await delay(MOCK_DELAY.MUTATION);
  if (failureRequested(request)) return simulatedFailure();

  return privateJson({ item: addChecklistItem(body.title) }, { status: HTTP_STATUS.CREATED });
}
