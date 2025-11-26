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
  description: string;
  customizable: boolean;
  status: string;
  thumbnailUrl: string;
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
  productOptionId: number;
  image: string;
  data?: any;
}

export interface CreateProductRequest {
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
  images?: any[];
}

export interface CreateOption {
  name: string;
  values: CreateOptionValue[];
}

export interface CreateOptionValue {
  image: string;
  data?: any;
}
