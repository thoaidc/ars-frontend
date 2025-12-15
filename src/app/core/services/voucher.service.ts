import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_VOUCHER} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {Voucher, VouchersFilter} from '../models/voucher.model';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private voucherAPI = this.applicationConfigService.getEndpointFor(API_VOUCHER);

  getAllWithPaging(request: VouchersFilter): Observable<BaseResponse<Voucher[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<Voucher[]>>(this.voucherAPI, {params: params});
  }

  getById(voucherId: number): Observable<Voucher | undefined> {
    return this.http.get<BaseResponse<Voucher>>(this.voucherAPI + `/${voucherId}`)
      .pipe(map(response => response.result));
  }

  saveVoucher(request: Voucher): Observable<BaseResponse<any>> {
    if (request.id && request.id > 0) {
      return this.http.put<BaseResponse<any>>(this.voucherAPI, request);
    } else {
      const createVoucherRequest = {
        ...request,
        id: null
      }
      return this.http.post<BaseResponse<any>>(this.voucherAPI, createVoucherRequest);
    }
  }

  deleteVoucherById(voucherId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(this.voucherAPI + `/${voucherId}`);
  }
}
