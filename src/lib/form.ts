'use client';

import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from '@/lib/form-context';
import { TextField } from '@/components/forms/fields/text-field';
import { TextareaField } from '@/components/forms/fields/textarea-field';
import { SelectField } from '@/components/forms/fields/select-field';
import { CheckboxField } from '@/components/forms/fields/checkbox-field';
import { SwitchField } from '@/components/forms/fields/switch-field';
import { RadioGroupField } from '@/components/forms/fields/radio-group-field';
import { SliderField } from '@/components/forms/fields/slider-field';
import { ColorField } from '@/components/forms/fields/color-field';
import { CheckboxGroupField } from '@/components/forms/fields/checkbox-group-field';
import { TagsField } from '@/components/forms/fields/tags-field';
import { ToggleGroupField } from '@/components/forms/fields/toggle-group-field';
import { SubmitButton } from '@/components/forms/submit-button';

/**
 * App-wide form hook — TanStack's createFormHook with the field components
 * registered. Fields render inside `form.AppField`:
 *
 * ```tsx
 * const form = useAppForm({ defaultValues, validators: { onSubmit: schema }, onSubmit });
 *
 * <form.AppField name='email'
 *   children={(field) => <field.TextField label='Email' type='email' />} />
 * ```
 *
 * Every component's markup is the shadcn TanStack Form doc anatomy — for
 * one-off custom fields, drop down to the raw `form.Field` render prop and
 * compose the `Field` primitives directly (see docs/forms.md).
 *
 * Heavy fields are NOT registered here, so every form doesn't pay for them.
 * Import them directly and render them inside `form.AppField`:
 * ComboboxField (cmdk), DatePickerField / DateRangeField (react-day-picker),
 * OtpField (input-otp), FileUploadField (react-dropzone).
 *
 * ```tsx
 * import { ComboboxField } from '@/components/forms/fields/combobox-field';
 * <form.AppField name='framework' children={() => <ComboboxField label='Framework' options={…} />} />
 * ```
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
    SwitchField,
    RadioGroupField,
    SliderField,
    ColorField,
    CheckboxGroupField,
    TagsField,
    ToggleGroupField
  },
  formComponents: {
    SubmitButton
  }
});
