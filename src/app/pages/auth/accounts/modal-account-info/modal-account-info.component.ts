import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Location, NgClass, NgIf} from '@angular/common';
import {AccountsService} from '../../../../core/services/accounts.service';
import {RolesService} from '../../../../core/services/roles.service';
import {Authorities} from '../../../../constants/authorities.constants';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {AccountDetail, AccountStatus, AccountStatusMap} from '../../../../core/models/account.model';
import {Role, RolesFilter} from '../../../../core/models/role.model';

@Component({
  selector: 'app-modal-account-info',
  standalone: true,
  templateUrl: './modal-account-info.component.html',
  styleUrls: ['./modal-account-info.component.scss'],
  imports: [
    FormsModule,
    NgSelectModule,
    NgIf,
    NgClass
  ]
})
export class ModalAccountInfoComponent implements OnInit {
  accountId: number = 0;
  accountDetail!: AccountDetail;
  accountAuthorities: number[] = [];
  roles: Role[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    private accountsService: AccountsService,
    private roleService: RolesService
  ) {
    this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnInit(): void {
    if (this.accountId) {
      this.accountsService.getAccountDetail(this.accountId).subscribe(response => {
        if (response) {
          this.accountDetail = response;

          if (this.accountDetail.accountRoles) {
            this.accountAuthorities = this.accountDetail.accountRoles.map(authority => authority.id);
          }
        }
      });
    }

    this.getRoles();
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

  protected readonly Authorities = Authorities;
  protected readonly AccountStatus = AccountStatus;
  protected readonly AccountStatusMap = AccountStatusMap;
}
