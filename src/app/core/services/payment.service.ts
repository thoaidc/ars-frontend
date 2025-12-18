import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_PAYMENT, API_PAYMENT_PUBLIC
} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {
  PaymentHistoriesFilterRequest,
  PaymentHistory,
  PaymentHistoryDetail,
  PaymentInfo
} from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private paymentAPI = this.applicationConfigService.getEndpointFor(API_PAYMENT);
  private paymentPublicAPI = this.applicationConfigService.getEndpointFor(API_PAYMENT_PUBLIC);

  getPaymentHistoriesWithPaging(request: PaymentHistoriesFilterRequest): Observable<BaseResponse<PaymentHistory[]>> {
    request = {...request, page: request.page - 1};
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<PaymentHistory[]>>(this.paymentAPI + '/histories', {params: params});
  }

  getPaymentInfo(orderId: number): Observable<PaymentInfo | undefined> {
    return this.http.get<BaseResponse<PaymentInfo>>(this.paymentPublicAPI + `/qr/${orderId}`, {})
      .pipe(map(response => response.result));
  }

  getPaymentHistoryById(paymentHistoryId: number): Observable<PaymentHistoryDetail | undefined> {
    return this.http.get<BaseResponse<PaymentHistoryDetail>>(this.paymentAPI + `/histories/${paymentHistoryId}`, {})
      .pipe(map(response => response.result));
  }
}
