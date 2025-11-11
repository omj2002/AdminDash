import { createAction, props } from '@ngrx/store';

export const loadPayments = createAction('[Payment] Load Payments');
export const loadPaymentsSuccess = createAction('[Payment] Load Payments Success', props<{ payments: any[] }>());
export const loadPaymentsFailure = createAction('[Payment] Load Payments Failure', props<{ error: string }>());
export const addPayment = createAction('[Payment] Add Payment', props<{ payment: any }>());
export const processPayment = createAction('[Payment] Process Payment', props<{ payment: any }>());
export const refundPayment = createAction('[Payment] Refund Payment', props<{ id: string }>());
