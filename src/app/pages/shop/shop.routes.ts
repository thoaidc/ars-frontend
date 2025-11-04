import {Routes} from '@angular/router';
import {
  SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_PRODUCT_TITLE
} from '../../constants/sidebar.constants';
import {AuthGuardFn} from '../../core/guards/auth.guard';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
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
