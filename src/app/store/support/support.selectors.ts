import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupportState } from './support.reducer';

export const selectSupportState = createFeatureSelector<SupportState>('support');

export const selectTickets = createSelector(
  selectSupportState,
  (state) => state.tickets
);

export const selectSelectedTicket = createSelector(
  selectSupportState,
  (state) => state.selectedTicket
);

export const selectLoading = createSelector(
  selectSupportState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectSupportState,
  (state) => state.error
);
