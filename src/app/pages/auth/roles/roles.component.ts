import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RolesService} from '../../../core/services/roles.service';
import {CreateRolesComponent} from './create-roles/create-roles.component';
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../shared/utils/icon';
import {Authorities} from '../../../constants/authorities.constants';
import {ModalConfirmDialogComponent} from '../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {HasAuthorityDirective} from '../../../shared/directives/has-authority.directive';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgClass, NgFor} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {Role, RolesFilter, TreeViewItem} from '../../../core/models/role.model';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';

@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  imports: [
    SafeHtmlPipe,
    HasAuthorityDirective,
    FormsModule,
    DecimalPipe,
    NgSelectModule,
    NgbPagination,
    NgClass,
    NgFor,
    NgbTooltip
  ]
})
export class RolesComponent implements OnInit {
  totalItems = 0;
  listSelected: any = [];
  roles: any = [];
  permissions: TreeViewItem[] = [];
  rolesFilter: RolesFilter = {
    page: 1,
    size: 10,
    keyword: ''
  };
  user: any;
  isLoading = false;
  private modalRef: NgbModalRef | undefined;

  constructor(
    private roleService: RolesService,
    private toast: ToastrService,
    protected modalService: NgbModal,
  ) {
    this.roleService.searchObservable$.subscribe(() => {
      this.onSearch();
    });
  }

  async ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.rolesFilter.page = 1;
    this.getRoles();
  }

  getRoles() {
    const searchRoleRequest: RolesFilter = {
      ...this.rolesFilter,
      page: this.rolesFilter.page - 1
    }

    if (this.rolesFilter.keyword) {
      searchRoleRequest.keyword = this.rolesFilter.keyword;
    }

    this.roleService.getRoles(searchRoleRequest).subscribe(response => {
      if (response && response.status && response.result as Role[]) {
        this.roles = response.result as Role[];
        this.totalItems = response.total || 0;
      } else {
        this.roles = [];
      }
    });
  }

  onChangedPage(event: any): void {
    this.rolesFilter.page = event;
    this.getRoles();
  }

  openModalCreateRole(roleId?: any) {
    this.modalRef = this.modalService.open(CreateRolesComponent, {size: 'xl', backdrop: 'static'});
    this.modalRef.componentInstance.roleId = roleId || 0;
  }

  delete(role: any) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn xoá vai trò này?';
    this.modalRef.componentInstance.classBtn = 'btn-delete';

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        this.roleService.delete(role.id).subscribe(response => {
          if (response && response.status) {
            this.toast.success(response.message || 'Xóa thành công', 'Thông báo');
            this.getRoles();
          } else {
            this.toast.error(response.message || 'Xóa thất bại');
          }
        });
      }
    });
  }

  copyPermissions(id: any) {
    this.roleService.getRoleDetail(id).subscribe(roleDetail => {
      if (roleDetail) {
        this.toast.success('Sao chép quyền của vai trò ' + roleDetail.name + ' thành công.');
        this.modalRef = this.modalService.open(CreateRolesComponent, {size: 'xl', backdrop: 'static'});
        this.modalRef.componentInstance.listSelected = JSON.parse(JSON.stringify(roleDetail.permissions));
      } else {
        this.toast.error('Sao chép thất bại');
      }
    });
  }

  view(roleId: number) {
    this.modalRef = this.modalService.open(CreateRolesComponent, {size: 'xl', backdrop: 'static'});
    this.modalRef.componentInstance.roleId = roleId;
    this.modalRef.componentInstance.isView = true;
  }

  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly Authorities = Authorities;
  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
}
