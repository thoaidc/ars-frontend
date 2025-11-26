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
  variants?: VariantDTO[];
  categories?: CategoryDTO[];
  productGroups?: ProductGroupDTO[];
  productOptions?: ProductOptionDTO[];
}

export interface VariantDTO extends AuditingEntity {
  productId: number;
  attributeId: number;
  name: string;
  price: number;
  thumbnailUrl?: string;
  productOptions?: ProductOptionDTO[];
}

export interface CategoryDTO extends AuditingEntity {
  name: string;
  description?: string;
}

export interface AttributeDTO extends AuditingEntity {
  shopId: number;
  name: string;
}

export interface ProductGroupDTO extends AuditingEntity {
  shopId: number;
  name: string;
}

export interface ProductOptionDTO extends AuditingEntity {
  productId: number;
  name: string;
  attributes: ProductOptionAttributeDTO[];
}

export interface ProductOptionAttributeDTO extends AuditingEntity {
  productOptionId: number;
  image: string;
}

export interface CreateProductRequest {
  name: string;
  code: string;
  price: string;
  description?: string;
  customizable: boolean;
  thumbnail: any;
  originalImage: any;
  categoryIds?: number[];
  productGroupIds?: number[];
  options?: CreateOption[];
  variants?: CreateVariant[];
}

export interface CreateOption {
  name: string;
  images: any[];
}

export interface CreateVariant {
  thumbnail: any;
  originalImage?: any;
  name: string;
  price: number;
  attributeId: number;
  productOptionIds: number[];
}
