import {Routes} from '@angular/router';
import {LoginGuardFn} from './core/guards/login.guard';
import {AuthGuardFn} from './core/guards/auth.guard';
import {AdminComponent} from './pages/admin/admin.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Đăng nhập',
    pathMatch: 'full',
    loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuardFn]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardFn],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
