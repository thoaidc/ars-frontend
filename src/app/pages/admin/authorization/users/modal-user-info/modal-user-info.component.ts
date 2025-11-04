import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Location, NgClass, NgIf} from '@angular/common';
import {UserService} from '../../../../../core/services/users.service';
import {RolesService} from '../../../../../core/services/roles.service';
import {Authorities} from '../../../../../constants/authorities.constants';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {UserDetail} from '../../../../../core/models/user.model';
import {Role, RolesFilter} from '../../../../../core/models/role.model';
import {USER_STATUS, USER_STATUS_MAP} from '../../../../../constants/user.constants';

@Component({
  selector: 'app-modal-user-info',
  standalone: true,
  templateUrl: './modal-user-info.component.html',
  styleUrls: ['./modal-user-info.component.scss'],
  imports: [
    FormsModule,
    NgSelectModule,
    NgIf,
    NgClass
  ]
})
export class ModalUserInfoComponent implements OnInit {
  userId: number = 0;
  userDetail!: UserDetail;
  userAuthorities: number[] = [];
  roles: Role[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    private userService: UserService,
    private roleService: RolesService
  ) {
    this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUserDetail(this.userId).subscribe(response => {
        if (response) {
          this.userDetail = response;

          if (this.userDetail.roles) {
            this.userAuthorities = this.userDetail.roles.map(authority => authority.id);
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
  protected readonly USER_STATUS = USER_STATUS;
  protected readonly USER_STATUS_MAP = USER_STATUS_MAP;
}
