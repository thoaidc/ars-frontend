import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_STATISTIC_REVENUE, API_STATISTIC_REVENUE_EXCEL} from '../../constants/api.constants';
import {ReportDTO, StatisticFilter} from '../models/statistic.model';
import {Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private statisticAPI = this.applicationConfigService.getEndpointFor(API_STATISTIC_REVENUE);
  private statisticExcelAPI = this.applicationConfigService.getEndpointFor(API_STATISTIC_REVENUE_EXCEL);

  getAllWithPaging(request: StatisticFilter): Observable<BaseResponse<ReportDTO[]>> {
    const requests = {...request, page: request.page - 1};
    const params = createSearchRequestParams(requests);
    return this.http.get<BaseResponse<ReportDTO[]>>(this.statisticAPI, {params: params});
  }

  exportExcel(request: StatisticFilter) {
    const requests = {...request, page: request.page - 1};
    const params = createSearchRequestParams(requests);
    return this.http.get(this.statisticExcelAPI, {params: params, responseType: 'blob'});
  }
}
