import {AuditingEntity} from './common.model';
import {BaseFilterRequest} from './request.model';

export interface ReviewsFilter extends BaseFilterRequest {
  shopId: number;
  productId: number;
  customerId?: number;
}

export interface Review extends AuditingEntity {
  shopId: number;
  productId: number;
  customerId: number;
  customerName: string;
  image?: string;
  content: string;
}

export interface SaveReviewRequest {
  customerId: number;
  customerName: string;
  reviews: ReviewRequest[];
}

export interface ReviewRequest {
  shopId: number;
  productId: number;
  orderProductId: number;
  image: any;
  content: string;
}
