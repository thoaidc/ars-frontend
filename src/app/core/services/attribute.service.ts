import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_ATTRIBUTE, API_ATTRIBUTE_PUBLIC} from '../../constants/api.constants';
import {Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {BaseFilterRequest} from '../models/request.model';
import {AttributeDTO} from '../models/product.model';
import {createSearchRequestParams} from '../utils/request.util';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private attributeAPI = this.applicationConfigService.getEndpointFor(API_ATTRIBUTE);
  private attributePublicAPI = this.applicationConfigService.getEndpointFor(API_ATTRIBUTE_PUBLIC);

  getAllWithPaging(request: BaseFilterRequest): Observable<BaseResponse<AttributeDTO[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<AttributeDTO[]>>(this.attributePublicAPI, {params: params});
  }

  saveAttribute(request: AttributeDTO): Observable<BaseResponse<any>> {
    if (request.id && request.id > 0) {
      return this.http.post<BaseResponse<any>>(this.attributeAPI, request);
    } else {
      return this.http.put<BaseResponse<any>>(this.attributeAPI, request);
    }
  }

  deleteAttributeById(attributeId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(this.attributeAPI + `/${attributeId}`);
  }
}
