import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {ApplicationConfigService} from '../config/application-config.service';
import {createSearchRequestParams} from '../utils/request.util';
import {BaseResponse} from '../models/response.model';
import {BaseFilterRequest} from '../models/request.model';
import {API_USERS, API_USERS_CHANGE_PASSWORD, API_USERS_STATUS} from '../../constants/api.constants';
import {
  SaveUserRequest,
  UpdateUserPasswordRequest,
  UpdateUserStatusRequest,
  User,
  UserDetail
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private usersAPI = this.applicationConfigService.getEndpointFor(API_USERS);
  private userStatusAPI = this.applicationConfigService.getEndpointFor(API_USERS_STATUS);
  private userChangePasswordAPI = this.applicationConfigService.getEndpointFor(API_USERS_CHANGE_PASSWORD);

  getUsersWithPaging(searchRequest: BaseFilterRequest): Observable<BaseResponse<User[]>> {
    const params = createSearchRequestParams(searchRequest);
    return this.http.get<BaseResponse<User[]>>(this.usersAPI, {params: params});
  }

  createUser(createUserRequest: SaveUserRequest): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.usersAPI}`, createUserRequest);
  }

  updateUser(updateUserRequest: SaveUserRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.usersAPI}`, updateUserRequest);
  }

  getUserDetail(userId: number): Observable<UserDetail | null> {
    return this.http.get<BaseResponse<UserDetail>>(`${this.usersAPI}/${userId}`).pipe(
      map(response => {
        if (response && response.result) {
          return response.result as UserDetail;
        }

        return null;
      }),
      catchError(() => of(null))
    );
  }

  updateUserStatus(updateUserStatusRequest: UpdateUserStatusRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.userStatusAPI}`, updateUserStatusRequest);
  }

  updateUserPassword(updateUserPasswordRequest: UpdateUserPasswordRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.userChangePasswordAPI}`, updateUserPasswordRequest);
  }

  deleteUser(userId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.usersAPI}/${userId}`);
  }
}
