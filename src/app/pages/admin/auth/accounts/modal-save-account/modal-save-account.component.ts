import {Component, Input, OnInit} from '@angular/core';
import {AlphanumericOnlyDirective} from "../../../../../shared/directives/alphanumeric-only.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HasAuthorityDirective} from "../../../../../shared/directives/has-authority.directive";
import {Location, NgIf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {SafeHtmlPipe} from "../../../../../shared/pipes/safe-html.pipe";
import {SaveAccountRequest} from '../../../../../core/models/account.model';
import {Role, RolesFilter} from '../../../../../core/models/role.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../../shared/utils/utils.service';
import {AccountsService} from '../../../../../core/services/accounts.service';
import {ToastrService} from 'ngx-toastr';
import {RolesService} from '../../../../../core/services/roles.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../../../../shared/utils/icon';
import {Authorities} from '../../../../../constants/authorities.constants';

@Component({
  selector: 'app-modal-save-account',
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
  templateUrl: './modal-save-account.component.html',
  styleUrl: './modal-save-account.component.scss'
})
export class ModalSaveAccountComponent implements OnInit {
  @Input() accountId: number = 0;
  hiddenPassword = true;
  isLoading = false;
  roles: Role[] = [];
  account: SaveAccountRequest = {
    id: 0,
    username: '',
    email: '',
    password: '',
    roleIds: []
  };

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    protected utilsService: UtilsService,
    private accountsService: AccountsService,
    private toast: ToastrService,
    private roleService: RolesService
  ) {
    this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnInit(): void {
    if (this.accountId) {
      this.getAccountInfo();
    }

    this.getRoles();
  }

  getAccountInfo() {
    this.accountsService.getAccountDetail(this.accountId).subscribe(response => {
      if (response) {
        this.account.id = this.accountId;
        this.account.username = response.username;
        this.account.fullname = response.fullname;
        this.account.email = response.email;

        if (response.accountRoles) {
          this.account.roleIds = response.accountRoles.map(authority => authority.id);
        }
      }
    });
  }

  onSave() {
    if (!this.account.username) {
      this.toast.error('Tài khoản không được để trống', 'Thông báo');
      return;
    }

    if (!this.account.email) {
      this.toast.error('Email không được để trống', 'Thông báo');
      return;
    }

    if (!this.account.id || this.account.id <= 0) {
      if (!this.account.password) {
        this.toast.error('Mật khẩu không được để trống', 'Thông báo');
        return;
      } else if (!this.utilsService.validatePassword(this.account.password)) {
        return;
      }
    }

    if (!this.account.roleIds || this.account.roleIds.length == 0) {
      this.toast.error('Vai trò không được để trống', 'Thông báo');
      return;
    }

    if (!this.account.id) {
      this.accountsService.createAccount(this.account).subscribe(value => {
        this.toast.success(value.message, 'Thông báo');
        this.activeModal.close(value);
      });
    } else {
      this.accountsService.updateAccount(this.account).subscribe(value => {
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
