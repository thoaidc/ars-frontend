import {BaseFilterRequest} from './request.model';

export interface PaymentHistoriesFilterRequest extends BaseFilterRequest {

}

export interface PaymentHistory {
  id: number;
  type: number;
  transId: string;
  refId: number;
  refCode: string;
  userId: number;
  username: string;
  paymentTime: string;
  amount: number;
  status: string;
  description: string;
}
