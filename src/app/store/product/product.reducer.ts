import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';

export interface ProductState {
  products: any[];
  selectedProduct: any;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProductActions.addProduct, (state, { product }) => ({
    ...state,
    products: [...state.products, product]
  })),
  on(ProductActions.updateProduct, (state, { product }) => ({
    ...state,
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  on(ProductActions.deleteProduct, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id)
  }))
);
