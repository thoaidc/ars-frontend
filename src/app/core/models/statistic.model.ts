import {BaseFilterRequest} from './request.model';

export interface StatisticFilter extends BaseFilterRequest {
  shopId?: number;
}

export interface ReportDTO {
  productId: number;
  productCode: string;
  productName: string;
  grossRevenue: number;
  netRevenue: number;
  totalSales: number;
}
