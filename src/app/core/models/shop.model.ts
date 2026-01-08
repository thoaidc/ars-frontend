import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface ShopsFilter extends BaseFilterRequest {

}

export interface Shop extends AuditingEntity {
  name: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  description?: string;
  status: string;
}
