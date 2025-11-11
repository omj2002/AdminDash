import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: any[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());
export const createUser = createAction('[User] Create User', props<{ user: any }>());
export const addUser = createAction('[User] Add User', props<{ user: any }>());
export const updateUser = createAction('[User] Update User', props<{ user: any }>());
export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
