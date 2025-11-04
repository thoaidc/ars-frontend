import {AuditingEntity} from './common.model';
import {USER_TYPE} from '../../constants/user.constants';

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
  type: USER_TYPE;
  status: string;
  accessToken: string;
  authorities: string[];
}
