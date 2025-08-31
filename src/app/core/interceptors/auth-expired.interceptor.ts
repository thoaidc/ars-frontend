import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn, HttpErrorResponse
} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {StateStorageService} from '../services/state-storage.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {API_LOGIN} from '../../constants/api.constants';

export const AuthExpiredInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const stateStorageService = inject(StateStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        if (error.status == 401 && !error.url?.includes(API_LOGIN)) {
          stateStorageService.savePreviousPage(router.routerState.snapshot.url);
          authService.logout().subscribe(() => router.navigate(['/login']).then());
        }
      },
    })
  );
};
