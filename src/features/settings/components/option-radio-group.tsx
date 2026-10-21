'use client';

import { Icons } from '@/components/icons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PreferenceOption } from '../constants/settings';

/**
 * A row of selectable option cards backed by a radio group (arrow keys move the choice).
 * `value` is `undefined` until the caller knows it, so nothing shows as selected yet.
 */
export function OptionRadioGroup<T extends string>({
  labelledBy,
  describedBy,
  options,
  value,
  onValueChange
}: {
  labelledBy: string;
  describedBy?: string;
  options: PreferenceOption<T>[];
  value: T | undefined;
  onValueChange: (value: T) => void;
}) {
  return (
    <RadioGroup
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      value={value ?? null}
      onValueChange={(next) => onValueChange(next as T)}
      className='grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))]'
    >
      {options.map((option) => {
        const Icon = Icons[option.icon];
        return (
          <label
            key={option.value}
            className='border-input hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5 flex h-10 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm transition-colors'
          >
            <RadioGroupItem value={option.value} />
            <Icon className='text-muted-foreground size-4' aria-hidden />
            <span className='truncate'>{option.label}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
