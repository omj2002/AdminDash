import { createAction, props } from '@ngrx/store';

export const loadPages = createAction('[CMS] Load Pages');
export const loadPagesSuccess = createAction('[CMS] Load Pages Success', props<{ pages: any[] }>());
export const loadPagesFailure = createAction('[CMS] Load Pages Failure', props<{ error: string }>());
export const addPage = createAction('[CMS] Add Page', props<{ page: any }>());
export const createPage = createAction('[CMS] Create Page', props<{ page: any }>());
export const updatePage = createAction('[CMS] Update Page', props<{ page: any }>());
export const deletePage = createAction('[CMS] Delete Page', props<{ id: string }>());
