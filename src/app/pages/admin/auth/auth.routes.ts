import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';
import {
  SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE
} from '../../../constants/sidebar.constant';

export const AUTHORIZE_ROUTES: Routes = [
  {
    path: 'accounts',
    title: SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./accounts/accounts.component').then(m => m.AccountsComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'roles',
    title: SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent),
    canActivate: [AuthGuardFn]
  },
];
