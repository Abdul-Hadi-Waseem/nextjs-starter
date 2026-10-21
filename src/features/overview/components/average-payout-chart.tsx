'use client';

import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { OverviewAveragePayout } from '../api/types';
import { CHART_COLOR, CHART_PLOT_HEIGHT } from '../constants/chart';
import { formatCompactCurrency, formatMonth } from '../lib/chart-format';
import { currencyTooltipRow } from './chart-tooltip';

const chartConfig = {
  average: { label: 'Average payout', color: CHART_COLOR.ONE }
} satisfies ChartConfig;

const tooltipRow = currencyTooltipRow(chartConfig);

// Line chart with a dashed reference line at the 12-month average. Months with no
// paid payouts are null and `connectNulls` bridges them instead of dropping to zero.
export function AveragePayoutChart({ data }: { data: OverviewAveragePayout }) {
  return (
    <ChartContainer config={chartConfig} className={cn('aspect-auto w-full', CHART_PLOT_HEIGHT)}>
      <LineChart accessibilityLayer data={data.months} margin={{ top: 20, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => formatMonth(value)}
        />
        <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={formatCompactCurrency} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatMonth(String(value), true)}
              formatter={tooltipRow}
            />
          }
        />
        <ReferenceLine
          y={data.overall}
          stroke='var(--muted-foreground)'
          strokeDasharray='4 4'
          label={{
            value: `Average ${formatCurrency(data.overall)}`,
            position: 'insideTopRight',
            fill: 'var(--muted-foreground)',
            fontSize: 12
          }}
        />
        <Line
          dataKey='average'
          type='monotone'
          stroke='var(--color-average)'
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-average)' }}
          connectNulls
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
