import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { AuthGuard } from './store/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
      { path: 'analytics', loadComponent: () => import('./components/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: 'payments', loadComponent: () => import('./components/payments/payments.component').then(m => m.PaymentsComponent) },
      { path: 'support', loadComponent: () => import('./components/support/support.component').then(m => m.SupportComponent) },
      { path: 'cms', loadComponent: () => import('./components/cms/cms.component').then(m => m.CmsComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'sales-details', loadComponent: () => import('./components/sales-details/sales-details.component').then(m => m.SalesDetailsComponent) },
      { path: 'revenue-details', loadComponent: () => import('./components/revenue-details/revenue-details.component').then(m => m.RevenueDetailsComponent) }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
