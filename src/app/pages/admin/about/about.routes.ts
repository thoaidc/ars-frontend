import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';
import {
  SIDEBAR_ABOUT_FORMS_TITLE,
  SIDEBAR_ABOUT_MOTTOS_TITLE,
  SIDEBAR_ABOUT_PARTNERS_TITLE,
  SIDEBAR_ABOUT_STORIES_TITLE
} from '../../../constants/sidebar.constant';

export const ABOUTS_ROUTES: Routes = [
  {
    path: 'stories',
    title: SIDEBAR_ABOUT_STORIES_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./stories/stories.component').then(m => m.StoriesComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'partners',
    title: SIDEBAR_ABOUT_PARTNERS_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./partners/partners.component').then(m => m.PartnersComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'mottos',
    title: SIDEBAR_ABOUT_MOTTOS_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./mottos/mottos.component').then(m => m.MottosComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'forms',
    title: SIDEBAR_ABOUT_FORMS_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./form-contact/form-contact.component').then(m => m.FormContactComponent),
    canActivate: [AuthGuardFn]
  },
];
