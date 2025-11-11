import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalyticsState } from './analytics.reducer';

export const selectAnalyticsState = createFeatureSelector<AnalyticsState>('analytics');

export const selectDashboardData = createSelector(
  selectAnalyticsState,
  (state) => state.dashboardData
);

export const selectLoading = createSelector(
  selectAnalyticsState,
  (state) => state.loading
);

export const selectSalesData = createSelector(
  selectAnalyticsState,
  (state) => state.salesData
);

export const selectUserData = createSelector(
  selectAnalyticsState,
  (state) => state.userData
);

export const selectError = createSelector(
  selectAnalyticsState,
  (state) => state.error
);
