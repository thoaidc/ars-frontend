import {Routes} from '@angular/router';
import {AuthGuardFn} from '../core/guards/auth.guard';
import {
  SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_PRODUCT_TITLE
} from '../constants/sidebar.constant';
import {AUTHORIZATION_ROUTES} from './auth/auth.routes';

export const MAIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'authorization',
    loadChildren: () => AUTHORIZATION_ROUTES,
    canActivate: [AuthGuardFn]
  },
  {
    path: 'customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'products',
    title: SIDEBAR_PRODUCT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuardFn]
  }
];
