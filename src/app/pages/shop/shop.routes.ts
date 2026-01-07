import {Routes} from '@angular/router';
import {
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_FINANCE_TITLE,
  SIDEBAR_ORDER_TITLE,
  SIDEBAR_STATISTIC_TITLE,
  SIDEBAR_VOUCHER_TITLE
} from '../../constants/sidebar.constants';
import {AuthGuardFn} from '../../core/guards/auth.guard';
import {SHOP_PRODUCT_ROUTES} from './products/product.routes';

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
    path: 'products',
    loadChildren: () => SHOP_PRODUCT_ROUTES
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
    path: '**',
    redirectTo: 'dashboard'
  }
];
