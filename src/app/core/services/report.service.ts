import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_REPORT,
  API_REVENUES_LAST_SEVEN_DAY, API_REVENUES_TODAY,
  API_SALES_LAST_SEVEN_DAY
} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {FinanceData, RevenueDashboardReportData} from '../models/report.model';
import {BaseFilterRequest} from '../models/request.model';
import {createSearchRequestParams} from '../utils/request.util';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private reportAPI = this.applicationConfigService.getEndpointFor(API_REPORT);
  private reportRevenueLast7DayAPI = this.applicationConfigService.getEndpointFor(API_REVENUES_LAST_SEVEN_DAY);
  private reportSalesLast7DayAPI = this.applicationConfigService.getEndpointFor(API_SALES_LAST_SEVEN_DAY);
  private revenueTodayAPI = this.applicationConfigService.getEndpointFor(API_REVENUES_TODAY);

  getRevenueDashboardReport(type: number, receiverId: number): Observable<BaseResponse<RevenueDashboardReportData[]>> {
    const params = createSearchRequestParams({type: type, receiverId: receiverId});
    return this.http.get<BaseResponse<RevenueDashboardReportData[]>>(this.reportRevenueLast7DayAPI, {params: params});
  }

  getSalesDashboardReport(type: number, receiverId: number): Observable<BaseResponse<RevenueDashboardReportData[]>> {
    const params = createSearchRequestParams({type: type, receiverId: receiverId});
    return this.http.get<BaseResponse<RevenueDashboardReportData[]>>(this.reportSalesLast7DayAPI, {params: params});
  }

  getRevenueToday(type: number, receiverId: number): Observable<number> {
    const params = createSearchRequestParams({type: type, receiverId: receiverId});
    return this.http.get<BaseResponse<number>>(this.revenueTodayAPI, {params: params})
      .pipe(map(response => response.result || 0));
  }

  getFinanceStatisticForShop(request: BaseFilterRequest): Observable<FinanceData | undefined> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<FinanceData>>(this.reportAPI, {params: params})
      .pipe(map(response => response.result));
  }
}
