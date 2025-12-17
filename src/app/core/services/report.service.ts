import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_REPORT, API_REPORT_REVENUE_DASHBOARD, API_REPORT_SALES_DASHBOARD} from '../../constants/api.constants';
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
  private reportRevenueLast7DayAPI = this.applicationConfigService.getEndpointFor(API_REPORT_REVENUE_DASHBOARD);
  private reportSalesLast7DayAPI = this.applicationConfigService.getEndpointFor(API_REPORT_SALES_DASHBOARD);

  getRevenueDashboardReport(): Observable<BaseResponse<RevenueDashboardReportData[]>> {
    return this.http.get<BaseResponse<RevenueDashboardReportData[]>>(this.reportRevenueLast7DayAPI, {});
  }

  getSalesDashboardReport(): Observable<BaseResponse<RevenueDashboardReportData[]>> {
    return this.http.get<BaseResponse<RevenueDashboardReportData[]>>(this.reportSalesLast7DayAPI, {});
  }

  getFinanceStatisticForShop(request: BaseFilterRequest): Observable<FinanceData | undefined> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<FinanceData>>(this.reportAPI, {params: params})
      .pipe(map(response => response.result));
  }
}
