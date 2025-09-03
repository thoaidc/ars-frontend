import {AuditingEntity} from './common.model';
import {Role} from './role.model';

export interface User extends AuditingEntity {
  fullname: string;
  username: string;
  email: string;
  status: string;
  isAdmin: boolean;
}

export interface UserDetail extends User {
  phone: string;
  address: string;
  roles?: Role[];
}

export interface SaveUserRequest {
  id: number;
  phone?: string;
  address?: string;
  email: string;
  username: string;
  password: string;
  fullname: string;
  isAdmin: boolean;
  roleIds: number[];
}

export interface UpdateUserStatusRequest {
  id: number;
  status: string;
}

export interface UpdateUserPasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserEmailRequest {
  id: number;
  email: string;
}

export interface UserRecoverPasswordRequest {
  email: string;
}
