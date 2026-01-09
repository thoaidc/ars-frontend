import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';

export const SHOP_PRODUCT_ROUTES: Routes = [
  {
    path: 'groups',
    title: 'Nhóm sản phẩm',
    pathMatch: 'full',
    loadComponent: () => import('./product-group/product-group.component').then(m => m.ProductGroupComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'designs',
    title: 'Thiết kế',
    pathMatch: 'full',
    loadComponent: () => import('./product-design/product-design.component').then(m => m.ProductDesignComponent),
    canActivate: [AuthGuardFn]
  }
];
