import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_CATEGORY, API_CATEGORY_PUBLIC} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {BaseFilterRequest} from '../models/request.model';
import {CategoryDTO} from '../models/product.model';
import {createSearchRequestParams} from '../utils/request.util';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private categoryAPI = this.applicationConfigService.getEndpointFor(API_CATEGORY);
  private categoryPublicAPI = this.applicationConfigService.getEndpointFor(API_CATEGORY_PUBLIC);

  getAllWithPaging(request: BaseFilterRequest): Observable<BaseResponse<CategoryDTO[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<CategoryDTO[]>>(this.categoryPublicAPI, {params: params});
  }

  getById(categoryId: number): Observable<CategoryDTO | undefined> {
    return this.http.get<BaseResponse<CategoryDTO>>(this.categoryPublicAPI + `/${categoryId}`)
      .pipe(map(response => response.result));
  }

  createCategory(request: CategoryDTO): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.categoryAPI, request);
  }

  updateCategory(request: CategoryDTO): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(this.categoryAPI, request);
  }

  deleteCategoryById(categoryId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(this.categoryAPI + `/${categoryId}`);
  }
}
