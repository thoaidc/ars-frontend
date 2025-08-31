import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../core/guards/auth.guard';
import {
  SIDEBAR_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
  SIDEBAR_AUTHORIZATION_ROLES_MANAGEMENT_TITLE
} from '../../constants/sidebar.constant';

export const AUTHORIZATION_ROUTES: Routes = [
  {
    path: 'accounts',
    title: SIDEBAR_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./accounts/accounts.component').then(m => m.AccountsComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'roles',
    title: SIDEBAR_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent),
    canActivate: [AuthGuardFn]
  },
];
