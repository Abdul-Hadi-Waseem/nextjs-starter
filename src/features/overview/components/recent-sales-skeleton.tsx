import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Each placeholder sits inside the same typography as the real text and is
// exactly one line tall (`h-lh`), so rows match the loaded card's height.
export function RecentSalesSkeleton() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <div className='text-sm'>
          <Skeleton className='h-lh w-[180px]' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center'>
              <Skeleton className='size-9 rounded-full' />
              <div className='ml-4 space-y-1'>
                <div className='text-sm leading-none'>
                  <Skeleton className='h-lh w-[120px]' />
                </div>
                <div className='text-sm'>
                  <Skeleton className='h-lh w-[160px]' />
                </div>
              </div>
              <div className='ml-auto'>
                <Skeleton className='h-lh w-[80px]' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
