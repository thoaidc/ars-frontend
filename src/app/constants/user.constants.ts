export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  ACTIVE_INT = '1',
  INACTIVE_INT = '2',
  LOCKED_INT = '3'
}

export const USER_STATUS_MAP: Record<string, string> = {
  ACTIVE: 'user.status.active',
  INACTIVE: 'user.status.inactive',
  LOCKED: 'user.status.locked'
}

export const USER_STATUS_OPTIONS = [
  {
    value: '',
    name: 'global.all',
  },
  {
    value: USER_STATUS.ACTIVE,
    name: USER_STATUS_MAP[USER_STATUS.ACTIVE]
  },
  {
    value: USER_STATUS.INACTIVE,
    name: USER_STATUS_MAP[USER_STATUS.INACTIVE]
  },
  {
    value: USER_STATUS.LOCKED,
    name: USER_STATUS_MAP[USER_STATUS.LOCKED]
  }
];

export const USER_TYPE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  SHOP: 'SHOP'
}
