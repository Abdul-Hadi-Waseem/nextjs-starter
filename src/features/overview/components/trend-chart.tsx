'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import type { OverviewTrendPoint } from '../api/types';
import { CHART_COLOR, CHART_PLOT_HEIGHT } from '../constants/chart';
import { formatCompactCurrency, formatMonth } from '../lib/chart-format';
import { currencyTooltipRow } from './chart-tooltip';

const chartConfig = {
  revenue: { label: 'Revenue', color: CHART_COLOR.ONE },
  payouts: { label: 'Payouts', color: CHART_COLOR.TWO }
} satisfies ChartConfig;

const tooltipRow = currencyTooltipRow(chartConfig);

// Grouped bar chart: two series per month, compact currency on the value axis.
export function TrendChart({ data }: { data: OverviewTrendPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className={cn('aspect-auto w-full', CHART_PLOT_HEIGHT)}>
      <BarChart accessibilityLayer data={data} barGap={2}>
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
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatMonth(String(value), true)}
              formatter={tooltipRow}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey='revenue'
          fill='var(--color-revenue)'
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
        <Bar
          dataKey='payouts'
          fill='var(--color-payouts)'
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
