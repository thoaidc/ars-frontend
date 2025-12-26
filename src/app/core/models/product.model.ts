import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface ProductsFilter extends BaseFilterRequest {
  code?: string;
  categoryId?: number;
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
  images?: ProductImageDTO[];
  categories?: CategoryDTO[];
  productGroups?: ProductGroupDTO[];
  productOptions?: ProductOptionDTO[];
}

export interface ProductImageDTO extends AuditingEntity {
  image: string;
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

export interface UpdateProductRequest {
  id: number;
  shopId: number;
  name: string;
  code: string;
  price: string;
  description?: string;
  customizable: boolean;
  thumbnail?: any;
  originalImage?: any;
  categoryIds?: number[];
  productGroupIds?: number[];
  options?: CreateOption[];
  productImages?: UpdateProductImage[];
}

export interface UpdateProductImage {
  id?: number;
  image: any;
}

export interface UpdateOption {
  id?: number;
  name: string;
  images: UpdateOptionImage[];
}

export interface UpdateOptionImage {
  id?: number;
  image: any;
}

export interface SelectedOptions {
  [optionId: number]: ProductOptionValueDTO;
}
