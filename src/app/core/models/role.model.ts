import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface Role extends AuditingEntity {
  name: string;
  code: string;
}

export interface RoleDetail extends Role {
  authorities: number[];
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  authorityIds: number[];
}

export interface UpdateRoleRequest extends CreateRoleRequest {
  id: number;
}

export interface RolesFilter extends BaseFilterRequest {
  code?: string;
}
