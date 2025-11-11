import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectSettings = createSelector(
  selectSettingsState,
  (state) => state.settings
);

export const selectLoading = createSelector(
  selectSettingsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectSettingsState,
  (state) => state.error
);
