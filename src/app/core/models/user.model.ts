export interface Authentication {
  email: string;
  username: string;
  status: string;
  authorities: string[];
}

export interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  status: string;
  createdBy: string;
  createdDate: string;
}

export interface UserDetail extends User {
  createdByStr?: string;
  createdDateStr?: string;
  lastModifiedByStr?: string;
  lastModifiedDateStr?: string;
  userRoles?: Authority[];
}

export interface Authority {
  id: number;
  name: string;
  code: string;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED'
}

export const UserStatusMap: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Dừng hoạt động',
  LOCKED: 'Đã bị khóa'
}

export const USER_STATUS_SELECTION = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: UserStatus.ACTIVE,
    name: 'Hoạt động',
  },
  {
    value: UserStatus.INACTIVE,
    name: 'Dừng hoạt động',
  },
  {
    value: UserStatus.LOCKED,
    name: 'Đã bị khóa'
  }
];

export interface SaveUserRequest {
  id: number;
  username: string;
  email: string;
  password: string;
  fullname?: string;
  roleIds: number[];
}

export interface UpdateUserStatusRequest {
  accountId: number;
  status: string;
}

export interface UpdateUserPasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
}
