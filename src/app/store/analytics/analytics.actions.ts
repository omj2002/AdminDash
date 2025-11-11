import { createAction, props } from '@ngrx/store';

export const loadDashboardData = createAction('[Analytics] Load Dashboard Data');
export const loadDashboardDataSuccess = createAction('[Analytics] Load Dashboard Data Success', props<{ data: any }>());
export const loadDashboardDataFailure = createAction('[Analytics] Load Dashboard Data Failure', props<{ error: string }>());
export const loadSalesData = createAction('[Analytics] Load Sales Data');
export const loadUserData = createAction('[Analytics] Load User Data');
