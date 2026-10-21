'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { partnerTierOptions } from '@/features/partners/constants/partner-options';
import type { OverviewPartnerGrowthPoint } from '../api/types';
import { CHART_PLOT_HEIGHT, TIER_CHART_COLOR } from '../constants/chart';
import { formatMonth } from '../lib/chart-format';

const chartConfig: ChartConfig = Object.fromEntries(
  partnerTierOptions.map(({ value, label }) => [value, { label, color: TIER_CHART_COLOR[value] }])
);

// Stacked area chart: one area per tier on a shared stackId, so the top edge is the
// total. Counts use the tooltip's default (locale-formatted) value.
export function PartnerGrowthChart({ data }: { data: OverviewPartnerGrowthPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className={cn('aspect-auto w-full', CHART_PLOT_HEIGHT)}>
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => formatMonth(value)}
        />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator='line'
              labelFormatter={(value) => formatMonth(String(value), true)}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {partnerTierOptions.map(({ value }) => (
          <Area
            key={value}
            dataKey={value}
            stackId='partners'
            type='monotone'
            stroke={`var(--color-${value})`}
            fill={`var(--color-${value})`}
            fillOpacity={0.3}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
