'use client';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/lib/form';
import { FileUploadField } from '@/components/forms/fields/file-upload-field';
import { categoryOptions } from '@/features/examples/tables/products/constants/product-options';
import {
  productSchema,
  type ProductFormValues
} from '@/features/examples/tables/products/schemas/product';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProductMutation, updateProductMutation } from '../api/mutations';
import type { Product } from '../api/types';
import { PRODUCT_ROUTES } from '../constants/product-routes';

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  // Shared options keep their invalidation; the toasts and redirect are per-call callbacks.
  const createMutation = useMutation(createProductMutation);
  const updateMutation = useMutation(updateProductMutation);

  const form = useAppForm({
    defaultValues: {
      image: undefined,
      name: initialData?.name ?? '',
      category: initialData?.category ?? '',
      price: initialData?.price,
      description: initialData?.description ?? ''
    } as ProductFormValues,
    validators: {
      onSubmit: productSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        category: value.category,
        price: value.price!,
        description: value.description
      };

      if (isEdit) {
        updateMutation.mutate(
          { id: initialData.id, values: payload },
          {
            onSuccess: () => {
              toast.success('Product updated');
              router.push(PRODUCT_ROUTES.list);
            },
            onError: () => toast.error("Couldn't update product. Try again.")
          }
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => {
            toast.success('Product created');
            router.push(PRODUCT_ROUTES.list);
          },
          onError: () => toast.error("Couldn't create product. Try again.")
        });
      }
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className='space-y-8'
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name='image'
              children={() => (
                <FileUploadField
                  label='Product Image'
                  description='Upload a product image'
                  maxSize={5 * 1024 * 1024}
                  maxFiles={4}
                />
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <form.AppField
                name='name'
                children={(field) => (
                  <field.TextField label='Product Name' required placeholder='Enter product name' />
                )}
              />

              <form.AppField
                name='category'
                children={(field) => (
                  <field.SelectField
                    label='Category'
                    required
                    options={categoryOptions}
                    placeholder='Select category'
                  />
                )}
              />

              <form.AppField
                name='price'
                children={(field) => (
                  <field.TextField
                    label='Price'
                    required
                    type='number'
                    min={0}
                    step={0.01}
                    placeholder='Enter price'
                  />
                )}
              />
            </div>

            <form.AppField
              name='description'
              children={(field) => (
                <field.TextareaField
                  label='Description'
                  required
                  placeholder='Enter product description'
                  maxLength={500}
                  rows={4}
                />
              )}
            />
          </FieldGroup>

          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              Cancel
            </Button>
            <LoadingButton loading={isPending} type='submit'>
              {isEdit ? 'Update Product' : 'Add Product'}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
