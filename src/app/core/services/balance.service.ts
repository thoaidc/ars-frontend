import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_BALANCE_FOR_ADMIN, API_BALANCE_FOR_SHOP
} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {BalanceType} from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private balanceForShopAPI = this.applicationConfigService.getEndpointFor(API_BALANCE_FOR_SHOP);
  private balanceForAdminAPI = this.applicationConfigService.getEndpointFor(API_BALANCE_FOR_ADMIN);

  getBalance(type: number): Observable<number | undefined> {
    const api = type === BalanceType.ADMIN ? this.balanceForAdminAPI : this.balanceForShopAPI;
    return this.http.get<BaseResponse<number>>(api).pipe(map(response => response.result));
  }
}
