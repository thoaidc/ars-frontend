import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_BALANCE
} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private balanceAPI = this.applicationConfigService.getEndpointFor(API_BALANCE);

  getShopBalance(): Observable<number | undefined> {
    return this.http.get<BaseResponse<number>>(this.balanceAPI)
      .pipe(map(response => response.result));
  }
}
