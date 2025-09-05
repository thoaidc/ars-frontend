export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  ACTIVE_INT = '1',
  INACTIVE_INT = '2',
  LOCKED_INT = '3'
}

export const USER_STATUS_MAP: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Dừng hoạt động',
  LOCKED: 'Đã bị khóa'
}

export const USER_STATUS_OPTIONS = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: USER_STATUS.ACTIVE,
    name: 'Hoạt động',
  },
  {
    value: USER_STATUS.INACTIVE,
    name: 'Dừng hoạt động',
  },
  {
    value: USER_STATUS.LOCKED,
    name: 'Đã bị khóa'
  }
];
