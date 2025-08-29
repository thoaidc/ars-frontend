import {Component, Input} from '@angular/core';
import {RolesService} from '../../../../../core/services/roles.service';
import {ICON_CARET_DOWN, ICON_CARET_RIGHT} from '../../../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../../../shared/pipes/safe-html.pipe';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TreeViewItem} from '../../../../../core/models/role.model';

@Component({
  selector: 'app-tree-view-item',
  standalone: true,
  templateUrl: './tree-view-item.component.html',
  styleUrls: ['./tree-view-item.component.scss'],
  imports: [
    SafeHtmlPipe,
    NgIf,
    NgFor,
    FormsModule,
    NgClass
  ]
})
export class TreeViewItemComponent {
  @Input() tree?: TreeViewItem[];
  @Input() options: any;
  @Input() isChildren: any;
  @Input() isView = false;

  constructor(private checkService: RolesService) {}

  updateTree(): void {
    this.checkService.checked();
  }

  onCollapseExpand(node: TreeViewItem): void {
    if (node.children && node.children.length > 0) {
      node.collapsed = !node.collapsed;
    }
  }

  onCheck(node: TreeViewItem): void {
    if (node.collapsed) {
      this.onCollapseExpand(node);
    }

    this.onCheckNode(node);
  }

  onCheckNode(node: TreeViewItem): void {
    if (node.children && node.children.length > 0) {
      node.children.forEach(item => {
        item.checked = node.checked;
        this.onCheck(item);
      });
    }
  }

  protected readonly ICON_CARET_RIGHT = ICON_CARET_RIGHT;
  protected readonly ICON_CARET_DOWN = ICON_CARET_DOWN;
}
