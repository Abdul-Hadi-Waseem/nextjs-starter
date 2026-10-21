const PRODUCTS_PATH = '/dashboard/examples/tables/products';

export const PRODUCT_ROUTES = {
  list: PRODUCTS_PATH,
  new: `${PRODUCTS_PATH}/new`,
  detail: (id: number | string) => `${PRODUCTS_PATH}/${id}`
} as const;
