import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Location, NgIf} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {FormsModule} from '@angular/forms';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';
import {UpdateUserPasswordRequest} from '../../../../core/models/user.model';
import {UserService} from '../../../../core/services/users.service';

@Component({
  selector: 'app-modal-change-password',
  standalone: true,
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss'],
  imports: [
    SafeHtmlPipe,
    FormsModule,
    AlphanumericOnlyDirective,
    NgIf
  ]
})
export class ModalChangePasswordComponent {
  updateUserPassword: UpdateUserPasswordRequest = { id: 0, oldPassword: '', newPassword: '' };
  userId: number = 0;
  hideOldPassword = true;
  hideNewPassword = true;
  hideRepeatNewPassword = true;
  repeatNewPassword: string = '';
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    protected utilsService: UtilsService,
    private userService: UserService,
    private toast: ToastrService
  ) {
    this.location.subscribe(() => this.activeModal.dismiss());
  }

  onSave() {
    if (!this.updateUserPassword.oldPassword) {
      this.toast.error('Mật khẩu hiện tại không được để trống', 'Thông báo');
      return;
    }

    if (!this.updateUserPassword.newPassword) {
      this.toast.error('Mật khẩu mới không được để trống', 'Thông báo');
      return;
    } else {
      if (!this.utilsService.validatePassword(this.updateUserPassword.newPassword)) {
        return;
      }
    }

    if (!this.repeatNewPassword) {
      this.toast.error('Vui lòng xác nhận mật khẩu mới', 'Thông báo');
      return;
    } else {
      if (!this.utilsService.validatePassword(this.repeatNewPassword)) {
        return;
      }
    }

    if (this.updateUserPassword.newPassword !== this.repeatNewPassword) {
      this.toast.error('Xác nhận mật khẩu mới không chính xác', 'Thông báo');
      return;
    }

    if (this.updateUserPassword.oldPassword === this.updateUserPassword.newPassword) {
      this.toast.error('Mật khẩu mới không được trùng mật khẩu hiện tại', 'Thông báo');
      return;
    }

    this.updateUserPassword.id = this.userId;

    this.userService.updateUserPassword(this.updateUserPassword).subscribe(response => {
      this.activeModal.close(response);
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  protected readonly ICON_EYE_CROSS = ICON_EYE_CROSS;
  protected readonly ICON_EYE = ICON_EYE;
}
