import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from './auth/auth.reducer';
import { userReducer } from './user/user.reducer';
import { productReducer } from './product/product.reducer';
import { orderReducer } from './order/order.reducer';
import { analyticsReducer } from './analytics/analytics.reducer';
import { paymentReducer } from './payment/payment.reducer';
import { supportReducer } from './support/support.reducer';
import { cmsReducer } from './cms/cms.reducer';
import { settingsReducer } from './settings/settings.reducer';

export interface AppState {
  auth: any;
  users: any;
  products: any;
  orders: any;
  analytics: any;
  payments: any;
  support: any;
  cms: any;
  settings: any;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: userReducer,
  products: productReducer,
  orders: orderReducer,
  analytics: analyticsReducer,
  payments: paymentReducer,
  support: supportReducer,
  cms: cmsReducer,
  settings: settingsReducer
};
