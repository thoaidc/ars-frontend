import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {UtilsService} from '../../shared/utils/utils.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../shared/utils/icon';
import {SafeHtmlPipe} from '../../shared/pipes/safe-html.pipe';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SafeHtmlPipe,
    FormsModule,
    NgIf,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isHiddenPassword: boolean = true;
  isShop: boolean = false;

  // Register payload used by template
  registerRequest: any = {
    username: '',
    password: '',
    fullname: '',
    phone: '',
    email: ''
  };
  shopName: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private translateService: TranslateService
  ) {}

  toggleDisplayPassword() {
    this.isHiddenPassword = !this.isHiddenPassword;
  }

  register() {
    if (!this.registerRequest.username) {
      this.toastr.error(this.translateService.instant('notification.notEmptyUsername'));
      return;
    }

    if (!this.registerRequest.fullname) {
      this.toastr.error(this.translateService.instant('notification.notEmptyFullname') || 'Full name is required');
      return;
    }

    if (!this.registerRequest.email) {
      this.toastr.error(this.translateService.instant('notification.notEmptyEmail') || 'Email is required');
      return;
    }

    if (!this.registerRequest.phone) {
      this.toastr.error(this.translateService.instant('notification.notEmptyPhone') || 'Phone is required');
      return;
    }

    if (!this.registerRequest.password) {
      this.toastr.error(this.translateService.instant('notification.notEmptyPassword'));
      return;
    } else if (!this.utilsService.validatePassword(this.registerRequest.password)) {
      return;
    }

    if (this.isShop && !this.shopName) {
      this.toastr.error(this.translateService.instant('notification.notEmptyShopName') || 'Shop name is required');
      return;
    }

    // build payload
    const payload = { ...this.registerRequest } as any;
    if (this.isShop) payload.shopName = this.shopName;

    // Call register API. pass isShop flag as query param
    this.authService.register(payload, this.isShop).subscribe({
      next: (_res) => {
        this.toastr.success(this.translateService.instant('notification.registerSuccess') || 'Register success');
        // redirect to login
        this.router.navigate(['/login']).then();
      },
      error: (err) => {
        // show backend message if provided
        const msg = err?.error?.message || this.translateService.instant('notification.registerFailed') || 'Register failed';
        this.toastr.error(msg);
      }
    });
  }

  protected readonly ICON_EYE = ICON_EYE;
  protected readonly ICON_EYE_CROSS = ICON_EYE_CROSS;
}
