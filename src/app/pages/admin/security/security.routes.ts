import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';

export const SECURITY_ROUTES: Routes = [
  {
    path: 'public-apis',
    title: 'API công khai',
    pathMatch: 'full',
    loadComponent: () => import('./public-api/public-api.component').then(m => m.PublicApiComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'rate-limiter',
    title: 'API không giới hạn truy cập',
    pathMatch: 'full',
    loadComponent: () => import('./rate-limiter/rate-limiter.component').then(m => m.RateLimiterComponent),
    canActivate: [AuthGuardFn]
  }
];
