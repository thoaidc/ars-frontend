import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_PRODUCT, API_PRODUCT_PUBLIC} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {Product, ProductsFilter} from '../models/product.model';
import {createSearchRequestParams} from '../utils/request.util';
import {BaseResponse} from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private productAPI = this.applicationConfigService.getEndpointFor(API_PRODUCT);
  private productPublicAPI = this.applicationConfigService.getEndpointFor(API_PRODUCT_PUBLIC);

  getAllWithPaging(request: ProductsFilter): Observable<BaseResponse<Product[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<Product[]>>(this.productPublicAPI, {params: params});
  }

  getById(productId: number): Observable<Product | undefined> {
    return this.http.get<BaseResponse<Product>>(this.productPublicAPI + `/${productId}`)
      .pipe(map(response => response.result));
  }

  createProduct(request: Product): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.productAPI, request);
  }

  updateProduct(request: Product): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(this.productAPI, request);
  }

  deleteProductById(productId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(this.productAPI + `/${productId}`);
  }
}
