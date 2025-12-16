import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface OrdersFilter extends BaseFilterRequest {
  userId?: number;
  shopId?: number;
  orderCode?: number;
  customerName?: number;
  paymentStatus?: number;
}

export interface Order extends AuditingEntity {
  code: string;
  status: string;
  customerId: number;
  customerName: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
}

export interface OrderDetail extends Order {
  discount: number;
  amount: number;
  subOrders?: SubOrder[];
  products: OrderProduct[];
}

export interface SubOrder extends Order {
  shopId: number;
  orderId: number;
}

export interface SubOrderDetail extends SubOrder {
  discount: number;
  amount: number;
  products: OrderProduct[];
}

export interface OrderProduct {
  id: number;
  subOrderId: number;
  orderId: number;
  shopId: number;
  productId: number;
  productCode: string;
  productName: string;
  productThumbnail: string;
  note?: string;
  data?: string;
  totalAmount: number;
}

export interface CreateOrderRequest {
  customerId: number;
  customerName: string;
  paymentMethod: string;
  voucherIds: number[];
  products: OrderProductRequest[];
}

export interface OrderProductRequest {
  shopId: number;
  productId: number;
  note?: string;
  data?: string;
}

export const OrderViewType = {
  SUB_ORDER: 'SUB_ORDER',
  ORDER: 'ORDER'
}
