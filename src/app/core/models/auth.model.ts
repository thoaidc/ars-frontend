import {AuditingEntity} from './common.model';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface Authentication extends AuditingEntity {
  username: string;
  password: string;
  fullname: string;
  address: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  status: string;
  accessToken: string;
  authorities: string[];
}
