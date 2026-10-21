'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { PARTNER_ROUTES } from '@/features/partners/constants/partner-routes';
import type { OverviewTopPartner } from '../api/types';
import {
  CHART_COLOR,
  CHART_PLOT_HEIGHT,
  TOP_PARTNER_AXIS_WIDTH,
  TOP_PARTNER_NAME_MAX_LENGTH
} from '../constants/chart';
import { formatCompactCurrency } from '../lib/chart-format';
import { currencyTooltipRow } from './chart-tooltip';

const chartConfig = {
  revenue: { label: 'Lifetime revenue', color: CHART_COLOR.ONE }
} satisfies ChartConfig;

const tooltipRow = currencyTooltipRow(chartConfig);

function shortName(name: string) {
  return name.length > TOP_PARTNER_NAME_MAX_LENGTH
    ? `${name.slice(0, TOP_PARTNER_NAME_MAX_LENGTH - 1)}…`
    : name;
}

interface NameTickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string };
}

// Horizontal bar chart (layout='vertical'): categories on the Y axis. The Y axis is
// keyed by partner id; each tick is a real link to the partner (keyboard and screen
// readers reach it), and clicking a bar goes to the same page.
export function TopPartnersChart({ data }: { data: OverviewTopPartner[] }) {
  const router = useRouter();
  const nameById = new Map(data.map((partner) => [partner.id, partner.name]));

  // A render function (recharts calls it), not a component, so ticks aren't remounted.
  const renderNameTick = ({ x = 0, y = 0, payload }: NameTickProps) => {
    if (!payload) return null;
    const name = nameById.get(payload.value) ?? payload.value;
    return (
      <Link
        href={PARTNER_ROUTES.detail(payload.value)}
        className='focus-visible:outline-ring hover:underline focus-visible:outline-2'
      >
        <title>{name}</title>
        {/* Names are links, so foreground (over the muted tick color set in ChartContainer) */}
        <text
          x={Number(x) - 8}
          y={y}
          textAnchor='end'
          dominantBaseline='middle'
          className='fill-foreground!'
        >
          {shortName(name)}
        </text>
      </Link>
    );
  };

  return (
    <ChartContainer config={chartConfig} className={cn('aspect-auto w-full', CHART_PLOT_HEIGHT)}>
      <BarChart accessibilityLayer data={data} layout='vertical' margin={{ right: 12 }}>
        <CartesianGrid horizontal={false} />
        <XAxis
          type='number'
          dataKey='revenue'
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCompactCurrency}
        />
        <YAxis
          type='category'
          dataKey='id'
          tickLine={false}
          axisLine={false}
          width={TOP_PARTNER_AXIS_WIDTH}
          tick={renderNameTick}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => nameById.get(String(value)) ?? String(value)}
              formatter={tooltipRow}
            />
          }
        />
        <Bar
          dataKey='revenue'
          fill='var(--color-revenue)'
          radius={4}
          className='cursor-pointer'
          onClick={(bar) => {
            const partner = bar.payload as OverviewTopPartner | undefined;
            if (partner) router.push(PARTNER_ROUTES.detail(partner.id));
          }}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
