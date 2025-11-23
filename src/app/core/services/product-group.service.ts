import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_PRODUCT_GROUP, API_PRODUCT_GROUP_PUBLIC} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {BaseFilterRequest} from '../models/request.model';
import {ProductGroupDTO} from '../models/product.model';
import {createSearchRequestParams} from '../utils/request.util';

@Injectable({
  providedIn: 'root',
})
export class ProductGroupService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private productGroupAPI = this.applicationConfigService.getEndpointFor(API_PRODUCT_GROUP);
  private productGroupPublicAPI = this.applicationConfigService.getEndpointFor(API_PRODUCT_GROUP_PUBLIC);

  getAllWithPaging(request: BaseFilterRequest): Observable<BaseResponse<ProductGroupDTO[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<ProductGroupDTO[]>>(this.productGroupPublicAPI, {params: params});
  }

  getById(productGroupId: number): Observable<ProductGroupDTO | undefined> {
    return this.http.get<BaseResponse<ProductGroupDTO>>(this.productGroupPublicAPI + `/${productGroupId}`)
      .pipe(map(response => response.result));
  }

  createProductGroup(request: ProductGroupDTO): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.productGroupAPI, request);
  }

  updateProductGroup(request: ProductGroupDTO): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(this.productGroupAPI, request);
  }

  deleteProductGroupById(productGroupId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(this.productGroupAPI + `/${productGroupId}`);
  }
}
