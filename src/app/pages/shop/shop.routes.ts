import {Routes} from '@angular/router';
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
    title: 'Trang chủ',
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
    title: 'Mã giảm giá',
    pathMatch: 'full',
    loadComponent: () => import('./voucher/voucher.component').then(m => m.VoucherComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'orders',
    title: 'Đơn hàng',
    pathMatch: 'full',
    loadComponent: () => import('./order/order.component').then(m => m.OrderComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'finance',
    title: 'Tài chính',
    pathMatch: 'full',
    loadComponent: () => import('./finance/finance.component').then(m => m.FinanceComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'statistics',
    title: 'Thống kê báo cáo',
    pathMatch: 'full',
    loadComponent: () => import('./statistic/statistic.component').then(m => m.StatisticComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
