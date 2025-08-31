import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {ApplicationConfigService} from '../config/application-config.service';
import {createSearchRequestParams} from '../utils/request.util';
import {BaseResponse} from '../models/response.model';
import {BaseFilterRequest} from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}
  //
  // private usersUrl = this.applicationConfigService.getEndpointFor(API_ACCOUNTS);
  // private userStatusUrl = this.applicationConfigService.getEndpointFor(API_ACCOUNTS_UPDATE_STATUS);
  // private userPasswordUrl = this.applicationConfigService.getEndpointFor(API_CHANGE_PASSWORD);
  //
  // getAccountsWithPaging(searchRequest: BaseFilterRequest): Observable<BaseResponse<Account[]>> {
  //   const params = createSearchRequestParams(searchRequest);
  //   return this.http.get<BaseResponse<Account[]>>(this.usersUrl, {params: params});
  // }
  //
  // createAccount(createAccountRequest: SaveAccountRequest): Observable<BaseResponse<any>> {
  //   return this.http.post<BaseResponse<any>>(`${this.usersUrl}`, createAccountRequest);
  // }
  //
  // updateAccount(updateAccountRequest: SaveAccountRequest): Observable<BaseResponse<any>> {
  //   return this.http.put<BaseResponse<any>>(`${this.usersUrl}`, updateAccountRequest);
  // }
  //
  // getAccountDetail(userId: number): Observable<AccountDetail | null> {
  //   return this.http.get<BaseResponse<AccountDetail>>(`${this.usersUrl}/${userId}`).pipe(
  //     map(response => {
  //       if (response && response.result) {
  //         return response.result as AccountDetail;
  //       }
  //
  //       return null;
  //     }),
  //     catchError(() => of(null))
  //   );
  // }
  //
  // updateAccountStatus(updateAccountStatusRequest: UpdateAccountStatusRequest): Observable<BaseResponse<any>> {
  //   return this.http.put<BaseResponse<any>>(`${this.userStatusUrl}`, updateAccountStatusRequest);
  // }
  //
  // updateAccountPassword(updateAccountPasswordRequest: UpdateAccountPasswordRequest): Observable<BaseResponse<any>> {
  //   return this.http.put<BaseResponse<any>>(`${this.userPasswordUrl}`, updateAccountPasswordRequest);
  // }
  //
  // deleteAccount(userId: number): Observable<BaseResponse<any>> {
  //   return this.http.delete<BaseResponse<any>>(`${this.usersUrl}/${userId}`);
  // }
}
