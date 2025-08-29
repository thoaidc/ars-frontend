import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../../core/guards/auth.guard';
import {SIDEBAR_WORK_CATEGORIES_TITLE, SIDEBAR_WORK_PROJECTS_TITLE} from '../../../constants/sidebar.constant';

export const WORKS_ROUTES: Routes = [
  {
    path: 'categories',
    title: SIDEBAR_WORK_CATEGORIES_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./work-category/work-category.component').then(m => m.WorkCategoryComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'projects',
    title: SIDEBAR_WORK_PROJECTS_TITLE,
    pathMatch: 'full',
    loadComponent: () => import('./project/project.component').then(m => m.ProjectComponent),
    canActivate: [AuthGuardFn]
  },
];
