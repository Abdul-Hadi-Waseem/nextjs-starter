'use client';

import { Label, type LabelProps, Pie, PieChart } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { payoutMethodOptions } from '@/features/payouts/constants/payout-options';
import type { OverviewMethodBreakdown } from '../api/types';
import { DONUT_PLOT_HEIGHT, METHOD_CHART_COLOR } from '../constants/chart';
import { formatCompactCurrency } from '../lib/chart-format';
import { currencyTooltipRow } from './chart-tooltip';

const chartConfig: ChartConfig = Object.fromEntries(
  payoutMethodOptions.map(({ value, label }) => [
    value,
    { label, color: METHOD_CHART_COLOR[value] }
  ])
);

const tooltipRow = currencyTooltipRow(chartConfig);

// Recharts clones <Label content> with the pie's viewBox (center and radii).
function DonutTotal({ viewBox, total }: { viewBox?: LabelProps['viewBox']; total: number }) {
  if (!viewBox || !('cx' in viewBox)) return null;
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor='middle' dominantBaseline='middle'>
      <tspan x={cx} y={cy} className='fill-foreground text-xl font-semibold'>
        {formatCompactCurrency(total)}
      </tspan>
      <tspan x={cx} y={cy + 20} className='fill-muted-foreground'>
        Paid
      </tspan>
    </text>
  );
}

interface PayoutMethodsChartProps {
  data: OverviewMethodBreakdown[];
  totalAmount: number;
}

// Donut: a Pie with an inner radius and the total drawn in the hole with <Label>.
// Each slice's color comes from its row (`fill`), which the tooltip indicator reads.
// The legend with values is HTML in the section, not part of this chart.
export function PayoutMethodsChart({ data, totalAmount }: PayoutMethodsChartProps) {
  const slices = data.map((row) => ({ ...row, fill: `var(--color-${row.method})` }));

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('mx-auto aspect-square max-w-full', DONUT_PLOT_HEIGHT)}
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey='method' formatter={tooltipRow} />}
        />
        <Pie
          data={slices}
          dataKey='amount'
          nameKey='method'
          innerRadius='62%'
          stroke='var(--card)'
          strokeWidth={4}
          isAnimationActive={false}
        >
          <Label content={<DonutTotal total={totalAmount} />} />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
