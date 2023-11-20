export type SaveProductRequest = {
  product: string;
};

export type FindProductsFilter = {
  page: number;
  pageSize: number;
  categoryId?: string;
  subcategoryId?: string;
  sort?: string;
  search?: string;
  eventId?: string;
};
