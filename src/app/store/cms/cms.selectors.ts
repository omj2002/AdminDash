import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CmsState } from './cms.reducer';

export const selectCmsState = createFeatureSelector<CmsState>('cms');

export const selectPages = createSelector(
  selectCmsState,
  (state) => state.pages
);

export const selectSelectedPage = createSelector(
  selectCmsState,
  (state) => state.selectedPage
);

export const selectLoading = createSelector(
  selectCmsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectCmsState,
  (state) => state.error
);
