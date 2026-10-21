import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PokemonSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Selector card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-40 rounded' />
          <Skeleton className='mt-2 h-4 w-72 rounded' />
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className='h-9 w-14 rounded-md' />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pokemon card skeleton */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-7 w-32 rounded' />
            <Skeleton className='h-5 w-16 rounded-full' />
          </div>
          <Skeleton className='mt-2 h-4 w-48 rounded' />
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center gap-6 sm:flex-row'>
            <Skeleton className='size-40 rounded-lg' />
            <div className='w-full flex-1 space-y-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='space-y-1'>
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-24 rounded' />
                    <Skeleton className='h-4 w-8 rounded' />
                  </div>
                  <Skeleton className='h-2 w-full rounded-full' />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className='h-3 w-64 rounded' />
        </CardFooter>
      </Card>
    </div>
  );
}
