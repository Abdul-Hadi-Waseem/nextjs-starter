'use client';

import { useId } from 'react';
import { useTheme } from 'next-themes';
import { useThemeConfig } from '@/components/themes/active-theme';
import { THEMES } from '@/components/themes/theme.config';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useUiPreferences } from '@/stores/ui-preferences';
import { TABLE_DENSITY_OPTIONS, THEME_MODE_OPTIONS, type ThemeMode } from '../constants/settings';
import { useIsClient } from '../hooks/use-is-client';
import { OptionRadioGroup } from './option-radio-group';

const COLOR_THEME_ITEMS = THEMES.map((theme) => ({ value: theme.value, label: theme.name }));

function TableDensityField() {
  const titleId = useId();
  const descriptionId = useId();
  const density = useUiPreferences((state) => state.tableDensity);
  const setDensity = useUiPreferences((state) => state.setTableDensity);

  return (
    <Field>
      <FieldTitle id={titleId}>Table density</FieldTitle>
      <OptionRadioGroup
        labelledBy={titleId}
        describedBy={descriptionId}
        options={TABLE_DENSITY_OPTIONS}
        value={density}
        onValueChange={setDensity}
      />
      <FieldDescription id={descriptionId}>
        Row height in the partner and payout tables. The rows button in each table toolbar changes
        the same setting.
      </FieldDescription>
    </Field>
  );
}

function ThemeModeField() {
  const titleId = useId();
  const descriptionId = useId();
  const { theme, setTheme } = useTheme();
  // next-themes reads the saved mode from localStorage, which the server can't see.
  const isClient = useIsClient();

  return (
    <Field>
      <FieldTitle id={titleId}>Appearance</FieldTitle>
      <OptionRadioGroup
        labelledBy={titleId}
        describedBy={descriptionId}
        options={THEME_MODE_OPTIONS}
        value={isClient ? (theme as ThemeMode | undefined) : undefined}
        onValueChange={setTheme}
      />
      <FieldDescription id={descriptionId}>
        System follows your device setting. The header button switches between light and dark.
      </FieldDescription>
    </Field>
  );
}

function ColorThemeField() {
  const triggerId = useId();
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <Field>
      <FieldLabel htmlFor={triggerId}>Color theme</FieldLabel>
      <Select
        items={COLOR_THEME_ITEMS}
        value={activeTheme}
        onValueChange={(value) => {
          if (value !== null) setActiveTheme(value);
        }}
      >
        <SelectTrigger id={triggerId} className='w-full sm:w-56'>
          <SelectValue placeholder='Select a theme' />
        </SelectTrigger>
        <SelectContent>
          {COLOR_THEME_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>
        Colors, radius and font. Same list as the theme picker in the header.
      </FieldDescription>
    </Field>
  );
}

/** Client-only preferences: saved in this browser, applied as soon as you pick. */
export function PreferencesPanel() {
  return (
    <FieldGroup>
      <ThemeModeField />
      <ColorThemeField />
      <TableDensityField />
    </FieldGroup>
  );
}
