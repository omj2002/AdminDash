import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';

export interface OrderState {
  orders: any[];
  selectedOrder: any;
  loading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null
};

export const orderReducer = createReducer(
  initialState,
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(OrderActions.addOrder, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order]
  })),
  on(OrderActions.updateOrder, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o)
  })),
  on(OrderActions.deleteOrder, (state, { id }) => ({
    ...state,
    orders: state.orders.filter(o => o.id !== id)
  })),
  on(OrderActions.updateOrderStatus, (state, { id, status }) => ({
    ...state,
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  }))
);
