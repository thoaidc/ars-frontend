import {catchError, map, Observable, of, Subject} from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {createSearchRequestParams} from '../utils/request.util';
import {API_COMMON_PERMISSIONS_TREE, API_COMMON_ROLES} from '../../constants/api.constants';
import {CreateRoleRequest, Role, RoleDetail, RolesFilter, TreeViewItem, UpdateRoleRequest} from '../models/role.model';
import {BaseResponse} from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private roleApiUrl = this.applicationConfigService.getEndpointFor(API_COMMON_ROLES);
  private permissionApiUrl = this.applicationConfigService.getEndpointFor(API_COMMON_PERMISSIONS_TREE);
  private searchSubject = new Subject<void>();
  searchObservable$ = this.searchSubject.asObservable();
  checkEvent = new EventEmitter();

  checked(): void {
    this.checkEvent.emit();
  }

  triggerSearch(): void {
    this.searchSubject.next();
  }

  getRoles(rolesFilter: RolesFilter): Observable<BaseResponse<Role[]>> {
    const params = createSearchRequestParams(rolesFilter);
    return this.http.get<BaseResponse<Role[]>>(`${this.roleApiUrl}`, { params: params });
  }

  getPermissions(): Observable<TreeViewItem[]> {
    return this.http.get<BaseResponse<TreeViewItem[]>>(`${this.permissionApiUrl}`).pipe(
      map(response => {
        if (response && response.status && response.result as TreeViewItem[]) {
          return response.result as TreeViewItem[];
        }

        return [];
      }),
      catchError(() => of([]))
    );
  }

  getRoleDetail(roleId: number): Observable<RoleDetail | null> {
    return this.http.get<BaseResponse<RoleDetail>>(`${this.roleApiUrl}/${roleId}`).pipe(
      map(response => {
        if (response && response.status && response.result as RoleDetail) {
          return response.result as RoleDetail;
        }

        return null;
      }),
      catchError(() => of(null))
    );
  }

  create(createRoleRequest: CreateRoleRequest): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.roleApiUrl}`, createRoleRequest);
  }

  update(updateRoleRequest: UpdateRoleRequest): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.roleApiUrl}`, updateRoleRequest);
  }

  delete(roleId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.roleApiUrl}/${roleId}`);
  }
}
