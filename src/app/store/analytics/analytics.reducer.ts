import { createReducer, on } from '@ngrx/store';
import * as AnalyticsActions from './analytics.actions';

export interface AnalyticsState {
  dashboardData: any;
  salesData: any[];
  userData: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: AnalyticsState = {
  dashboardData: null,
  salesData: [],
  userData: [],
  loading: false,
  error: null
};

export const analyticsReducer = createReducer(
  initialState,
  on(AnalyticsActions.loadDashboardData, (state) => ({
    ...state,
    loading: true
  })),
  on(AnalyticsActions.loadDashboardDataSuccess, (state, { data }) => ({
    ...state,
    dashboardData: data,
    loading: false
  })),
  on(AnalyticsActions.loadDashboardDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
