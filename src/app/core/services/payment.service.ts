import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_PAYMENT, API_PAYMENT_PUBLIC
} from '../../constants/api.constants';
import {Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {PaymentHistoriesFilterRequest, PaymentHistory} from '../models/payment.model';

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
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<PaymentHistory[]>>(this.paymentAPI, {params: params});
  }
}
