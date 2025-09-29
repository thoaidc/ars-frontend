import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
  HttpInterceptor,
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  withFetch
} from '@angular/common/http';
import {AuthExpiredInterceptorFn} from './core/interceptors/auth-expired.interceptor';
import {ApiInterceptorFn} from './core/interceptors/api.interceptor';
import {provideToastr} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateDayjsAdapter} from './core/config/datepicker.config';
import {provideLoadingBar} from '@ngx-loading-bar/core';
import {provideLoadingBarRouter} from '@ngx-loading-bar/router';
import {CustomHttpLoaderFactory} from './core/config/i18n.config';
import {LOCALE} from './constants/common.constants';

/**
 * {@link provideHttpClient} configure HTTP Interceptors in Angular
 *
 * Functional interceptors are defined using the {@link HttpInterceptorFn} type
 * instead of implementing the {@link HttpInterceptor} interface
 *
 * Interceptors only work with HTTP requests made through Angular's {@link HttpClient}:
 *    - They do not work with {@link fetch()} or native {@link XMLHttpRequest}
 *    - When using {@link fetch()} or {@link XMLHttpRequest}, you need to manually add logic to ensure correct behavior
 *      (e.g., adding a token to the request, etc.)
 *
 * An Interceptor is a function used to intercept the HTTP request and response flow:
 *    - Before the request is sent ({@link HttpRequest})
 *    - After the response is received or in case of an error ({@link HttpResponse} / {@link HttpErrorResponse})
 *
 * Angular will combine all interceptors into a single processing chain (pipeline)
 *
 * In Angular 17+ / 18 (with Standalone API), interceptors do not need to be declared in `AppModule`:
 *    - Instead, interceptors are configured in {@link ApplicationConfig} within {@link appConfig.providers}.
 *
 * Execution order:
 *    - For **requests**: interceptors at the beginning of the array run first
 *    - For **responses**: interceptors at the end of the array run first
 *
 * Therefore, order interceptors by their role:
 *    - {@link AuthExpiredInterceptorFn}: Handle expired authentication
 *    - {@link ApiInterceptorFn}: Logging / modify URLs
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optional: to optimize change detection
    provideRouter(APP_ROUTES, withEnabledBlockingInitialNavigation()),
    provideTranslateService({
      defaultLanguage: LOCALE.VI,
      loader: {
        provide: TranslateLoader,
        useFactory: CustomHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    provideAnimations(),
    provideLoadingBar({ latencyThreshold: 0 }), // The request takes more than 0ms to start showing the loading bar
    provideLoadingBarRouter(), // To load according to route change
    provideToastr(),
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter }, // Date adapter
    provideHttpClient(
      withFetch(), // To let HttpClient use Fetch API instead of XMLHttpRequest (XHR)
      withInterceptors([
        ApiInterceptorFn,
        AuthExpiredInterceptorFn
      ])
    )
  ]
}
