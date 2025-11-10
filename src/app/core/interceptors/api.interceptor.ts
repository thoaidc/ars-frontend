import {inject} from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ApplicationConfigService} from '../config/application-config.service';
import {tap} from 'rxjs';
import {LOCAL_LANG_KEY, LOCAL_USER_TOKEN_KEY} from '../../constants/local-storage.constants';
import {LOCALE} from '../../constants/common.constants';

export const ApiInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const toast = inject(ToastrService);
  const appConfig = inject(ApplicationConfigService);
  const isApiRequest = request.url.startsWith(appConfig.getEndpointFor('api'));
  const langKey = localStorage.getItem(LOCAL_LANG_KEY) || LOCALE.VI;
  let modifiedReq = request;

  if (isApiRequest) {
    const token = localStorage.getItem(LOCAL_USER_TOKEN_KEY);

    modifiedReq = request.clone({
      withCredentials: true,
      setHeaders: {
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        'Accept-Language': Object.values(LOCALE).includes(langKey) ? langKey : LOCALE.VI
      }
    });
  }

  return next(modifiedReq).pipe(
    tap({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        if (error.error && error.message) {
          // Here use langKey comparison operator instead of TranslateService to avoid circular dependency error
          toast.error(error.error.message);
        }
      }
    })
  );
};
