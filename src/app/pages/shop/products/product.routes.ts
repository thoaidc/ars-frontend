import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';
import {
  SIDEBAR_ATTRIBUTE_TITLE, SIDEBAR_GROUP_TITLE, SIDEBAR_PRODUCT_ITEM_TITLE
} from '../../../constants/sidebar.constants';

export const SHOP_PRODUCT_ROUTES: Routes = [
  {
    path: 'attributes',
    title: SIDEBAR_ATTRIBUTE_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./product-attribute/product-attribute.component').then(m => m.ProductAttributeComponent),
    canActivate: [AuthGuardFn]
  },
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
