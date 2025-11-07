import {Routes} from '@angular/router';
import {
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_PRODUCT_TITLE
} from '../../constants/sidebar.constants';
import {AuthGuardFn} from '../../core/guards/auth.guard';
import {AUTHORIZATION_ROUTES} from './authorization/authorization.routes';
import {SECURITY_ROUTES} from './security/security.routes';

export const ADMIN_ROUTES: Routes = [
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
    path: 'authorization',
    loadChildren: () => AUTHORIZATION_ROUTES
  },
  {
    path: 'security',
    loadChildren: () => SECURITY_ROUTES
  },
  {
    path: 'products',
    title: SIDEBAR_PRODUCT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuardFn]
  }
];
