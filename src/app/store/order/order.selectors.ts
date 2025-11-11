import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.reducer';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

export const selectOrders = createSelector(
  selectOrderState,
  (state) => state.orders
);

export const selectSelectedOrder = createSelector(
  selectOrderState,
  (state) => state.selectedOrder
);

export const selectLoading = createSelector(
  selectOrderState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectOrderState,
  (state) => state.error
);
