import { Routes } from '@angular/router';
import { SIDEBAR_HOME_TITLE } from '../../constants/sidebar.constants';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    title: SIDEBAR_HOME_TITLE,
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'product/:id',                    // <--- route mới
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
    path: 'checkout',
    title: 'Thanh toán',
    loadComponent: () =>
      import('./checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
