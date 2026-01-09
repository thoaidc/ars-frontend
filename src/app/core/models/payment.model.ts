import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface PaymentHistoriesFilterRequest extends BaseFilterRequest {
  shopId?: number;
  userId?: number;
  transId?: string;
}

export interface PaymentHistory extends AuditingEntity {
  type: number;
  userId: number;
  receiverId: number;
  transId: string;
  username: string;
  amount: number;
  status: string;
  description: string;
  paymentMethod: string;
  paymentTime: string;
}

export interface PaymentHistoryDetail extends PaymentHistory {
  error?: string;
}

export interface PaymentInfo {
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  expiredAt: number;
  checkoutUrl: string;
  qrCode: string;
}
