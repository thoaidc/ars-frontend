import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../core/guards/auth.guard';
import {AUTHORIZE_ROUTES} from './auth/auth.routes';
import {ABOUTS_ROUTES} from './about/about.routes';
import {WORKS_ROUTES} from './work/work.routes';
import {
  SIDEBAR_COMPANY_TITLE, SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_HIRING_TITLE,
  SIDEBAR_HOME_TITLE,
  SIDEBAR_PRODUCT_TITLE
} from '../../constants/sidebar.constant';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'authorize',
    loadChildren: () => AUTHORIZE_ROUTES,
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
    path: 'home',
    title: SIDEBAR_HOME_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'company',
    title: SIDEBAR_COMPANY_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'hiring',
    title: SIDEBAR_HIRING_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./hiring/hiring.component').then(m => m.HiringComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'products',
    title: SIDEBAR_PRODUCT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'abouts',
    loadChildren: () => ABOUTS_ROUTES,
    canActivate: [AuthGuardFn]
  },
  {
    path: 'works',
    loadChildren: () => WORKS_ROUTES,
    canActivate: [AuthGuardFn]
  },
];
