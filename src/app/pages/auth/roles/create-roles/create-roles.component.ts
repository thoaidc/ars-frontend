import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NgIf} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RolesService} from '../../../../core/services/roles.service';
import {Authorities} from '../../../../constants/authorities.constants';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {FormsModule} from '@angular/forms';
import {TreeViewComponent} from '../tree-view/tree-view.component';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';
import {CreateRoleRequest, RoleDetail, TreeViewItem, UpdateRoleRequest} from '../../../../core/models/role.model';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {ICON_ATTENTION} from '../../../../shared/utils/icon';

@Component({
  selector: 'app-create-roles',
  standalone: true,
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss'],
  imports: [
    HasAuthorityDirective,
    FormsModule,
    TreeViewComponent,
    AlphanumericOnlyDirective,
    NgIf,
    SafeHtmlPipe
  ]
})
export class CreateRolesComponent implements OnInit {
  Authority = Authorities;
  roleDetail: RoleDetail = { id: 0, name: '', code: '', permissions: [] };
  totalItems = 0;
  roleId: number = 0;
  children: TreeViewItem[] = [];
  listSelected: number[] = [];
  disableButton = false;
  isView = false;

  constructor(
    private rolesService: RolesService,
    private toast: ToastrService,
    public activeModal: NgbActiveModal
  ) {}

  async ngOnInit() {
    this.getPermission();

    if (this.roleId) {
      this.onRoleDetail(this.roleId);
    }
  }

  getPermission() {
    this.rolesService.getPermissions().subscribe((treeViewItems: TreeViewItem[]) => {
      this.children = treeViewItems;
      this.totalItems = treeViewItems.length;
    });
  }

  dismiss(value: any) {
    this.activeModal.close(value);
  }

  create() {
    this.roleDetail.permissions = this.listSelected;

    if (!this.checkRolePermission()) {
      return;
    }

    this.disableButton = true;
    const createRoleRequest: CreateRoleRequest = {
      name: this.roleDetail.name,
      code: this.roleDetail.code,
      permissionIds: this.roleDetail.permissions
    };

    const updateRoleRequest: UpdateRoleRequest = {
      ...createRoleRequest,
      id: this.roleId
    }

    if (this.roleId > 0) {
      this.rolesService.update(updateRoleRequest).subscribe(response => {
        if (response && response.status) {
          this.toast.success('Cập nhật vai trò thành công', 'Thông báo');
          this.searchRolesComponent();
          this.dismiss(response);
          this.disableButton = false;
        } else {
          this.toast.error(response.message || 'Cật nhật vai trò thất bại', 'Thông báo');
        }
      });
    } else {
      this.rolesService.create(createRoleRequest).subscribe(response => {
        if (response && response.status) {
          this.toast.success('Tạo mới vai trò thành công', 'Thông báo');
          this.searchRolesComponent();
          this.dismiss(response);
          this.disableButton = false;
        } else {
          this.toast.error(response.message || 'Tạo mới vai trò thất bại', 'Thông báo');
        }
      });
    }

    this.disableButton = false;
  }

  checkRolePermission() {
    if (!this.roleDetail.code) {
      this.toast.error('Mã vai trò không được để trống', 'Thông báo');
      return false;
    }

    if (!this.roleDetail.name) {
      this.toast.error('Tên vai trò không được để trống', 'Thông báo');
      return false;
    }

    if (!this.roleDetail.permissions) {
      this.toast.error('Danh sách quyền không được để trống', 'Thông báo');
      return false;
    }

    return true;
  }

  onRoleDetail(id: any) {
    this.rolesService.getRoleDetail(id).subscribe((roleDetail: RoleDetail | null) => {
      if (roleDetail) {
        this.roleDetail = roleDetail;
        this.listSelected = roleDetail.permissions || [];
      }
    });
  }

  searchRolesComponent(): void {
    this.rolesService.triggerSearch();
  }

  receiveListSelected(data: number[]) {
    this.listSelected = data;
  }

  protected readonly ICON_ATTENTION = ICON_ATTENTION;
}
