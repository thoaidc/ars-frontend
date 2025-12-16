import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, ReplaySubject, shareReplay, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {StateStorageService} from './state-storage.service';
import {Router} from '@angular/router';
import {ApplicationConfigService} from '../config/application-config.service';
import {BaseResponse} from '../models/response.model';
import {filter} from 'rxjs/operators';
import {
  LOCAL_USER_AUTHORITIES_KEY,
  LOCAL_USER_TOKEN_KEY, LOCAL_USER_TYPE_KEY,
  LOCAL_USERNAME_KEY
} from '../../constants/local-storage.constants';
import {Authentication, LoginRequest} from '../models/auth.model';
import {API_USERS_LOGIN, API_USERS_LOGOUT, API_USERS_REFRESH, API_USERS_STATUS, API_USERS_REGISTER} from '../../constants/api.constants';

@Injectable({providedIn: 'root'})
export class AuthService {
  private authentication: Authentication | null = null;
  private refreshTokenCache$: Observable<string | null> | null = null;
  private authenticationCache$: Observable<Authentication> | null = null;
  private authenticationState = new ReplaySubject<Authentication | null>(1);

  constructor(
    private router: Router,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  authenticate(loginRequest?: LoginRequest, forceLogin?: boolean): Observable<Authentication | null> {
    if (!this.authenticationCache$ || forceLogin) {
      this.authenticationCache$ = this.getAuthenticate(loginRequest).pipe(
        catchError(() => {
          this.setAuthenticationState(null);
          return of(null);
        }),
        tap((account: Authentication | null) => this.setAuthenticationState(account)),
        filter((account): account is Authentication => account !== null),
        shareReplay(1)
      );
    }

    return this.authenticationCache$;
  }

  hasAllAuthorities(authorities: string[] | string): boolean {
    const requiredAuthorities = Array.isArray(authorities) ? authorities : [authorities];

    if (requiredAuthorities.length === 0) {
      return true;
    }

    if (!this.authentication || !this.authentication.authorities) {
      return false;
    }

    return requiredAuthorities.every(required => this.authentication!.authorities?.includes(required));
  }

  hasUserType(userTypes: string[] | string): boolean {
    const requiredUserType = Array.isArray(userTypes) ? userTypes : [userTypes];

    if (requiredUserType.length === 0) {
      return true;
    }

    if (!this.authentication || !this.authentication.type) {
      return false;
    }

    return requiredUserType.includes(this.authentication.type);
  }

  hasToken(): boolean {
    return !!localStorage.getItem(LOCAL_USER_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.authentication !== null;
  }

  subscribeAuthenticationState(): Observable<Authentication | null> {
    return this.authenticationState.asObservable();
  }

  /**
   * Observable helper to get the current username (or null) and be notified on changes
   */
  getUsername(): Observable<string | null> {
    return this.subscribeAuthenticationState().pipe(map(auth => auth?.username ?? null));
  }

  refreshToken(): Observable<string | null> {
    const refreshTokenAPI = this.applicationConfigService.getEndpointFor(API_USERS_REFRESH);
    return this.http.post<BaseResponse<string>>(refreshTokenAPI, {}).pipe(
      map(response => {
        if (response.status && response.result) {
          const newToken = response.result;
          localStorage.setItem(LOCAL_USER_TOKEN_KEY, newToken);
          return newToken;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  refreshTokenShared(): Observable<string | null> {
    if (!this.refreshTokenCache$) {
      this.refreshTokenCache$ = this.refreshToken().pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.refreshTokenCache$;
  }

  logout() {
    this.setAuthenticationState(null);
    this.clearData();
    const logoutAPI = this.applicationConfigService.getEndpointFor(API_USERS_LOGOUT);
    this.http.post<BaseResponse<any>>(logoutAPI, {}).subscribe();
  }

  getAuthenticate(loginRequest?: LoginRequest): Observable<Authentication | null> {
    const loginAPI = this.applicationConfigService.getEndpointFor(API_USERS_LOGIN);
    const userStatusAPI = this.applicationConfigService.getEndpointFor(API_USERS_STATUS);
    const apiUrl = loginRequest ? loginAPI : userStatusAPI;
    const requestBody = loginRequest ? loginRequest: {};

    return this.http.post<BaseResponse<Authentication>>(apiUrl, requestBody).pipe(
      map(response => {
        if (response.status && response.result) {
          return response.result as Authentication;
        }

        return null;
      }),
      catchError(() => of(null))
    );
  }

  setAuthenticationState(authentication: Authentication | null) {
    this.authentication = authentication;
    this.authenticationState.next(authentication);

    if (authentication) {
      if (authentication.accessToken) {
        localStorage.setItem(LOCAL_USER_TOKEN_KEY, authentication.accessToken);
      }

      localStorage.setItem(LOCAL_USER_TYPE_KEY, authentication.type);
      localStorage.setItem(LOCAL_USERNAME_KEY, authentication.username);
      localStorage.setItem(LOCAL_USER_AUTHORITIES_KEY, JSON.stringify(authentication.authorities));
    } else {
      this.authenticationCache$ = null;
    }
  }

  clearData() {
    this.refreshTokenCache$ = null;
    this.stateStorageService.clearPreviousPage();
    localStorage.removeItem(LOCAL_USERNAME_KEY);
    localStorage.removeItem(LOCAL_USER_TOKEN_KEY);
    localStorage.removeItem(LOCAL_USER_AUTHORITIES_KEY);
    localStorage.removeItem(LOCAL_USER_TYPE_KEY);
  }

  /**
   * Redirect to the page the user previously requested <p>
   * Previous page url can be set in the {@link AuthExpiredInterceptorFn} <p>
   * After login successfully, navigate to this page and clear old data
   * @private
   */
  navigateToPreviousPage(): void {
    const previousUrl = this.stateStorageService.getPreviousPage();

    if (previousUrl) {
      this.router.navigateByUrl(previousUrl).then();
    }
  }

  /**
   * Register a new user (public API)
   * @param registerRequest object with username,password,fullname,phone,email
   * @param isShop whether registering as a shop (appends ?isShop=true|false)
   */
  register(registerRequest: any, isShop = false): Observable<BaseResponse<any>> {
    const registerApi = this.applicationConfigService.getEndpointFor(API_USERS_REGISTER) + `?isShop=${isShop}`;
    return this.http.post<BaseResponse<any>>(registerApi, registerRequest).pipe(
      catchError((err) => {
        // rethrow error to be handled by caller
        throw err;
      })
    );
  }
}
