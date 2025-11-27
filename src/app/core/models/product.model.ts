export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface Product {
  id: number;
  code: string;        // Mã sản phẩm
  name: string;        // Tên sản phẩm
  quantity: number;    // Số lượng
  unit: string;        // Đơn vị
  price: number;       // Giá bán
  taxRate: number;     // 0, 0.05, 0.1 ...
  status: ProductStatus;
  startedAt: string;   // ISO string
}
