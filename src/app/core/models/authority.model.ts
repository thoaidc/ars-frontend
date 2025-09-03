import {AuditingEntity} from './common.model';

export interface Authority extends AuditingEntity {
  name: string;
  code: string;
  parentId: number;
  parentCode: string;
  description: string;
}

export interface TreeViewItem {
  id: number;
  name: string;
  code: string;
  disabled: boolean;
  checked: boolean;
  collapsed: boolean;
  children?: TreeViewItem[];
  parentId?: number[];
}
