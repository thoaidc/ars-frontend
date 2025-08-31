import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {RolesService} from '../../../../core/services/roles.service';
import {TreeViewItemComponent} from '../tree-view-item/tree-view-item.component';
import {TreeViewItem} from '../../../../core/models/role.model';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [
    TreeViewItemComponent
  ],
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements AfterViewInit {
  @Input() isView = false;
  @Input() tree?: TreeViewItem[];
  @Input() listSelected: number[] = [];
  @Output() sendListEvent = new EventEmitter<number[]>();
  selectedItem: TreeViewItem[] = [];

  constructor(private checkService: RolesService) {
    this.checkService.checkEvent.subscribe(() => {
      this.selectedItem = [];
      this.tree!.forEach(item => this.updateTree(item));
    });
  }

  /**
   * Lại là mấy vòng for vớ vẩn nữa để check nếu 1 children mà parent nó là ae với 1 role trong list
   * thì bỏ check thằng role đó, ai đó nếu có ý tưởng hay hơn thì sửa giùm vs, đoạn này chỉ check ngược được 1 tầng thui
   * @Author phuonghv
   * @param node
   */
  updateTree(node: TreeViewItem): void {
    if (node.children?.length) {
      node.checked = false;
      node.children.forEach(item => {
        this.updateTree(item);

        if (item.checked) {
          node.checked = true;
        }
      });
    }

    if (node.checked) {
      this.selectedItem!.push(node);
    }
  }

  setCollapsedAll(node: any, isExpand: any): void {
    node.collapsed = isExpand;
    node.children.forEach((item: any) => this.setCollapsedAll(item, isExpand));
  }

  sendListSelected() {
    this.listSelected = [];

    if (this.selectedItem.length > 0) {
      for (const item of this.selectedItem) {
        if (item.checked) {
          this.listSelected.push(item.id);
        }
      }
    }

    const listToSend: number[] = this.listSelected;
    this.sendListEvent.emit(listToSend);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkTree(), 500);
  }

  checkTree() {
    if (!this.tree || this.tree.length <= 0) {
      return;
    }

    for (const item of this.tree) {
      if (this.listSelected.includes(item.id)) {
        item.checked = true;
        this.selectedItem?.push(item);
      }

      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          if (this.listSelected.includes(child.id)) {
            child.checked = true;
            this.selectedItem?.push(child);
          }

          if (child.children && child.children.length > 0) {
            for (const child1 of child.children) {
              if (this.listSelected.includes(child1.id)) {
                child1.checked = true;
                this.selectedItem?.push(child1);
              }
            }
          }
        }
      }
    }
  }
}
