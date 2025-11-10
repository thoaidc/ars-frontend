import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RolesService} from '../../../../core/services/roles.service';
import {CreateRolesComponent} from './create-roles/create-roles.component';
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../../shared/utils/icon';
import {Authorities} from '../../../../constants/authorities.constants';
import {ModalConfirmDialogComponent} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgClass, NgFor} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {Role, RolesFilter} from '../../../../core/models/role.model';
import {PAGINATION_PAGE_SIZE} from '../../../../constants/common.constants';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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
    NgbTooltip,
    TranslatePipe
  ]
})
export class RolesComponent implements OnInit {
  totalItems = 0;
  listSelected: any = [];
  roles: any = [];
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
    private translateService: TranslateService
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
    this.modalRef.componentInstance.title = '';
    this.modalRef.componentInstance.classBtn = 'btn-delete';

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        this.roleService.delete(role.id).subscribe(response => {
          if (response && response.status) {
            this.toast.success(response.message || this.translateService.instant('text.deleteSuccess'));
            this.getRoles();
          } else {
            this.toast.error(response.message || this.translateService.instant('text.deleteFailed'));
          }
        });
      }
    });
  }

  copyAuthorities(id: any) {
    this.roleService.getRoleDetail(id).subscribe(roleDetail => {
      if (roleDetail) {
        const roleName = roleDetail.name;
        this.toast.success(this.translateService.instant('notification.copeRoleAuthoritiesSuccess', { roleName }));
        this.modalRef = this.modalService.open(CreateRolesComponent, {size: 'xl', backdrop: 'static'});
        this.modalRef.componentInstance.listSelected = JSON.parse(JSON.stringify(roleDetail.authorities));
      } else {
        this.toast.error(this.translateService.instant('notification.copyFailed'));
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
