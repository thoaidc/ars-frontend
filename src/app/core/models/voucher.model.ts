import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface VouchersFilter extends BaseFilterRequest {
  shopId?: number;
  type?: number;
  active?: number;
}

export interface Voucher extends AuditingEntity {
  shopId: number;
  type: number;
  status: number;
  name: string;
  code: string;
  value: number;
  dateStarted?: number;
  dateExpired?: number;
}

export const VoucherType = [
  {
    name: 'Giảm giá theo giá trị',
    value: 1
  },
  {
    name: 'Giảm giá theo phần trăm',
    value: 2
  }
];
