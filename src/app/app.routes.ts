import {Routes} from '@angular/router';
import {LoginGuardFn} from './core/guards/login.guard';
import {AdminComponent} from './pages/admin/admin.component';
import {ShopComponent} from './pages/shop/shop.component';
import {ClientComponent} from './pages/client/client.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Đăng nhập',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuardFn]
  },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'shop',
    component: ShopComponent,
    loadChildren: () => import('./pages/shop/shop.routes').then(m => m.SHOP_ROUTES)
  },
  {
    path: 'client',
    component: ClientComponent,
    loadChildren: () => import('./pages/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/client'
  }
];
