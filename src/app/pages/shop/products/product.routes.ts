import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';
import {SIDEBAR_GROUP_TITLE, SIDEBAR_PRODUCT_ITEM_TITLE} from '../../../constants/sidebar.constants';

export const SHOP_PRODUCT_ROUTES: Routes = [
  {
    path: 'groups',
    title: SIDEBAR_GROUP_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./product-group/product-group.component').then(m => m.ProductGroupComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'designs',
    title: SIDEBAR_PRODUCT_ITEM_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./product-design/product-design.component').then(m => m.ProductDesignComponent),
    canActivate: [AuthGuardFn]
  }
];
