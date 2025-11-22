import {Routes} from '@angular/router';
import {
  SIDEBAR_CATEGORY_TITLE,
  SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_FINANCE_TITLE,
  SIDEBAR_ORDER_TITLE,
  SIDEBAR_PRODUCT_TITLE,
  SIDEBAR_SETTING_TITLE,
  SIDEBAR_SHOP_TITLE,
  SIDEBAR_STATISTIC_TITLE,
  SIDEBAR_SUPPORT_TITLE
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
    path: 'customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./customer/customer.component').then(m => m.CustomerComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'shops',
    title: SIDEBAR_SHOP_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'categories',
    title: SIDEBAR_CATEGORY_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
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
    path: 'orders',
    title: SIDEBAR_ORDER_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./order/order.component').then(m => m.OrderComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'finance',
    title: SIDEBAR_FINANCE_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./finance/finance.component').then(m => m.FinanceComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'statistics',
    title: SIDEBAR_STATISTIC_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./statistic/statistic.component').then(m => m.StatisticComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'supports',
    title: SIDEBAR_SUPPORT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./support/support.component').then(m => m.SupportComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'authorization',
    loadChildren: () => AUTHORIZATION_ROUTES
  },
  {
    path: 'securities',
    loadChildren: () => SECURITY_ROUTES
  },
  {
    path: 'settings',
    title: SIDEBAR_SETTING_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./setting/setting.component').then(m => m.SettingComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
