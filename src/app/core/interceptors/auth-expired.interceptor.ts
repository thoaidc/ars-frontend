import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {StateStorageService} from '../services/state-storage.service';
import {Router} from '@angular/router';
import {API_USERS_LOGIN, API_USERS_REFRESH} from '../../constants/api.constants';
import {catchError, switchMap, throwError} from 'rxjs';

export const AuthExpiredInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const stateStorageService = inject(StateStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const doLogout = () => {
    stateStorageService.savePreviousPage(router.routerState.snapshot.url);
    authService.logout();
    router.navigate(['/login']).then();
  };

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !error.url?.includes(API_USERS_LOGIN)) {
        if (error.url?.includes(API_USERS_REFRESH)) {
          // Refresh token expired -> logout
          doLogout();
          return throwError(() => error);
        }

        // Try refreshing token before logging out
        return authService.refreshTokenShared().pipe(
          switchMap((newToken: string | null) => {
            if (newToken) {
              // Retry old request with new access token
              const retryReq = request.clone({setHeaders: { Authorization: `Bearer ${newToken}` }});
              return next(retryReq);
            }
            doLogout();
            return throwError(() => error);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            // If refresh also fails -> logout
            if (refreshError.status === 401) {
              doLogout();
            }

            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
