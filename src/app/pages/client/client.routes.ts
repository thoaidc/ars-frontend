import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    title: 'Trang chủ',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'product/:id',
    title: 'Chi tiết sản phẩm',
    loadComponent: () =>
      import('./product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    title: 'Giỏ hàng',
    loadComponent: () =>
      import('./cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'order-history',
    title: 'Lịch sử đơn hàng',
    loadComponent: () => import('./order-history/order-history.component').then(m => m.OrderHistoryComponent)
  },
  {
    path: 'user',
    title: 'Tài khoản',
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
