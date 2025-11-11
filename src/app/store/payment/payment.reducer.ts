import { createReducer, on } from '@ngrx/store';
import * as PaymentActions from './payment.actions';

export interface PaymentState {
  payments: any[];
  selectedPayment: any;
  loading: boolean;
  error: string | null;
}

export const initialState: PaymentState = {
  payments: [],
  selectedPayment: null,
  loading: false,
  error: null
};

export const paymentReducer = createReducer(
  initialState,
  on(PaymentActions.loadPayments, (state) => ({
    ...state,
    loading: true
  })),
  on(PaymentActions.loadPaymentsSuccess, (state, { payments }) => ({
    ...state,
    payments,
    loading: false
  })),
  on(PaymentActions.loadPaymentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(PaymentActions.addPayment, (state, { payment }) => ({
    ...state,
    payments: [...state.payments, payment]
  }))
);
