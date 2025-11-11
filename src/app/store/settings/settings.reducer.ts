import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';

export interface SettingsState {
  settings: any;
  loading: boolean;
  error: string | null;
}

export const initialState: SettingsState = {
  settings: {},
  loading: false,
  error: null
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.loadSettings, (state) => ({
    ...state,
    loading: true
  })),
  on(SettingsActions.loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    loading: false
  })),
  on(SettingsActions.loadSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
