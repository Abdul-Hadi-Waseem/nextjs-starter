import type { ChartConfig, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/format';

// Imported only by the lazily loaded chart modules, never by a section.

type TooltipFormatter = NonNullable<React.ComponentProps<typeof ChartTooltipContent>['formatter']>;

/**
 * A tooltip row like the default one (indicator, series label, value) with the value
 * formatted as currency. Labels come from the chart's config.
 */
export function currencyTooltipRow(config: ChartConfig): TooltipFormatter {
  return function CurrencyTooltipRow(value, name, item) {
    return (
      <div className='flex w-full items-center gap-2'>
        <span
          className='size-2.5 shrink-0 rounded-[2px] bg-(--indicator)'
          style={{ '--indicator': item.payload?.fill ?? item.color } as React.CSSProperties}
        />
        <span className='text-muted-foreground flex-1'>{config[String(name)]?.label ?? name}</span>
        <span className='text-foreground font-mono font-medium tabular-nums'>
          {formatCurrency(Number(value))}
        </span>
      </div>
    );
  };
}
