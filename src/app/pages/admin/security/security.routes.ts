import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';
import {
  SIDEBAR_SECURITY_PUBLIC_API_MANAGEMENT_TITLE,
  SIDEBAR_SECURITY_RATE_LIMITER_API_MANAGEMENT_TITLE
} from '../../../constants/sidebar.constants';

export const SECURITY_ROUTES: Routes = [
  {
    path: 'public-apis',
    title: SIDEBAR_SECURITY_PUBLIC_API_MANAGEMENT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./public-api/public-api.component').then(m => m.PublicApiComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'rate-limiter',
    title: SIDEBAR_SECURITY_RATE_LIMITER_API_MANAGEMENT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./rate-limiter/rate-limiter.component').then(m => m.RateLimiterComponent),
    canActivate: [AuthGuardFn]
  }
];
