import {Routes} from '@angular/router';
import {LoginGuardFn} from './core/guards/login.guard';
import {AuthGuardFn} from './core/guards/auth.guard';
import {MainComponent} from './pages/main.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Đăng nhập',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuardFn]
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuardFn],
    loadChildren: () => import('./pages/main.routes').then(m => m.MAIN_ROUTES)
  }
];
