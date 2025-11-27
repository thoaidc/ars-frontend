import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface ProductsFilter extends BaseFilterRequest {
  code?: string;
}

export interface Product extends AuditingEntity {
  shopId: number;
  name: string;
  code: string;
  price: string;
  status: string;
  thumbnailUrl: string;
  customizable: boolean;
  description?: string;
  images?: string[];
  categories?: CategoryDTO[];
  productGroups?: ProductGroupDTO[];
  productOptions?: ProductOptionDTO[];
}

export interface CategoryDTO extends AuditingEntity {
  name: string;
  description?: string;
}

export interface ProductGroupDTO extends AuditingEntity {
  shopId: number;
  name: string;
}

export interface ProductOptionDTO extends AuditingEntity {
  productId: number;
  name: string;
  values: ProductOptionValueDTO[];
}

export interface ProductOptionValueDTO extends AuditingEntity {
  image: string;
}

export interface CreateProductRequest {
  shopId: number;
  name: string;
  code: string;
  price: string;
  description?: string;
  customizable: boolean;
  thumbnail: any;
  originalImage?: any;
  categoryIds?: number[];
  productGroupIds?: number[];
  options?: CreateOption[];
  productImages?: any[];
}

export interface CreateOption {
  name: string;
  images: any[];
}
