import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: any; token: string }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');
export const checkAuth = createAction('[Auth] Check Auth');
export const updateProfile = createAction('[Auth] Update Profile', props<{ user: any }>());