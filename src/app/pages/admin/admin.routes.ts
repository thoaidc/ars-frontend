import {Routes} from '@angular/router';
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
    title: 'Trang chủ',
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'shops',
    title: 'Danh sách cửa hàng',
    pathMatch: 'full',
    loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'categories',
    title: 'Danh mục sản phẩm',
    pathMatch: 'full',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'products',
    title: 'Sản phẩm',
    pathMatch: 'full',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuardFn]
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
    path: 'authorization',
    loadChildren: () => AUTHORIZATION_ROUTES
  },
  {
    path: 'securities',
    loadChildren: () => SECURITY_ROUTES
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
