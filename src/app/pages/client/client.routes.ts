import {Routes} from '@angular/router';
import {SIDEBAR_HOME_TITLE} from '../../constants/sidebar.constants';

export const CLIENT_ROUTES: Routes = [
  {
    path: 'home',
    title: SIDEBAR_HOME_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];
