import { Icons } from '@/components/icons';
import { isApiError } from '@/lib/api';

/** Failed query (after retries; 401s never get here, the query client redirects). */
export function QueryError({ error }: { error: unknown }) {
  const message = isApiError(error)
    ? `${error.status} ${error.message}`
    : "Couldn't load this. Check your connection and try again.";

  return (
    <p role='alert' className='text-destructive flex items-center gap-1.5 text-sm'>
      <Icons.alertCircle className='size-4 shrink-0' aria-hidden />
      {message}
    </p>
  );
}
