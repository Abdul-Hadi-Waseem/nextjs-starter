// Mock-backend body validation: parse JSON and run a zod schema, answering 400
// with field errors (z.flattenError shape) when either fails.
import type { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { HTTP_STATUS } from '@/lib/api/config';
import { privateJson } from './cache-control';

type ValidationResult<T> = { data: T; error: null } | { data: null; error: NextResponse };

export async function parseBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<ValidationResult<z.infer<T>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      data: null,
      error: privateJson(
        { success: false, message: 'Request body must be valid JSON' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      data: null,
      error: privateJson(
        {
          success: false,
          message: 'Invalid request body',
          errors: z.flattenError(result.error).fieldErrors
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    };
  }

  return { data: result.data, error: null };
}
