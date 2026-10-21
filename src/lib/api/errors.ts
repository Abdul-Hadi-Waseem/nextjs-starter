import { HTTP_STATUS } from './config';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  get isUnauthorized() {
    return this.status === HTTP_STATUS.UNAUTHORIZED;
  }

  get isClientError() {
    return (
      this.status >= HTTP_STATUS.BAD_REQUEST && this.status < HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
