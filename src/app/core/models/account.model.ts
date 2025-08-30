export interface Authentication {
  email: string;
  username: string;
  status: string;
  authorities: string[];
}

export interface Account {
  id: number;
  fullname: string;
  username: string;
  email: string;
  status: string;
  createdBy: string;
  createdDate: string;
}

export interface AccountDetail extends Account {
  createdByStr?: string;
  createdDateStr?: string;
  lastModifiedByStr?: string;
  lastModifiedDateStr?: string;
  accountRoles?: Authority[];
}

export interface Authority {
  id: number;
  name: string;
  code: string;
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED'
}

export const AccountStatusMap: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Dừng hoạt động',
  LOCKED: 'Đã bị khóa'
}

export const ACCOUNT_STATUS_SELECTION = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: AccountStatus.ACTIVE,
    name: 'Hoạt động',
  },
  {
    value: AccountStatus.INACTIVE,
    name: 'Dừng hoạt động',
  },
  {
    value: AccountStatus.LOCKED,
    name: 'Đã bị khóa'
  }
];

export interface SaveAccountRequest {
  id: number;
  username: string;
  email: string;
  password: string;
  fullname?: string;
  roleIds: number[];
}

export interface UpdateAccountStatusRequest {
  accountId: number;
  status: string;
}

export interface UpdateAccountPasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
}
