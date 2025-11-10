import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {ApplicationConfigService} from '../config/application-config.service';
import {BaseResponse} from '../models/response.model';
import {
  PUBLIC_PATTERNS_CONFIG_API,
  RATE_LIMITER_API,
  RATE_LIMITER_EXCLUDED_API
} from '../../constants/api.constants';
import {RateLimiterDTO} from '../models/gateway-security.model';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class GatewaySecurityService {
  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private toast: ToastrService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  rateLimiterAPI = this.applicationConfigService.getEndpointFor(RATE_LIMITER_API);
  rateLimitExcludedAPI = this.applicationConfigService.getEndpointFor(RATE_LIMITER_EXCLUDED_API);
  publicPatternsConfigAPI = this.applicationConfigService.getEndpointFor(PUBLIC_PATTERNS_CONFIG_API);

  getAllRateLimiterRoutingConfigs(): Observable<RateLimiterDTO[]> {
    return this.http.get<BaseResponse<RateLimiterDTO[]>>(this.rateLimiterAPI).pipe(map(response => response.result || []));
  }

  getAllRateLimitExcludedApi(): Observable<string[]> {
    return this.http.get<BaseResponse<string[]>>(this.rateLimitExcludedAPI).pipe(map(response => response.result || []));
  }

  getPublicApiPatternConfigs(): Observable<string[]> {
    return this.http.get<BaseResponse<string[]>>(this.publicPatternsConfigAPI).pipe(map(response => response.result || []));
  }

  updateRateLimiterConfig(request: RateLimiterDTO[]): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(this.rateLimiterAPI, request);
  }

  updateRateLimitExcludedApi(request: string[]): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(this.rateLimitExcludedAPI, request);
  }

  updatePublicApiPatternConfigs(request: string[]): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(this.publicPatternsConfigAPI, request);
  }

  resetRateLimiterConfig(): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.rateLimiterAPI + '/reset', {});
  }

  resetRateLimitExcludedApi(): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.rateLimitExcludedAPI + '/reset', {});
  }

  resetPublicApiPatternConfigs(): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.publicPatternsConfigAPI + '/reset', {});
  }

  notify(response: BaseResponse<any>, modalRef?: NgbModalRef) {
    if (response && response.status) {
      this.toast.success(this.translateService.instant('notification.updateConfigSuccess'));
      if (modalRef) {
        modalRef.close();
        // noinspection JSUnusedAssignment
        modalRef = undefined;
      }
    } else {
      this.toast.error(
        response.message
          ? response.message
          : this.translateService.instant('notification.updateConfigFailed')
      );
    }
  }

  error(error: any) {
    this.toast.error(
      error.error.message[0].message
        ? error.error.message[0].message
        : this.translateService.instant('notification.updateConfigFailed')
    );
  }
}
