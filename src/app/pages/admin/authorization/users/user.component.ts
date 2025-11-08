import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs/esm';
import { ToastrService } from 'ngx-toastr';
import { ModalChangePasswordComponent } from './modal-change-password/modal-change-password.component';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {AuthService} from '../../../../core/services/auth.service';
import {Authorities} from '../../../../constants/authorities.constants';
import {ModalConfirmDialogComponent} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {
  ICON_DELETE,
  ICON_KEY,
  ICON_PLAY,
  ICON_PLUS,
  ICON_RELOAD,
  ICON_SEARCH,
  ICON_STOP,
  ICON_UPDATE
} from '../../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {DatePipe, DecimalPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DateFilterComponent} from '../../../../shared/components/date-filter/date-filter.component';
import {PAGINATION_PAGE_SIZE} from '../../../../constants/common.constants';
import {LOCAL_USERNAME_KEY} from '../../../../constants/local-storage.constants';
import {BaseResponse} from '../../../../core/models/response.model';
import {BaseFilterRequest} from '../../../../core/models/request.model';
import {USER_STATUS, USER_STATUS_OPTIONS} from '../../../../constants/user.constants';
import {UpdateUserStatusRequest, User} from '../../../../core/models/user.model';
import {UserService} from '../../../../core/services/users.service';
import {ModalSaveUserComponent} from './modal-save-user/modal-save-user.component';
import {ModalUserInfoComponent} from './modal-user-info/modal-user-info.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-management',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    SafeHtmlPipe,
    HasAuthorityDirective,
    DecimalPipe,
    FormsModule,
    NgSelectModule,
    NgbPagination,
    DateFilterComponent,
    DatePipe,
    NgClass,
    NgIf,
    NgFor,
    NgbTooltip,
    TranslatePipe
  ]
})
export class UserComponent implements OnInit {
  private modalRef: NgbModalRef | undefined;
  userFilter = {
    page: 1,
    size: 10,
    status: '',
    keyword: '',
    fromDate: dayjs().startOf('day'),
    toDate: dayjs().endOf('day')
  };
  users: User[] = [];
  totalItems = 0;
  username = '';
  periods = 1;
  isLoading = false;
  userStatusOption: any = USER_STATUS_OPTIONS;

  constructor(
    protected modalService: NgbModal,
    private userService: UserService,
    private utilsService: UtilsService,
    private toast: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.onReload();
    this.username = localStorage.getItem(LOCAL_USERNAME_KEY) || '';
    this.userStatusOption = this.utilsService.translateList(this.userStatusOption);
  }

  onReload() {
    this.periods = 1;
    this.userFilter = {
      page: 1,
      size: 10,
      status: '',
      keyword: '',
      fromDate: dayjs().startOf('day'),
      toDate: dayjs().endOf('day')
    };

    this.onSearch();
  }

  onTimeChange(even: any) {
    this.userFilter.fromDate = even.fromDate;
    this.userFilter.toDate = even.toDate;
    this.periods = even.periods;
    this.onSearch();
  }

  onSearch() {
    this.userFilter.page = 1;
    this.getUsers();
  }

  getUsers() {
    const searchAccountsRequest: BaseFilterRequest = {
      page: this.userFilter.page - 1,
      size: this.userFilter.size
    };

    if (this.userFilter.keyword) {
      searchAccountsRequest.keyword = this.userFilter.keyword;
    }

    if (Object.values(USER_STATUS).includes(this.userFilter.status as USER_STATUS)) {
      searchAccountsRequest.status = this.userFilter.status;
    }

    if (this.userFilter.fromDate) {
      const fromDate = this.userFilter.fromDate.toString();
      searchAccountsRequest.fromDate = this.utilsService.convertToDateString(fromDate, 'YYYY-MM-DD HH:mm:ss');
    }

    if (this.userFilter.toDate) {
      const toDate = this.userFilter.toDate.toString();
      searchAccountsRequest.toDate = this.utilsService.convertToDateString(toDate, 'YYYY-MM-DD HH:mm:ss');
    }

    this.userService.getUsersWithPaging(searchAccountsRequest).subscribe((response) => {
      this.users = [];

      if (response && response.result as User[]) {
        this.users = response.result as User[];
        this.totalItems = response.total || 0;
      }
    });
  }

  openModalSaveAccount(userId?: number) {
    this.modalRef = this.modalService.open(ModalSaveUserComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.userId = userId || 0;
    this.modalRef.closed.subscribe(() => this.getUsers());
  }

  openModalAccountDetail(userId: number) {
    this.modalRef = this.modalService.open(ModalUserInfoComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.userId = userId;
  }

  updateUserStatus(userId: number, status: string) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, { backdrop: 'static' });

    switch (status) {
      case USER_STATUS.INACTIVE: {
        this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn mở hoạt động tài khoản này?';
        this.modalRef.componentInstance.classBtn = 'save-button-dialog';
        break;
      }

      case USER_STATUS.ACTIVE: {
        this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn ngưng hoạt động tài khoản này?';
        this.modalRef.componentInstance.classBtn = 'btn-delete';
        break;
      }
    }

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        const request: UpdateUserStatusRequest = { id: userId, status: status };

        this.userService.updateUserStatus(request).subscribe(response => {
          if (response && response.status) {
            this.toast.success(response.message, 'Thông báo');
            this.getUsers();
          } else {
            this.toast.error(response.message || 'Cập nhật thất bại!');
          }
        });
      }
    });
  }

  changePassword(account: any) {
    this.modalRef = this.modalService.open(ModalChangePasswordComponent, {backdrop: 'static'});
    this.modalRef.componentInstance.userId = account.id;

    this.modalRef.closed.subscribe((response?: BaseResponse<any>) => {
      if (response && response.status) {
        if (account.username.toLowerCase() === this.username.toLowerCase()) {
          this.toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại', 'Thông báo');
          this.authService.logout();
        } else {
          this.toast.success('Đổi mật khẩu thành công', 'Thông báo');
          this.getUsers();
        }
      }

      if (response && !response.status) {
        this.toast.error('Cập nhật thất bại', 'Thông báo');
      }
    });
  }

  deleteUser(userId: any) {
    if (!userId) {
      this.toast.success('Không tìm thấy thông tin tài khoản', 'Thông báo');
      return;
    }

    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn xoá tài khoản này?';
    this.modalRef.componentInstance.classBtn = 'btn-delete';

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        this.userService.deleteUser(userId).subscribe(response => {
          if (response.status) {
            this.toast.success('Xóa tài khoản thành công', 'Thông báo');
            this.getUsers();
          } else {
            this.toast.error(response.message, 'Xóa tài khoản thất bại');
          }
        });
      }
    });
  }

  loadMore($event: any) {
    this.userFilter.page = $event;
    this.getUsers();
  }

  protected readonly ICON_RELOAD = ICON_RELOAD;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_STOP = ICON_STOP;
  protected readonly ICON_PLAY = ICON_PLAY;
  protected readonly ICON_KEY = ICON_KEY;
  protected readonly Authorities = Authorities;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly USER_STATUS = USER_STATUS;
}
