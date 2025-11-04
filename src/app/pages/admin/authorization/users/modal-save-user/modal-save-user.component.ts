import {Component, Input, OnInit} from '@angular/core';
import {AlphanumericOnlyDirective} from '../../../../../shared/directives/alphanumeric-only.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HasAuthorityDirective} from '../../../../../shared/directives/has-authority.directive';
import {Location, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {SafeHtmlPipe} from '../../../../../shared/pipes/safe-html.pipe';
import {Role, RolesFilter} from '../../../../../core/models/role.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {RolesService} from '../../../../../core/services/roles.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../../../../shared/utils/icon';
import {Authorities} from '../../../../../constants/authorities.constants';
import {UserService} from '../../../../../core/services/users.service';
import {SaveUserRequest} from '../../../../../core/models/user.model';

@Component({
  selector: 'app-modal-save-user',
  standalone: true,
    imports: [
      AlphanumericOnlyDirective,
      FormsModule,
      HasAuthorityDirective,
      NgIf,
      NgSelectComponent,
      ReactiveFormsModule,
      SafeHtmlPipe
    ],
  templateUrl: './modal-save-user.component.html',
  styleUrl: './modal-save-user.component.scss'
})
export class ModalSaveUserComponent implements OnInit {
  @Input() userId: number = 0;
  hiddenPassword = true;
  isLoading = false;
  roles: Role[] = [];
  user: SaveUserRequest = {
    id: 0,
    fullname: '',
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    roleIds: []
  };

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    protected utilsService: UtilsService,
    private userService: UserService,
    private toast: ToastrService,
    private roleService: RolesService
  ) {
    this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUserInfo();
    }

    this.getRoles();
  }

  getUserInfo() {
    this.userService.getUserDetail(this.userId).subscribe(response => {
      if (response) {
        this.user.id = this.userId;
        this.user.username = response.username;
        this.user.fullname = response.fullname;
        this.user.email = response.email;

        if (response.roles) {
          this.user.roleIds = response.roles.map(authority => authority.id);
        }
      }
    });
  }

  onSave() {
    if (!this.user.username) {
      this.toast.error('Tài khoản không được để trống', 'Thông báo');
      return;
    }

    if (!this.user.email) {
      this.toast.error('Email không được để trống', 'Thông báo');
      return;
    }

    if (!this.user.id || this.user.id <= 0) {
      if (!this.user.password) {
        this.toast.error('Mật khẩu không được để trống', 'Thông báo');
        return;
      } else if (!this.utilsService.validatePassword(this.user.password)) {
        return;
      }
    }

    if (!this.user.roleIds || this.user.roleIds.length == 0) {
      this.toast.error('Vai trò không được để trống', 'Thông báo');
      return;
    }

    if (!this.user.id) {
      this.userService.createUser(this.user).subscribe(value => {
        this.toast.success(value.message, 'Thông báo');
        this.activeModal.close(value);
      });
    } else {
      this.userService.updateUser(this.user).subscribe(value => {
        this.toast.success(value.message, 'Thông báo');
        this.activeModal.close(value);
      });
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  getRoles() {
    const searchRoleRequest: RolesFilter = {
      page: 0,
      size: 100
    }

    this.roleService.getRoles(searchRoleRequest).subscribe(response => {
      if (response && response.status && response.result as Role[]) {
        this.roles = response.result as Role[];
      } else {
        this.roles = [];
      }
    });
  }

  protected readonly ICON_EYE_CROSS = ICON_EYE_CROSS;
  protected readonly ICON_EYE = ICON_EYE;
  protected readonly Authorities = Authorities;
}
