import {SafeUrl} from '@angular/platform-browser';

export interface AuditingEntity {
  id: number;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface SingleSelectedImage {
  name: string;
  url: SafeUrl | null;
}
