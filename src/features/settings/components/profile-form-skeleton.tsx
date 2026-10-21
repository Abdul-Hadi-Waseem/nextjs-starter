import { Skeleton } from '@/components/ui/skeleton';

const PROFILE_FIELD_COUNT = 2;

export function ProfileFormSkeleton() {
  return (
    <div className='flex flex-col gap-5' aria-hidden>
      {/* Same rhythm as FieldGroup > Field: label, input, description; then the button. */}
      {Array.from({ length: PROFILE_FIELD_COUNT }, (_, i) => (
        <div key={i} className='flex flex-col gap-2'>
          <Skeleton className='h-lh w-16 text-sm leading-snug' />
          <Skeleton className='h-8 rounded-lg' />
          <Skeleton className='h-lh w-64 max-w-full text-sm' />
        </div>
      ))}
      <Skeleton className='h-8 w-28 rounded-lg' />
    </div>
  );
}
