import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {
  API_COMMON_ACCOUNTS,
  API_COMMON_ACCOUNTS_UPDATE_STATUS,
  API_COMMON_CHANGE_PASSWORD
} from '../../constants/api.constants';
import {ApplicationConfigService} from '../config/application-config.service';
import {createSearchRequestParams} from '../utils/request.util';
import {BaseResponse} from '../models/response.model';
import {
  Account,
  AccountDetail,
  UpdateAccountStatusRequest,
  UpdateAccountPasswordRequest,
  SaveAccountRequest
} from '../models/account.model';
import {BaseFilterRequest} from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private accountsUrl = this.applicationConfigService.getEndpointFor(API_COMMON_ACCOUNTS);
  private accountStatusUrl = this.applicationConfigService.getEndpointFor(API_COMMON_ACCOUNTS_UPDATE_STATUS);
  private accountPasswordUrl = this.applicationConfigService.getEndpointFor(API_COMMON_CHANGE_PASSWORD);

  getAccountsWithPaging(searchRequest: BaseFilterRequest): Observable<BaseResponse<Account[]>> {
    const params = createSearchRequestParams(searchRequest);
    return this.http.get<BaseResponse<Account[]>>(this.accountsUrl, {params: params});
  }

  createAccount(createAccountRequest: SaveAccountRequest): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.accountsUrl}`, createAccountRequest);
  }

  updateAccount(updateAccountRequest: SaveAccountRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.accountsUrl}`, updateAccountRequest);
  }

  getAccountDetail(accountId: number): Observable<AccountDetail | null> {
    return this.http.get<BaseResponse<AccountDetail>>(`${this.accountsUrl}/${accountId}`).pipe(
      map(response => {
        if (response && response.result) {
          return response.result as AccountDetail;
        }

        return null;
      }),
      catchError(() => of(null))
    );
  }

  updateAccountStatus(updateAccountStatusRequest: UpdateAccountStatusRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.accountStatusUrl}`, updateAccountStatusRequest);
  }

  updateAccountPassword(updateAccountPasswordRequest: UpdateAccountPasswordRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.accountPasswordUrl}`, updateAccountPasswordRequest);
  }

  deleteAccount(accountId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.accountsUrl}/${accountId}`);
  }
}
