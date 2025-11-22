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
  code: string;
  description: string;
}

export interface AttributeDTO extends AuditingEntity {
  shopId: number;
  name: string;
}

export interface ProductGroupDTO extends AuditingEntity {
  shopId: number;
  name: string;
  code: string;
  description: string;
}

export interface ProductOptionDTO extends AuditingEntity {
  productId: number;
  name: string;
  type: string;
  topPercentage?: number;
  leftPercentage?: number;
  widthPercentage?: number;
  heightPercentage?: number;
  description: string;
  attributes?: ProductOptionAttributeDTO[];
}

export interface ProductOptionAttributeDTO extends AuditingEntity {
  productOptionId: number;
  image?: string;
  text?: string;
}
