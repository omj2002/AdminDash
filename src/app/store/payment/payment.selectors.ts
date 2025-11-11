import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentState } from './payment.reducer';

export const selectPaymentState = createFeatureSelector<PaymentState>('payments');

export const selectPayments = createSelector(
  selectPaymentState,
  (state) => state.payments
);

export const selectSelectedPayment = createSelector(
  selectPaymentState,
  (state) => state.selectedPayment
);

export const selectLoading = createSelector(
  selectPaymentState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectPaymentState,
  (state) => state.error
);
