import { createAction, props } from '@ngrx/store';

export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction('[Product] Load Products Success', props<{ products: any[] }>());
export const loadProductsFailure = createAction('[Product] Load Products Failure', props<{ error: string }>());
export const createProduct = createAction('[Product] Create Product', props<{ product: any }>());
export const addProduct = createAction('[Product] Add Product', props<{ product: any }>());
export const updateProduct = createAction('[Product] Update Product', props<{ product: any }>());
export const deleteProduct = createAction('[Product] Delete Product', props<{ id: string }>());
