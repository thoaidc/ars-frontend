import {Routes} from '@angular/router';
import {
  SIDEBAR_CATEGORY_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_FINANCE_TITLE,
  SIDEBAR_ORDER_TITLE,
  SIDEBAR_PRODUCT_TITLE,
  SIDEBAR_SETTING_TITLE,
  SIDEBAR_SHOP_TITLE,
  SIDEBAR_STATISTIC_TITLE,
  SIDEBAR_VOUCHER_TITLE
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
    path: 'vouchers',
    title: SIDEBAR_VOUCHER_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./voucher/voucher.component').then(m => m.VoucherComponent),
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
