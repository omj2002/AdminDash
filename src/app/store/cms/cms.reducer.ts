import { createReducer, on } from '@ngrx/store';
import * as CmsActions from './cms.actions';

export interface CmsState {
  pages: any[];
  selectedPage: any;
  loading: boolean;
  error: string | null;
}

export const initialState: CmsState = {
  pages: [],
  selectedPage: null,
  loading: false,
  error: null
};

export const cmsReducer = createReducer(
  initialState,
  on(CmsActions.loadPages, (state) => ({
    ...state,
    loading: true
  })),
  on(CmsActions.loadPagesSuccess, (state, { pages }) => ({
    ...state,
    pages,
    loading: false
  })),
  on(CmsActions.loadPagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CmsActions.addPage, (state, { page }) => ({
    ...state,
    pages: [...state.pages, page]
  })),
  on(CmsActions.updatePage, (state, { page }) => ({
    ...state,
    pages: state.pages.map(p => p.id === page.id ? page : p)
  })),
  on(CmsActions.deletePage, (state, { id }) => ({
    ...state,
    pages: state.pages.filter(p => p.id !== id)
  }))
);
