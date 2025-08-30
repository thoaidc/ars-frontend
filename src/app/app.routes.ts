import {Routes} from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    title: 'Home',
    pathMatch: 'full',
    loadComponent: () => import('./pages/main.component').then(m => m.MainComponent),
  }
];
