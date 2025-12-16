import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_SHOP} from '../../constants/api.constants';
import {Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {Shop, ShopsFilter} from '../models/shop.model';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private shopAPI = this.applicationConfigService.getEndpointFor(API_SHOP);

  getAllWithPaging(request: ShopsFilter): Observable<BaseResponse<Shop[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<Shop[]>>(this.shopAPI, {params: params});
  }
}
