import { createAction, props } from '@ngrx/store';

export const loadOrders = createAction('[Order] Load Orders');
export const loadOrdersSuccess = createAction('[Order] Load Orders Success', props<{ orders: any[] }>());
export const loadOrdersFailure = createAction('[Order] Load Orders Failure', props<{ error: string }>());
export const updateOrderStatus = createAction('[Order] Update Order Status', props<{ id: string; status: string }>());
export const createOrder = createAction('[Order] Create Order', props<{ order: any }>());
export const addOrder = createAction('[Order] Add Order', props<{ order: any }>());
export const updateOrder = createAction('[Order] Update Order', props<{ order: any }>());
export const deleteOrder = createAction('[Order] Delete Order', props<{ id: string }>());
