import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

// Chart headers are static, so skeletons render the real header and only the
// plot area is a placeholder. Header height is then identical by construction.

export function AreaGraphHeader() {
  return (
    <CardHeader>
      <CardTitle>
        Dotted Area Chart
        <Badge variant='outline'>
          <Icons.trendingUp />
          -5.2%
        </Badge>
      </CardTitle>
      <CardDescription>Showing total visitors for the last 6 months</CardDescription>
    </CardHeader>
  );
}

export function BarGraphHeader() {
  return (
    <CardHeader>
      <CardTitle>
        Bar Chart - Multiple
        <Badge variant='outline'>
          <Icons.trendingDown />
          -5.2%
        </Badge>
      </CardTitle>
      <CardDescription>January - June 2025</CardDescription>
    </CardHeader>
  );
}

export function PieGraphHeader() {
  return (
    <CardHeader className='items-center pb-0'>
      <CardTitle>
        Pie Chart
        <Badge variant='outline'>
          <Icons.trendingUp />
          +5.2%
        </Badge>
      </CardTitle>
      <CardDescription>January - June 2024</CardDescription>
    </CardHeader>
  );
}
